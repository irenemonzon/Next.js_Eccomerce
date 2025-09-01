import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { getAllCategory } from "@/lib/actions/product.actions"
import { MenuIcon } from "lucide-react"
import Link from "next/link"


const CategoryDrawer =async () => {
    const categories= await getAllCategory()


  return (
    <Drawer direction="left">
        <DrawerTrigger asChild>
            <Button variant='outline'>
                <MenuIcon/>
            </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full max-w-sm">
            <DrawerHeader>
                <DrawerTitle>Select a category</DrawerTitle>
                <div className="space-y-1 mt-4">
                    {categories.map((value)=>(
                        <Button 
                            key={value.category}
                            variant='ghost'
                            className="w-full justify-start"
                            asChild
                        >
                            <DrawerClose asChild>
                                <Link href={`/search?category=${value.category}`}>
                                {value.category}({value._count})
                                </Link>
                            </DrawerClose>
                        </Button>

                    ))}
                </div>
            </DrawerHeader>
        </DrawerContent>
    </Drawer>
  )
}

export default CategoryDrawer