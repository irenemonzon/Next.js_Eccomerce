'use server'

import { CartItem } from "@/types"
import { cookies } from "next/headers"
import { convertToPlainObject, formatError, round2 } from "../utils"
import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { cartItemSchema, insertCartSchema } from "../validators"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

//Calculate cart price

const calcPrice=(items:CartItem[])=>{
    const itemsPrice=round2(
        items.reduce((acc,item)=>acc + Number(item.price) * item.qty,0)
    ),
    shippingPrice=round2(itemsPrice>100 ? 0:10),
    taxPrice=round2(0.15 *itemsPrice),
    totalPrice=round2(itemsPrice+taxPrice +shippingPrice)

    return {
        itemsPrice:itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice:taxPrice.toFixed(2),
        totalPrice:totalPrice.toFixed(2),
    }

}

export async function addItemToCart(data:CartItem){
    try{
        //Check for cart cokkie
        const sessionCartId=(await cookies()).get('sessionCartId')?.value

       if(!sessionCartId)throw new Error('Cart session not found')


        const session= await auth();

        const userId=session?.user?.id ?(session.user.id as string):undefined

        //Get cart
        const cart= await getMyCar();

        const item=cartItemSchema.parse(data)

        const product=await prisma.product.findFirst({
            where:{id:item.productId}
        })

        if(!product)throw new Error('Product not found')

        if(!cart){
            const newCart=insertCartSchema.parse({
                userId:userId,
                items:[item],
                sessionCartId:sessionCartId,
                ...calcPrice([item])
            })
            await prisma.cart.create({
                data:newCart
                
            })
            revalidatePath(`/product/${product.slug}`)
            
            return{
                success:true,
                message:`${product.name} added to cart`,
            }
        }else{
            //check item exist
            const existItem=(cart.items as CartItem[]).find((x)=>x.productId===item.productId);

            if(existItem){
                if(product.stock<existItem.qty+1){
                    throw new Error('Not enough stock')
                }
                (cart.items as CartItem[]).find((x)=>x.productId===item.productId)!.qty= existItem.qty +1
            }else{
                //if the item doesn't exist
                if(product.stock<1) throw new Error('Not enough stock')

                cart.items.push(item)
            }
            await prisma.cart.update({
                where:{id:cart.id},
                data:{
                    items:cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[])
                }
            })
            revalidatePath(`/product/${product.slug}`);
            return{
                success:true,
                message:`${product.name} ${existItem ? 'update in': 'added to cart'}`
            }

        }    
        
    }catch(error){
        return{
            success:true,
            message:formatError(error)
        }

    }
    
}

export async function getMyCar(){

    const sessionCartId=(await cookies()).get('sessionCartId')?.value
    if(!sessionCartId)throw new Error('Cart session not found')

    const session= await auth();
    const userId=session?.user?.id ?(session.user.id as string):undefined

    // Get user car from database
    const cart=await prisma.cart.findFirst({
        where:userId ? {userId:userId}:{sessionCartId:sessionCartId}
    })

    if(!cart) return undefined
    return convertToPlainObject({
        ...cart,
        items:cart.items as CartItem[],
        itemsPrice:cart.itemsPrice.toString(),
        totalPrice:cart.totalPrice.toString(),
        shippingPrice:cart.shippingPrice.toString(),
        taxPrice:cart.taxPrice.toString(),
    })
}


export async function removeItemFromCart(productId:string){
    try{
        const sessionCartId=(await cookies()).get('sessionCartId')?.value
        if(!sessionCartId)throw new Error('Cart session not found') 

        //get product

        const product= await prisma.product.findFirst({
            where:{id:productId}
        })
        if(!product)throw new Error('Product not found')

        const cart=await getMyCar();
        if(!cart) throw new Error('Card not found');

        //Check for item
        const exist= (cart.items as CartItem[]).find((x)=>x.productId===productId);
        if(!exist)throw new Error('Item not found')

        //Check if only one in qty
        if(exist.qty===1){
            //remove from the cart
            cart.items=(cart.items as CartItem[]).filter(x=>x.productId !==exist.productId)
        }else{
            //Decrese qty
            (cart.items as CartItem[]).find((x)=>x.productId===productId)!.qty=exist.qty-1
        }
        //Update cart in database

        await prisma.cart.update({
            where:{id:cart.id},
            data:{
                items:cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[])
            }
        })

        revalidatePath(`/product/${product.slug}`)
        return{
            success:true,
            message:`${product.name} was removed from cart`
        }

    }catch(error){
        return {success:false, message:formatError(error)}

    }
}