'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { convertToPlainObject, formatError } from "../utils"
import { auth } from "@/auth"
import { getMyCar } from "./cart.actions"
import { getUserById } from "./user.actions"
import { insertOrderSchema } from "../validators"
import { prisma } from "@/db/prisma"
import { CartItem,PaymentResult } from "@/types"
import { paypal } from "../paypal"
import { revalidatePath } from "next/cache"

//Order and order item

export async function createOrder(){
    try{

        const session=await auth()
        if(!session) throw new Error('User is not authenticated')

        const cart= await getMyCar();
        const userId= session?.user?.id
        if(!userId) throw new Error('User not found')

        const user=await getUserById(userId);
        if(!cart|| cart.items.length===0){
            return {success:false,message:'Your cart is empty',redirectTo:'/cart' }
        }
         if(!user.address){
            return {success:false,message:'No shipping address',redirectTo:'/shipping-address' }
        }
         if(!user.paymentMethod){
            return {success:false,message:'No payment method',redirectTo:'/payment-method' }
        }

        const order=insertOrderSchema.parse({
            userId:user.id,
            shippingAddress:user.address,
            paymentMethod:user.paymentMethod,
            itemsPrice:cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            taxPrice:cart.taxPrice,
            totalPrice:cart.totalPrice,
        })

        //Create a transaction
        const insertedOrderId=await prisma.$transaction(async(tx)=>{
           const insertedOrder= await tx.order.create({data:order})

           for(const item of cart.items as CartItem[]){
            await tx.orderItem.create({
                data:{
                    ...item,
                    price:item.price,
                    orderId:insertedOrder.id
                }
            })
           }
           //Clear cart
           await tx.cart.update({
            where:{id:cart.id},
            data:{
                items:[],
                totalPrice:0,
                taxPrice:0,
                shippingPrice:0,
                itemsPrice:0
             }
           })
           return insertedOrder.id;
        })
        if(!insertedOrderId)throw new Error('Order not created')
        return {success:true,message:'Order created', redirectTo:`/order/${insertedOrderId}`}
    }catch(error){
        if(isRedirectError(error))throw error
        return {success:false, message:formatError(error)}

    }
}

//Get order by Id

export async function getOrderById(orderId:string){
    const data=await prisma.order.findFirst({
        where:{
            id:orderId
        },
        include:{
            orderitems:true,
            user:{select:{name:true,email:true}}
        }

    })
    
    return convertToPlainObject(data)
}

//Create a new paypal order
export async function createPaypalOrder(orderId:string){
    try{
        const order= await prisma.order.findFirst({
            where:{
                id:orderId
            }
        })
        if(order){
            const paypalOrder= await paypal.createOrder(Number(order.totalPrice))

            await prisma.order.update({
                where:{
                    id:orderId
                },
                data:{
                    paymentResult:{
                        id:paypalOrder.id,
                        email_address:'',
                        status:'',
                        pricePaid:0
                    }
                }
            })
            return {
                success:true,
                message:'Item order created successfully',
                data:paypalOrder.id
            }

        }else{
            throw new Error('Order not found')
        }


    }catch(error){
        return { success:false,message:formatError(error)}
    }
}

//aprove paypalOrder

export async function approvePaypalOrder(orderId:string, data:{orderID:string}){

    try{
        const order= await prisma.order.findFirst({
            where:{
                id:orderId
            }
        })
        if(!order) throw new Error('Order not found')

        const captureData=await paypal.capturePayment(data.orderID)

        if(!captureData ||captureData.id!==(order.paymentResult as  PaymentResult)?.id || captureData.status !=='COMPLETED'){
            throw new Error('Error in Paypal Payment')
        }
        await updateOrderToPaid({
            orderId,
            paymentResult:{
                id:captureData.id,
                status:captureData.status,
                email_address:captureData.payer.email_address,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
            }
        })
        revalidatePath(`/order/${orderId}`)
        return{
            success:true,
            message:'Your order has been paid'
        }
    }catch(error){
        return {success:false,message:formatError(error)}

    }

}

async function updateOrderToPaid({
    orderId,
    paymentResult

}:{
    orderId:string;
    paymentResult?:PaymentResult
}){

       const order= await prisma.order.findFirst({
            where:{
                id:orderId
            },
            include:{
                orderitems:true
            }
        })
        if(!order) throw new Error('Order not found');

        if(order.isPaid) throw new Error('Order is already paid')

        //Transation to update order and account for product stock

        await prisma.$transaction(async(tx)=>{
            for(const item of order.orderitems){
                await tx.product.update({
                    where:{id:item.productId},
                    data:{stock:{increment:-item.qty}},
                })
            }
            await tx.order.update({
                where:{id:orderId},
                data:{
                    isPaid:true,
                    paidAt:new Date(),
                    paymentResult
                }
            })
        })
        const updateOrder= await prisma.order.findFirst({
            where:{id:orderId},
            include:{
                orderitems:true,
                user:{select:{name:true,email:true}}
            }
        })
        if(!updateOrder) throw new Error('Order not found')

}
