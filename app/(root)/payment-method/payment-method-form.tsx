"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { paymentMethodSchema } from "@/lib/validators"
import { DEFAULT_PAYMENT_METHOD, PAYMENTS_METHODS } from "@/lib/contants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateUserPaymentMethod } from "@/lib/actions/user.actions"

const PaymentMethodForm = ({preferrredPaymentMethod}:{
    preferrredPaymentMethod:string | null
}) => {
    const router=useRouter()

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
            resolver: zodResolver(paymentMethodSchema),
            defaultValues: {
                type:preferrredPaymentMethod || DEFAULT_PAYMENT_METHOD
            }
          })
    
    const [isPending,startTransition]=useTransition()

    const onSubmit=async(values:z.infer<typeof paymentMethodSchema>)=>{
      startTransition(async()=>{
        const res=await updateUserPaymentMethod(values)
        if(!res.success){
          toast(res.message)
          return
        }
        router.push('/place-order')
      })
      
    }
          

    return (
      <>
        <div className="max-w-md mx-auto space-y-4">
         <h1 className="h2-bold mt-4">Payment methods</h1>
         <p className="text-sm text-muted-foreground"> Please select a payment method</p>
         <Form {...form}>
            <form 
                method="post" 
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col md:flex-row gap-5">
                  <FormField
                    control={form.control}
                    name='type'
                    render={({field})=>(
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-2">
                            {PAYMENTS_METHODS.map((paymentMethod)=>(
                              <FormItem key={paymentMethod} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem 
                                    value={paymentMethod}
                                    checked={field.value===paymentMethod}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {paymentMethod}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}                  
                  />
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ?(
                            <Loader className="w-4 h-4 animate-spin"/>
                        ):(
                            <ArrowRight className="w-4 h4"/>

                        )} Continue
                    </Button>

                </div>
            </form>
         </Form>

        </div>
      </>
    )
}

export default PaymentMethodForm