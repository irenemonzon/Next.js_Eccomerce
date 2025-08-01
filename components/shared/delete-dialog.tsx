'use client'

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { toast } from "sonner";


const Deletedialog = ({id,action}:{
    id:string,
    action:(id:string)=>Promise<{success:boolean; message:string}>
}) => {

  const [open,setOpen]=useState(false) 
  const [isPending,startTransition]=useTransition()

  const handleDeleteClick=()=>{
    startTransition(async()=>{
        const res= await action(id)
        if(!res.success){
            toast.error(res.message)
        }else{
            setOpen(false)
            toast.success(res.message)
        }
    })

  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button size="sm" variant='destructive'> DELETE</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action can not be undone
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>
                <Button 
                    variant='destructive'
                    size='sm' 
                    disabled={isPending}
                    onClick={handleDeleteClick}
                >
                    {isPending ? 'Deleting...':'Delete'}

                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
       

    </AlertDialog>
  )
}

export default Deletedialog