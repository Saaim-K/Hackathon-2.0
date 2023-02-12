import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Home.module.css'

let baseUrl = '';
if (window.location.href.split(':')[0] === 'http') { baseUrl = 'http://localhost:5000' }

const Home = () => {
   const [product, setProduct] = useState([])

   useEffect(() => {
      const allProducts = async () => {
         try {
            const response = await axios.get(`${baseUrl}/products`)
            // setProduct(response.data.data)//New Product at the bottom
            setProduct(response.data.data.reverse())//New Product at the top
            console.log('Product fetched Succesfully 👍')
         }
         catch (error) {
            console.log('Error occured while fetching product ❌', error)
         }
      }
      allProducts()

      //   // ---------- Cleanup Function ----------
      return () => { allProducts() }
      //   // ---------- Cleanup Function ----------

   }, [])
   return (
      <>

         {
            product.map((eachProduct, i) =>
            (
               <div className={styles.card} key={i}>
                  <div><img src="https://i.pinimg.com/750x/ce/0d/9e/ce0d9ead299eb0ee550b2e5b9306b882.jpg" alt="" /></div>
                  <div>
                     <h1>{eachProduct.name}</h1>
                     <h1>{eachProduct.category}</h1>
                     <h1>{eachProduct.description}</h1>
                     <h1>{eachProduct.quantity}</h1>
                     <h1>{eachProduct.price}</h1>
                     <h1>{eachProduct.unit}</h1>
                  </div>
               </div>
            ))
         }
      </>
   )
}

export default Home