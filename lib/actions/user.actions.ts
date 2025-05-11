'use server'

import { signInFormSchema,signUpFormSchema } from "../validators"
import { signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"
import { hashSync } from "bcrypt-ts-edge"
import {prisma} from '@/db/prisma'
import { formatError } from "../utils"


//Sign In the user with credentials

export async function signInWithCredentials(prevState:unknown,formData:FormData){
    try{
        const user= signInFormSchema.parse({
            email:formData.get('email'),
            password:formData.get('password')
        })

        const callbackUrl = formData.get('callbackUrl') as string || '/';

        await signIn('credentials', {
            ...user,
            redirect: false,
            callbackUrl,
          });
      
        redirect(callbackUrl);
        return {success:true,message:'Signed in successfully'}

    }catch(error){
        if(isRedirectError(error)){
            throw error
        }
        return{success:false, message:'Invalid email or password'}
    }

}

//Sign user Out
export async function signOutUser(){
    await signOut()
}

//Sign Un user

export async function signUpUser(prevState:unknown,formData:FormData){
    try{
        const user=signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')

        })
        const callbackUrl = formData.get('callbackUrl') as string || '/';

        const plainPassword=user.password;

        user.password=hashSync(user.password,10)

        await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                password:user.password,
            },
           
        });
        await signIn('credentials',{
            email:user.email,
            password:plainPassword,
            redirect: false,
            callbackUrl,
        })

        redirect(callbackUrl);
        return {success:true, message:'User registered successfully'}

    }catch(error){
       
        if(isRedirectError(error)){
            throw error
        }
        return{success:false, message:formatError(error)}
    }
}

export async function getUserById(userId:string){
    const user= await prisma.user.findFirst({
        where:{id:userId}
    })
    if(!user) throw new Error('User not found')
    return user

}