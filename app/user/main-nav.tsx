'use client'

import React from 'react'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from '@/lib/utils';

const links= [
    {
        title:'Profile',
        href:'/user/profile'
    },
      {
        title:'Orders',
        href:'/user/orders'
    },

]

const MainNav = ({
    className,
    ...props
}:React.HTMLAttributes<HTMLElement>) => {

    const pathName=usePathname()

    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6',className)} {...props}>
        {links.map((item)=>(
            <Link className={cn('text-sm font-medium transition-colors hover:text-primary',pathName.includes(item.href) ? '':'text-muted-foreground')} key={item.href} href={item.href}>
                {item.title}
            </Link>

        ))}
        </nav>
    )
}

export default MainNav