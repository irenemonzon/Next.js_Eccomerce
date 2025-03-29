"use client"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu ,
     DropdownMenuLabel,
     DropdownMenuTrigger,
     DropdownMenuSeparator,
     DropdownMenuContent,
     DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { SunIcon,MoonIcon,SunMoon } from "lucide-react"

const ModeToogle= () => {
    const [mounted,setMounted]=useState<boolean>(false);
    const {theme, setTheme}=useTheme()

    useEffect(()=>{
        setMounted(true)
    },[]);

    if(!mounted){
        return null
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button 
                variant='ghost'
                className='focus-visible:ring-0 focus-visible:ring-offset-0'
            >
                {theme === 'system' ?(
                    <SunMoon/>
                ):theme==='dark'?(
                    <MoonIcon/>
                ):(
                    <SunIcon/>
                )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>
                Appearence
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuCheckboxItem 
                checked={theme==='system'}
                onClick={()=>setTheme('system')}
            >
                System
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
                checked={theme==='dark'}
                onClick={()=>setTheme('dark')}
            >
                Dark
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
                checked={theme==='light'}
                onClick={()=>setTheme('light')}
            >
                Light
            </DropdownMenuCheckboxItem>

        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModeToogle