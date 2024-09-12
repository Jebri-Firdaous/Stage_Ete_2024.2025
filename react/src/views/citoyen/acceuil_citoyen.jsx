import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import '../adminAcceuil.css'; // Import the CSS file
import { Link } from "react-router-dom";

import welcomeImage from '../../../../resources/image/reclamation.png';
export default function citoyenAcceuil(){

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
      localStorage.removeItem('token'); // Remove token from local storage
      localStorage.removeItem('user'); // Remove user from local storage

      setToken(null);

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
  const isExcludedPath = location.pathname === "/citoyenAcceuil/reclamation";


    return(
      <div id="defaultLayout">
      <aside className="sidebar">
      <Link
  to="/citoyenAcceuil"
  className="logo"
  style={{
    color: 'black', // Couleur du texte
    textDecoration: 'none', // Pas de soulignement
    fontSize: '18px', // Taille de la police
    padding: '5px 10px', // Ajout d'un peu de padding pour l'espacement
    transition: 'background-color 0.3s', // Transition pour le changement de couleur d'arrière-plan
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'transparent')} // Couleur d'arrière-plan transparente au survol
>
  Reclaim-App
</Link>

        <nav className="nav">
          <ul>
            <li className={`nav-item ${location.pathname === "/citoyenAcceuil" ? "active" : ""}`}>
              <a href="/citoyenAcceuil">Acceuil</a>
            </li>
            <li className={`nav-item ${location.pathname === "/citoyenAcceuil/reclamation" ? "active" : ""}`}>
              <a href="citoyenAcceuil/reclamation">Reclamation</a>
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
                  <h1>Bienvenue, Citoyen, dans votre plateforme !</h1>
                  <p>
                    Cette plateforme est conçue pour vous permettre de soumettre vos réclamations de manière simple et efficace, et de suivre leur évolution en temps réel. Nous sommes ici pour vous aider à faire entendre votre voix.
                  </p>
                  <div className="welcome-image">
                    <img src={welcomeImage} alt="Welcome" style={{ width: '100%', height: 'auto' }} />
                  </div>
                </div>
                
                    )}
                    <Outlet /> {/* Render child routes here */}



                </main>
      </div>
    </div>
    )
}