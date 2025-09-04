"use server"
import { prisma } from '@/db/prisma' 
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../contants";
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import { z } from 'zod';
import { Prisma } from '@prisma/client';


//Get latest products

export  async function getLatestProducts(){

    const data = await prisma.product.findMany({
        take:LATEST_PRODUCTS_LIMIT,
        orderBy:{createdAt:'desc'}

    })
    return convertToPlainObject(data)
}

// Get single product by it's slug
export async function getProductBySlug(slug:string){
    return await prisma.product.findFirst({
        where:{slug:slug}
    });
}
export async function getProductById(productId:string){
    const data=await prisma.product.findFirst({
        where:{id:productId}
    });
    return convertToPlainObject(data)
}

//Get all products

export async function getAllProducts({
    query,
    limit= 10,
    page,
    category,
    price,
    rating,
    sort
    
}:{
    query:string;
    limit?:number;
    page:number;
    category?:string;
    price?:string;
    rating?:string;
    sort?:string;
}){

    const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

    const categoryFilter= category && category !=='all' ? {category}: {}

   const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};

    const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};


    const data= await prisma.product.findMany({
        where:{
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
        },
        orderBy:
        sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
        skip:(page-1)* limit,
        take:limit
    })

    const dataCount= await prisma.product.count()

    return{
        data,
        totalPages: Math.ceil(dataCount/limit)
    }

}

export async function deleteProduct(id:string){
    try{
        const productExists= await prisma.product.findFirst({
            where:{id}
        })
        if(!productExists) throw new Error('Product not found')
        await prisma.product.delete({where:{id}})
        
        revalidatePath('/admin/products')

        return{
            success:true,
            message:'Product deleted successfully'
        }

    }catch(error){
        return {success:false,message:formatError(error)}
    }

}

export async function createProduct(data:z.infer<typeof insertProductSchema>){
    try{
        const product= insertProductSchema.parse(data);
        await prisma.product.create({data:product})

        revalidatePath('/admin/products')
         return{
            success:true,
            message:'Product created successfully'
        }


    }catch(error){
        return {success:false,message:formatError(error)}
    }
}

export async function updateProduct(data:z.infer<typeof updateProductSchema>){
    try{
        const product= updateProductSchema.parse(data);
        const productExists=await prisma.product.findFirst({
            where:{id:product.id}
        }) 

        if(!productExists)throw new Error('Product not found')
        await prisma.product.update({
            where:{id:product.id},
            data:product
        })

        revalidatePath('/admin/products')
         return{
            success:true,
            message:'Product created successfully'
        }
    }catch(error){
        return {success:false,message:formatError(error)}
    }
}
//Get all category

export async function getAllCategory(){
    const data= await prisma.product.groupBy({
        by:['category'],
        _count:true
    });
    return data
}

//Get features products
export async function getFeaturedProducts(){
    const data= await prisma.product.findMany({
        where:{isFeatured:true},
        orderBy:{createdAt:'desc'},
        take:4
    })
    return convertToPlainObject(data)
}