// components/Layout/HeaderSidebar.js
import React from 'react';
import { useContext } from 'react';

import axios from "axios";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import '../views/'; // Import the CSS file
const HeaderSidebar = () => {
  const { user, token, setUser, setToken } = useStateContext();
  const location = useLocation();

  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToken(null);
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="defaultLayout">
      <aside className="sidebar">
        <div className="logo">Reclaim-App</div>
        <nav className="nav">
          <ul>
            <li className={`nav-item ${location.pathname === "/adminAcceuil/Dashbord" ? "active" : ""}`}>
              <a href="/adminAcceuil/Dashbord">Dashboard</a>
            </li>
            <li className={`nav-item ${location.pathname === "/adminAcceuil/gestionUser" ? "active" : ""}`}>
              <a href="/adminAcceuil/gestionUser">Gestion Utilisateurs</a>
            </li>
            <li className={`nav-item ${location.pathname === "/adminAcceuil/gestionRec" ? "active" : ""}`}>
              <a href="/adminAcceuil/gestionRec">Gestion Réclamation</a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="content">
        <header className="header">
          <div className="header-left">
          </div>
          <div className="header-right">
            <div className="dropdown">
              <button className="dropdown-toggle" id="dropdownMenuButton">
                {user.name} {user.prenom}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="#">Profile</a>
                <a className="dropdown-item" href="#">Paramètres</a>
                <button className="dropdown-item" onClick={onLogout}>Se déconnecter</button>
              </div>
            </div>
          </div>
        </header>
        {/* This is where the child routes will be rendered */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HeaderSidebar;