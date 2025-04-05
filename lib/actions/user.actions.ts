'use server'

import { signInFormSchema } from "../validators"
import { signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"


//Sign In the user with credentials

export async function signInWithCredentials(prevState:unknown,formData:FormData){
    try{
        const user= signInFormSchema.parse({
            email:formData.get('email'),
            passwor:formData.get('password')
        })
        await signIn('credentials',user)
        return {success:true,messge:'Signed in successfully'}

    }catch(error){
        if(isRedirectError(error)){
            throw error
        }
    }
    return{success:false, message:'Invalid email or password'}

}

//Sign user Out
export async function signOutUser(){
    await signOut()
}