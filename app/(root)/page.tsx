import ProductList from "@/components/shared/product/product-list"
import { getLatestProducts,getFeaturedProducts } from "@/lib/actions/product.actions"
import ProductCarousel from "@/components/shared/product/product-carousel"
import ViewAllProductsButton from "@/components/view-all-products"



const HomePage = async () => {
  const latestProducts= await getLatestProducts()
  const featuresProducts=await getFeaturedProducts()
 
  return (
    <div>
      {featuresProducts.length>0 &&<ProductCarousel data={featuresProducts}/>}
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
      />
      <ViewAllProductsButton/>
      

    </div>
  )
}

export default HomePage