'use client'

import { useRouter } from 'next/navigation'
import { Plus,Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {Cart, CartItem} from '@/types'
import { toast } from "sonner"
import { addItemToCart,removeItemFromCart } from '@/lib/actions/cart.actions'



const  AddToCart= ({cart,item}:{cart?:Cart, item:CartItem}) => {

  const router=useRouter();
  

  const handleAddToCard=async()=>{
    const res= await addItemToCart(item);

    if(!res.success){
      toast.error(res.message)
      return
    }
    toast(res.message,
      {
        action: {
  
          label: "Go to Cart",
          onClick:() => router.push('/cart'),
        },
      }
    )
  
  }

  const handleRemoveFromCart=async()=>{

    const res=await removeItemFromCart(item.productId)
    if(!res.success){
      toast.error(res.message)
      return
    }
    if(!res.success){
      toast.error(res.message)
    }
    toast(res.message)
    return
    
  }

  //Check if item is in cart
  const existItem=cart && cart.items.find((x)=>x.productId===item.productId)

 
  return existItem ?(
    <div>
      <Button
        type='button'
        variant='outline'
        onClick={handleRemoveFromCart}
      >
        <Minus
        className='h-4 w-4'
        />
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button
        type='button'
        variant='outline'
        onClick={handleAddToCard}
      >
        <Plus
        className='h-4 w-4'
        />
      </Button>

    </div>
  ):(
    <Button
      className='w-full'
      type='button'
      onClick={handleAddToCard}
    >
      <Plus/> Add to cart
    </Button>
  )
}

export default AddToCart