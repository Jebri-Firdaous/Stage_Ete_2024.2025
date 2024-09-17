import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function DefaultLayout(){
    const {user, token, setUser, setToken} = useStateContext();
    if(!token){
       return <Navigate to='/login'/>
    }

    const onLogout = async (ev) => {
      ev.preventDefault();
      try {
        axios.post('/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Clear user state on logout
        setUser(() => null);
        setToken(() => null);
        // Redirect to login page
        window.location.href = '/login';
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (!user) {
        // Redirect to login page if user is null
        window.location.href = '/login';
      }
    }, [user]);

    return(
        <div id="defaultLayout">
         <div className="content">
     
            <main>
            <Outlet />
            </main>
            </div>
        </div>
    )
}