import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import '../adminAcceuil.css'; // Import the CSS file
import { Link } from "react-router-dom";

import welcomeImage from '../../../../resources/image/agent.jpg';
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
  const isExcludedPath = location.pathname === "/agentAcceuil/gestionAgentRec";

    return(
      <div id="defaultLayout">
      <aside className="sidebar">
      <Link
  to="/agentAcceuil"
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
</Link>        <nav className="nav">
          <ul>

              <li className={`nav-item ${location.pathname === "/agentAcceuil/gestionAgentRec" ? "active" : ""}`}>
                <a href="/agentAcceuil/gestionAgentRec">Gestion Reclamation</a>
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
      <h1>Bienvenue, Agent, dans votre plateforme !</h1>
      <p>
        Vous êtes chargé de traiter les réclamations qui vous ont été assignées par l'administrateur et de répondre aux préoccupations des citoyens. Cette plateforme vous aide à gérer efficacement les réclamations et à suivre leur progression. Nous sommes là pour vous soutenir dans votre rôle essentiel.
      </p>
      <div className="welcome-image">
        <img src={welcomeImage} alt="Welcome" style={{ width: '40%', height: 'auto' }} />
      </div>
    </div>
  )}
  <Outlet /> {/* Render child routes here */}
</main>

      </div>
    </div>
    )
}