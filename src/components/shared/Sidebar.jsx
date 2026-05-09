import React from "react";
import {RiHome5Line, RiQuestionMark,  RiWhatsappLine, RiFireLine,RiLogoutCircleLine, RiLoginCircleLine} from "react-icons/ri"
 import {Link} from 'react-router-dom'
 import listenScreenSize from "../customHooks/listenScreenSize";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { hasActiveOffers } from "../../services/firebase/firestore/adminHandlers";

const Sidebar = (props) => {


    const {showMenu, setShowMenu} = props
    const {isLg}= listenScreenSize();
    const {currentUser, logout} =useAuth();
    
    const [showOffers, setShowOffers] = useState(false);
  
  // CHECKEO DE OFERTAS (BOTON SOLO CUANDO HAYA UNA)
    useEffect(() => {
    const checkOffers = async () => {
      const exists = await hasActiveOffers();
      setShowOffers(exists);
    };

    checkOffers();
  }, []);
   //BUTON SLIDER
  const toggleOnLinkClick =()=>{
        if(!isLg){
            setShowMenu(!showMenu)
        }
    }
    return (
        // bg-[#1f1d2b]
        <div className={`sidebar  lg:left-0 ${showMenu? "left-0": "-left-28"}`}> 
       <div>
        <ul className=" pl-4">
            
            <li>
                <Link to='/' href="#" onClick={toggleOnLinkClick}>
                    <RiHome5Line className="text-3xl"/></Link>
            </li>
            <li>
                <Link to='/sobreNosotros' href="#"onClick={toggleOnLinkClick} >
                    <RiQuestionMark className="text-3xl"/></Link>
            </li>   
            
                {showOffers && ( 
                    <li>
                    <Link to='/ofertas' onClick={toggleOnLinkClick}>
                <a href="#" >
                    < RiFireLine className="text-3xl text-orange-600"/></a>
            </Link>
            </li>
        
        )}
              
            
            <li>
                <a href="#" className="wsp-icon ">
                    <  RiWhatsappLine className="text-3xl"/></a>
            </li>
       
        </ul>
        </div>
        <div className="hidden">
            <ul>
            <li>
            {currentUser ? (
              <button onClick={logout}>
                <RiLogoutCircleLine className="text-3xl" />
              </button>
            ) : (
              <Link to="/login">
                <RiLoginCircleLine className="text-3xl hidden" />
              </Link>
            )}
            </li>  
            </ul>
        </div>
        </div>
    )
}
export default Sidebar