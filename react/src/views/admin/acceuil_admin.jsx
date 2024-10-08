import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import '../adminAcceuil.css'; // Import the CSS file
import { Link } from "react-router-dom";

import welcomeImage from '../../../../resources/image/adminwelcome.jpg';

export default function AdminAcceuil(){
    const {user, token, setUser, setToken} = useStateContext();
    const location = useLocation();

    if(!token) {
      return <Navigate to='/login' replace />;
    }

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

    useEffect(() => {
      axiosClient.get('/user')
        .then(({data}) => {
          setUser(data)
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setToken(null);
            window.location.href = '/login';
          }
        });
    }, []);

    const isExcludedPath = location.pathname === "/adminAcceuil/gestionUser" || location.pathname === "/adminAcceuil/gestionRec"|| location.pathname === "/adminAcceuil/profile" ;

    return (
      <div id="defaultLayout">
        <aside className="sidebar">
        <Link
  to="/adminAcceuil"
  className="logo"
  style={{ color: 'black', textDecoration: 'none', transition: 'none', fontSize: '18px' }} 
>
  Reclaim-App
</Link>
          <nav className="nav">
            <ul>

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
                  <a className="dropdown-item" href="/adminAcceuil/profile">Profile</a>
                  <button className="dropdown-item" onClick={onLogout}>Se déconnecter</button>
                </div>
              </div>
            </div>
          </header>
          <main className="main-content">
                    {!isExcludedPath && (
                        <div className="welcome-message">
                            <h1>Bienvenue, Administrateur ! </h1>
                            <p>Votre expertise et votre leadership sont essentiels pour assurer une gestion efficace des réclamations et des comptes utilisateurs. Nous sommes ravis de vous avoir à la barre pour guider notre équipe vers l'excellence.</p>
                            <div className="welcome-image">
                            <img src={welcomeImage} alt="Welcome" style={{ width: '100%', height: 'auto' }} />
                            </div>
                        </div>
                    )}
                    <Outlet /> {/* Render child routes here */}



                </main>



        </div>
      </div>
    );
}