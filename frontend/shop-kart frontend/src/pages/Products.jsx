import {useState , useEffect , React} from 'react'
import axios from "axios"


export default function Products() {

    const [products , setProducts] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8082/products")
            .then((response) => {

                console.log("My backend Data:" , response.data)
                setProducts(response.data.products)
            })
            .catch((error) => {
                console.log("Uh oh , an error:" , error)
            })
    }, [])


  return (
    <div>
    <h1>
        Product Page 
    </h1>
    

    <div className = "product-grid">

    {products.map((product) => (
        <div key = {product._id} className = "product-card">
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <p>Category : {product.category}</p>
            <img src = {product.image} />
            <p>Stock : {product.stock}</p>
            <button>View Details</button>
        </div>
    ))}
    </div>
    </div>
  )
}
