import ProductList from "@/components/shared/product/product-list"
import { getLatestProducts,getFeaturedProducts } from "@/lib/actions/product.actions"
import ProductCarousel from "@/components/shared/product/product-carousel"



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
      

    </div>
  )
}

export default HomePage