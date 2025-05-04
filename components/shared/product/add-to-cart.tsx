'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {CartItem} from '@/types'
import { toast } from "sonner"
import { addItemToCart } from '@/lib/actions/cart.actions'



const  AddToCart= ({item}:{item:CartItem}) => {

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

  return (
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