import ProductForm from "@/components/admin/product-form"
import { Metadata } from "next"


export const metaData:Metadata={
    title:'Create Product'
}

const CreateProductPage = () => {
  return (
    <div>
        <h2 className="h2-bold">Create Product</h2>
        <div className="my-8">
            <ProductForm
                type='Create'
            />

        </div>
    </div>
  )
}

export default CreateProductPage