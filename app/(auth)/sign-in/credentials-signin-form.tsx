'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInDefaultValues } from "@/lib/contants"
import Link from "next/link"

const CredentialsSigninForm = () => {
  return (
    <form>
        <div className="space-y-6">
            <div>
                <Label className='mb-2'htmlFor="email" >Email</Label>
                <Input
                    id='email'
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={signInDefaultValues.email}
                />
            </div>
            <div>
                <Label className='mb-2' htmlFor="password" >Password</Label>
                <Input
                    id='password'
                    name="password"
                    type="password"
                    required
                    autoComplete="password"
                    defaultValue={signInDefaultValues.password}
                />
            </div>
            <div>
                <Button className="w-full" variant='default'>
                    Sign In
                </Button>    
            </div>
            <div className="text-sm text-center text-muted-foreground">
                Don&apos;t have and account?{' '}
                <Link href='/sign-up' target='_self' className='link'>
                    Sign Up
                </Link>
            </div>
        </div>   
    </form>
  )
}

export default CredentialsSigninForm