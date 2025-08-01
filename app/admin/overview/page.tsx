import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrderSummary } from "@/lib/actions/order.actions"
import { formartCurrency, formatDateTime, formatNumber } from "@/lib/utils"
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import Chart from "./chart"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata:Metadata={
    title:'Admin Dashboard'
}

const AdminOverviewPage = async() => {

  await requireAdmin()

  const session= await auth()

  if(session?.user?.role !=='admin'){
    throw new Error('User is not authorized')
  }
  const summary= await getOrderSummary()
  

  return (
    <div className="space-y-2">
        <h1 className="h2-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenuew</CardTitle>
                    <BadgeDollarSign/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formartCurrency(summary.totalSales._sum.totalPrice?.toString() || 0)}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Sales</CardTitle>
                    <CreditCard/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                       {formatNumber(summary.ordersCount)}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Customers</CardTitle>
                    <Users/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                       {formatNumber(summary.usersCount)}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Products</CardTitle>
                    <Barcode/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                       {formatNumber(summary.productsCount)}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardContent>
                        <Chart data={{
                            salesData: summary.salesData,
                        }}/>
                    </CardContent>
                </CardHeader>
            </Card>
             <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardContent>
                       <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>BUYER</TableHead>
                                <TableHead>DATE</TableHead>
                                <TableHead>TOTAL</TableHead>
                                <TableHead>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summary.latestSales.map((order)=>(
                                <TableRow key={order.id}>
                                    <TableCell>
                                        {order?.user?.name ? order.user.name: 'Deleted user'}
                                    </TableCell>
                                    <TableCell>
                                        {formatDateTime(order.createAt).dateOnly}
                                    </TableCell>
                                    <TableCell>
                                        {formartCurrency(order.totalPrice)}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/order/${order.id}`}>
                                            <span className="px-2">Details</span>
                                        </Link>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                       </Table>
                    </CardContent>
                </CardHeader>
            </Card>

        </div>
    </div>
  )
}

export default AdminOverviewPage