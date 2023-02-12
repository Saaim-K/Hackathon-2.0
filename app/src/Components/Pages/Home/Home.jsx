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

         <div className={styles.allProducts}>
            {
               product.map((eachProduct, i) =>
               (
                  <>
                     <div className={styles.card} key={i}>
                        <div className={styles}>
                           <h1>{eachProduct.name}</h1>
                           <p>{eachProduct.category}</p>
                           <h4>{eachProduct.description}</h4>
                           <h4>{eachProduct.quantity}</h4>
                           <h3>{eachProduct.price}</h3>
                           <h2>{eachProduct.unit}</h2>
                        </div>
                     </div>
                     <hr />
                  </>
               ))
            }
         </div>
      </>
   )
}

export default Home