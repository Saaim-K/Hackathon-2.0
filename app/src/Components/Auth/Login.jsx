import { React, useState, useContext } from 'react'
import axios from 'axios'
import { GlobalContext } from '../../Context/Context';
import styles from './Auth.module.css'


let baseUrl = '';
if (window.location.href.split(":")[0] === 'http') { baseUrl = 'http://localhost:5000' }


const Login = () => {
   let { state, dispatch } = useContext(GlobalContext);
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const handleLogin = async (e) => {
      e.preventDefault()
      try {
         axios.post(`${baseUrl}/login`, {
            email: email,
            password: password
         }, {
            withCredentials: true
         })
         dispatch({ type: "LOGIN" })
         console.log("Login Successful")
      }
      catch (error) {
         console.log("error: ", error);
      }
   }

   return (
      <>
         <form id={styles.form} autoComplete="off" onSubmit={handleLogin}>
            <div>
               <label>
                  <input type="email" placeholder="Email" required onChange={(e) => { setEmail(e.target.value) }} />
                  <span className="required">Email</span>
               </label>
            </div>
            <div>
               <label>
                  <input type="password" placeholder="Password" required />
                  <span className={styles.required}>Password</span>
               </label>
            </div>
            <input type="checkbox" name="show_password" className={`${styles.show_password} ${styles.hidden}`} id={styles.show_password} onChange={(e) => { setPassword(e.target.value) }} />
            <label className={styles.label_show_password} htmlFor="show_password">
               <span>Show Password</span>
            </label>
            <input type="submit" value="Log In" />

            <figure>
               <div className={styles.body}></div>
               <div className={`${styles.neck} ${styles.skin}`}></div>
               <div className={`${styles.head} ${styles.skin}`}>
                  <div className={styles.eyes}></div>
                  <div className={styles.mouth}></div>
               </div>
               <div className={styles.hair}></div>
               <div className={styles.ears}></div>
               <div className={styles.shirt_1}></div>
               <div className={styles.shirt_2}></div>
            </figure>
         </form>
      </>
   )
}

export default Login