import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import {redirect} from 'next/navigation'
import {auth} from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME } from "@/lib/contants"
import CredentialsSigninForm from "./credentials-signin-form"

export const metadata:Metadata={
    title:'Sign In'
}

const SignInPage = async(props:{
    searchParams:Promise<{
        callbackUrl:string
    }>
}) => {

    const {callbackUrl} =await props.searchParams;

    const session=await auth()

    if(session){
        return redirect(callbackUrl || '/')
    }

  return (
    <div className="w-full max-w-md mx-auto">
        <Card>
            <CardHeader className="space-y-4">
                <Link href='/' className="flex-center">
                    <Image 
                        src='/images/logo.svg' 
                        alt={`${APP_NAME} logo`}
                        width={100}
                        height={100}
                        priority={true}
                    />
                </Link>
                <CardTitle className="text-center">
                    Sign In
                </CardTitle>
                <CardDescription className="text-center">Sign In to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <CredentialsSigninForm/>

            </CardContent>
        </Card>

    </div>
  )
}

export default SignInPage