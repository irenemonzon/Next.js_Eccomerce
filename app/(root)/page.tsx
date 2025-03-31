import ProductList from "@/components/shared/product/product-list"
import { getLatestProducts } from "@/lib/actions/product.actions"
  // import sampleData from "@/db/sample-data"


const HomePage = async () => {
  const latestProducts= await getLatestProducts()
 
  return (
    <div>
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
      />
      

    </div>
  )
}

export default HomePage