import { auth } from "@/auth"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getUserById } from "@/lib/actions/user.actions"
import { getMyCar } from "@/lib/actions/cart.actions"
import { ShippingAddress } from "@/types"
import ShippingAddressForm from './shipping-address-form'

export const metadata:Metadata={
    title:'Shipping Address'
}

const ShippingAddressPage = async() => {

    const cart=await getMyCar()
    if(!cart || cart.items.length===0) redirect('/cart')
    
        const session=await auth()
        const userId=session?.user?.id

        if(!userId)throw new Error('No user ID')
        
        const user=await getUserById(userId)


  return (
    <>
        <ShippingAddressForm
        address={user.address as ShippingAddress}
        />
    </>
  )
}

export default ShippingAddressPage