'use client'
import {BarChart,Bar,XAxis,YAxis,ResponsiveContainer}from 'recharts'

const chart = ({
    data:{salesData},
}:{
    data:{salesData:{month:string; totalSales:number}[]}
}) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
        <BarChart data={salesData}>
            <XAxis
            dataKey='month'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            />
            <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value)=> `$${value}`}
            />
            <Bar            
            dataKey='totalSales'
            fill='currentColor'
            radius={[40,40,0,0]}
            className='fill-primary'
            />
        </BarChart>

    </ResponsiveContainer>
  )
}

export default chart