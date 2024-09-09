import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import '../adminAcceuil.css'; // Import the CSS file

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

    return(
      <div id="defaultLayout">
      <aside className="sidebar">
        <div className="logo">Reclaim-App</div>
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
          <Outlet /> {/* Render child routes here */}
        </main>
      </div>
    </div>
    )
}