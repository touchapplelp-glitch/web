import React from "react";
import { RiMenuFill ,RiShoppingCart2Line, RiUser3Line,RiMenuFoldFill}from "react-icons/ri";

const MenuMovil =(props) =>{
   const {showMenu, setShowMenu, showCart, setShowCart} = props;
    const toggleMenu = ()=>{
      setShowMenu(!showMenu)
    }
    const toggleCart = ()=>{
      setShowCart(!showCart)
      setShowMenu(false)
    }
   
    return(
        
        <nav className="bg-[#1f1d2b] lg:hidden fixed w-full bottom-0 left-0 text-3xl text-gray-400 py-2 px-8 flex items-center justify-between rounded-tl-xl rounded-tr-xl">
        <button className="hidden">
        <RiUser3Line className="p-2"/>
        </button> 
        <button onClick={toggleCart}className=" p-2">
        <RiShoppingCart2Line />
        </button> 
        
        <button onClick={toggleMenu}className="text-white p-2">
        {showMenu?<RiMenuFoldFill />:<RiMenuFill />}
        </button>
       </nav>
    )
}
export default MenuMovil;
