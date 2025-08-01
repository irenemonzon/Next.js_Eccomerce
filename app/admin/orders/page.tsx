import { auth } from "@/auth";
import { Metadata } from "next";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import Pagination from "@/components/shared/pagination";
import { Table,TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatId, formatDateTime, formartCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Deletedialog from "@/components/shared/delete-dialog";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata:Metadata={
    title:'Admin Orders'

}



const AdminOrderspage = async(props:{
    searchParams:Promise<{page:string}>
}) => {
    
  await requireAdmin()

  const {page='1'}=await props.searchParams;
  

  const session= await auth()

  if(session?.user?.role!=='admin') throw new Error('User isn not authorized')

  const orders= await getAllOrders({
    page:Number(page),
    limit:2,
  })



  return (
     <div className='space-y-2'>
            <h2 className='h2-bold'>Orders</h2>
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>DATE</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>PAID</TableHead>
                            <TableHead>DELIVERED</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map((order)=>(
                            <TableRow key={order.id}>
                                <TableCell>{formatId(order.id)}</TableCell>
                                <TableCell>{formatDateTime(order.createAt).dateTime}</TableCell>
                                <TableCell>{formartCurrency(order.totalPrice)}</TableCell>
                                <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime:'Not paid'}</TableCell>
                                <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime:'Not delivered'}</TableCell>
                                <TableCell className="flex gap-4">
                                    <Button asChild variant='outline' size='sm'>
                                        <Link href={`/order/${order.id}`}>
                                            Details
                                        </Link>
                                    </Button>   
                                    <Deletedialog id={order.id} action={deleteOrder}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {orders.totalPages>1 &&(
                    <Pagination 
                        page={Number(page)|| 1}
                        totalPages={orders?.totalPages}
                    />

                )}
            </div>
        </div>
  )
}

export default AdminOrderspage