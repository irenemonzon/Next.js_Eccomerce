import CartTable from "./cart-table"
import { getMyCar } from "@/lib/actions/cart.actions"

export const metadata={
    title:'Shooping Cart'
}

const CartPage = async() => {

    const cart=await getMyCar()

  return (
    <div>
        <CartTable
             cart={cart}
        />
    </div>
  )
}

export default CartPage