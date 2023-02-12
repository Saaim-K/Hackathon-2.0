import React from 'react'
import { Link, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react';
import { GlobalContext } from '../../../Context/Context';
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser, AiOutlinePoweroff } from "react-icons/ai";
import styles from './Navbar.module.css'
import logo from '../../../Assets/Frame.png'
import Home from '../Home'
import Cart from '../Cart'
import Profile from '../Profile'
import Login from '../../Auth/Login'
import Signup from '../../Auth/Signup'


const Navbar = () => {
   const { state, dispatch } = useContext(GlobalContext);

   return (
      <>
         <div className={styles.nav}>
            <input type="checkbox" id={styles.check} />
            <div className={styles.header}>
               <div className={styles.title}>
                  <img src={logo} alt="" className={styles.logo} />
               </div>
            </div>
            <div className={styles.btn}>
               <label htmlFor={styles.check}>
                  <span></span>
                  <span></span>
                  <span></span>
               </label>
            </div>

            {(state.isLogin === true) ?
               <div className={styles.links}>
                  <Link to="/" className={styles.a}><AiOutlineHome /> Home</Link>
                  <Link to="cart" className={styles.a}><AiOutlineShoppingCart />Cart</Link>
                  <Link to="profile" className={styles.a}><AiOutlineUser /> Profile</Link>
                  <Link to="/" className={styles.a}><AiOutlinePoweroff /> Logout</Link>
               </div>
               : <div className={styles.links}>
                  <Link to="/" className={styles.a}>Login</Link>
                  <Link to="signup" className={styles.a}>Signup</Link>
               </div>}
         </div>

         {(state.isLogin === true) ?
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="cart" element={<Cart />} />
               <Route path="profile" element={<Profile />} />
               <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
            :
            <Routes>
               <Route path="/" element={<Login />} />
               <Route path="signup" element={<Signup />} />
               <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
         }
      </>
   )
}

export default Navbar