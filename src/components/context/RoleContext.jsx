import { useContext, createContext, useState, useEffect } from "react";
import { db } from "../../services/firebase/firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const RoleContext = createContext();

export const RoleProvider = ({children})=>{
    const {currentUser} = useAuth();
    const [userRole, setUserRole]= useState(false);
    const [roleLoading, setRoleLoading]= useState(false);
    const [roleError, setRoleError]= useState(null);

    useEffect(()=>{
         const fetchUserRole = async ()=>{
            if(!currentUser){
                
                setUserRole(null);
                setRoleLoading(false)
                return
            }
            setRoleLoading(true)
            setRoleError(null);
            console.log("Consultando rol para usuario:", currentUser.uid);

            try {
                const userDocRef = doc(db,"users",currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if(userDoc.exists()){
                    const role =  userDoc.data().role
                    console.log("Rol obtenido:", role);
                    setUserRole(role)
                    
                    
                } else setUserRole(null);
            } catch (error) {
                setRoleError(error.message)
                console.error("Error al obtener rol de usuario:", error);
            } finally {
                
                setRoleLoading(false)
            }
         }
         fetchUserRole();
         
    }, [currentUser])

    

    const value ={
        userRole,
        
        roleLoading,
        roleError
    };

    return(
        <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
    )
    

};
export const useRole = ()=> useContext(RoleContext)
