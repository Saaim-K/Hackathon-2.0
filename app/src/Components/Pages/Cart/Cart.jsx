import React, { useState } from 'react'
import axios from 'axios'


let baseUrl = '';
if (window.location.href.split(':')[0] === 'http') { baseUrl = 'http://localhost:5000' }

const Cart = () => {
   // ----------------------------- States -----------------------------
   const [name, setName] = useState('')
   const [category, setCategory] = useState('')
   const [description, setDescription] = useState('')
   const [price, setPrice] = useState('')
   const [quantity, setQuantity] = useState('')
   const [unit, setUnit] = useState('')
   // ----------------------------- States -----------------------------


   // ----------------------------- Create Product Function -----------------------------
   const createPost = (e) => {
      e.preventDefault();
      axios.post(`${baseUrl}/product`, { name, category, description, price, quantity, unit })
         .then(response => {
            console.log("Response Sent ", response.data);
            console.log('Product added Succesfully 👍')
         })
         .catch(error => {
            console.log('Error occured while adding product ❌', error)
         })
   }
   // ----------------------------- Create Product Function -----------------------------




   // ----------------------------- Delete Product Function -----------------------------

   const deleteAll = (e) => {
      e.preventDefault();
      axios.delete(`${baseUrl}/products`)
         .then((response) => {
            console.log("Response Sent ", response.data);
            console.log(' Succesfully Deleted All Products👍')
         })
         .catch(error => {
            console.log('Error in Deleting All Products ❌', error)
         })
   }


   return (
      <>
         <form onSubmit={createPost}>
            <h1>All Products</h1>
            <h3>
               Name:
               <input placeholder='Enter Product' type="text" onChange={(e) => (setName(e.target.value))} /> <br />
               <label>Category:</label>
               <select onChange={(e) => { setCategory(e.target.value) }}>
                  <option> Volvo</option>
               <option value="saab">Saab</option>
               <option value="mercedes">Mercedes</option>
               <option value="audi">Audi</option>
            </select>
            Description:
            <input placeholder='Enter Description' type="text" onChange={(e) => (setDescription(e.target.value))} /> <br />
            Price:
            <input placeholder='Enter Product Price' type="number" onChange={(e) => (setPrice(e.target.value))} /> <br />
            Quantity
            <input placeholder='Enter Amount of Product' type="number" onChange={(e) => (setQuantity(e.target.value))} /> <br />
            Unit
            <input placeholder='Enter Unit of Product' type="text" onChange={(e) => (setUnit(e.target.value))} /> <br />
            <button>Post</button>
            <button onClick={deleteAll}>Delete All</button>
         </h3>
      </form>
      </>
   )
}

export default Cart