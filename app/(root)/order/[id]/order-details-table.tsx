'use client'

import { useTransition } from 'react';
import Image from 'next/image';
import Link from "next/link"
import { Card, CardContent } from '@/components/ui/card';
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formartCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import {PayPalButtons,PayPalScriptProvider,usePayPalScriptReducer} from '@paypal/react-paypal-js'
import { createPaypalOrder,approvePaypalOrder,updateOrderToPaidAdmin, deliveryOrder } from '@/lib/actions/order.actions';
import { toast } from 'sonner';

const OrderDetailsTable = ({
    order,paypalClientId, isAdmin
}:{
    order:Order;
    paypalClientId:string;
    isAdmin:boolean
}) => {

    const {
        id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        deliveredAt,
        paidAt
    }= order
   
    const PrintLoadingState=()=>{
        const[{isPending,isRejected}]=usePayPalScriptReducer();
        let status='';

        if(isPending){
            status='Loading Paypal...'
        }else if(isRejected){
            status='Error Loading Paypal'
        }
        return status
    }

    const handleCreatePaypalOrder=async()=>{
        const res= await createPaypalOrder(order.id);
        if(!res.success){
            toast.error(res.message)
        }
        return res.data

    }

    const handleApprovePaypalOrder=async(data:{orderID:string})=>{

        const res=await approvePaypalOrder(order.id,data)
        toast(res.message)

    }

    const MarkAsPaidButton=()=>{
        const [isPending,startTransition]=useTransition()

         return (
            <Button 
              type='button'
              disabled={isPending}
              onClick={()=>startTransition(async()=>{
                const res= await updateOrderToPaidAdmin(order.id)
                if(res.success){
                    toast.success(res.message)
                }else{
                    toast.error(res.message)
                }
              })}
            >
                {isPending ? 'Processing...':'Mark As Paid'}

            </Button>
         )
    }
    const MarkAsDeliveredButton=()=>{
        const [isPending,startTransition]=useTransition()

         return (
            <Button 
              type='button'
              disabled={isPending}
              onClick={()=>startTransition(async()=>{
                const res= await deliveryOrder(order.id)
                if(res.success){
                    toast.success(res.message)
                }else{
                    toast.error(res.message)
                }
              })}
            >
                {isPending ? 'Processing...':'Mark As Delivered'}

            </Button>
         )
    }


  return (
    <>
        <h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
        <div className='grid md:grid-cols-3 md:gap-5'>
            <div className='col-span-2 space-4 overflow-x-auto'>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>Payment Method</h2>
                        <p className='mb-2'>{paymentMethod}</p>
                        {isPaid ? (
                            <Badge variant='secondary'>
                                Paid at { formatDateTime(paidAt!).dateTime}
                            </Badge>
                        ):(
                            <Badge variant='destructive'>
                                Not paid
                            </Badge>
                        )}

                    </CardContent>
                </Card>
                 <Card className='my-2'>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>Shipping Address</h2>
                        <p>{shippingAddress.fullName}</p>
                        <p className='mb-2'>{shippingAddress.streetAddress}, {shippingAddress.city}
                           {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                        {isDelivered ? (
                            <Badge variant='secondary'>
                                Delivered at { formatDateTime(deliveredAt!).dateTime}
                            </Badge>
                        ):(
                            <Badge variant='destructive'>
                                Not Delivered
                            </Badge>
                        )}

                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'> Order Items</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderitems.map((item)=>(
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link 
                                                href={`/product/${item.slug}`}
                                                className="flex items-center"
                                            >
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    width={50} 
                                                    height={50}
                                                />
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2">{item.qty}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${item.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Items</div>
                            <div>{formartCurrency(itemsPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Tax</div>
                            <div>{formartCurrency(taxPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Shipping</div>
                            <div>{formartCurrency(shippingPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Total</div>
                            <div>{formartCurrency(totalPrice)}</div>
                        </div>
                        {!isPaid && paymentMethod === 'PayPal' &&(
                            <div>
                                <PayPalScriptProvider options={{clientId:paypalClientId}}>
                                    <PrintLoadingState/>
                                    <PayPalButtons createOrder={handleCreatePaypalOrder} onApprove={handleApprovePaypalOrder}/>
                                </PayPalScriptProvider>
                            </div>
                        )}
                        {isAdmin && !isPaid && paymentMethod==='CashOnDelivery' && (
                            <MarkAsPaidButton/>
                        )}
                        {isAdmin && isPaid && !isDelivered && (
                            <MarkAsDeliveredButton/>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  )
}

export default OrderDetailsTable;