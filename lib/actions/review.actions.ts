'use server'

import { z } from "zod"
import { insertReviewSchema } from "../validators"
import { formatError } from "../utils"
import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { revalidatePath } from "next/cache"

//Create and updated Reviews

export async function createUpdateReview( data:z.infer<typeof insertReviewSchema>){
    
    try{
        const session= await auth()

        if(!session) throw new Error('User is not authenticated')
        const review = insertReviewSchema.parse({
        ...data,
        userId:session.user.id
        })

        const product= await prisma.product.findFirst({
            where:{id:review.productId}
        })
        if(!product)throw new Error('Product not found')

        const reviewExists= await prisma.review.findFirst({
            where:{
                productId:review.productId,
                userId:review.userId
            }
        });

        await prisma.$transaction(async(tx)=>{
            if(reviewExists){
                await tx.review.update({
                    where:{
                        id:reviewExists.id
                    },
                    data:{
                        title:review.title,
                        description:review.description,
                        rating:review.rating
                    }
                })

            }else{
                await tx.review.create({data:review})

            }
            //Get average review
            const averageRating= await tx.review.aggregate({
                _avg:{rating:true},
                where:{
                    productId:review.productId
                }
            })
            //Create number of reviews
            const numReviews= await tx.review.count({
                where:{productId:review.productId}
            })
            //Update rating and numReview in product Table

            await tx.product.update({
                where:{id: review.productId},
                data:{
                    rating:averageRating._avg.rating || 0,
                    numReviews
                }
            })


        })
        revalidatePath(`/product/${product.slug}`)

        return {
            succes:true,
            message:'Review Updated successfully'
        }

    }catch(error){
        return{success:false, message:formatError(error)}
    }
}

//Get all reviews for a product

export async function getReviews({productId}:{productId:string}){
    const data= await prisma.review.findMany({
        where:{
            productId:productId
        },
        include:{
            user:{
                select:{
                    name:true
                },
            },
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return {data}
}

export async function getReviewByProduct({productId}:{productId:string}){
    const session= await auth()

    if(!session) throw new Error('User is not authenticated')

    return await prisma.review.findFirst({
        where:{
            productId,
            userId:session.user.id
        }
    })

}
