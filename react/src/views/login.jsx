import axios from "axios";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const { setUser, setToken } = useStateContext();
  console.log(localStorage.getItem('token'));
  console.log(localStorage.getItem('user'));
  const Submit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    axiosClient.post("/login", payload)
    .then(({ data }) => {
      if (data.user.isBanned === 1) {
        alert('Vous êtes banni, veuillez contacter un administrateur.');
        return; // prevent further execution
      }
      setUser(data.user);
      setToken(data.token);
      // Store token and user in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('user'));
        const role = data.user.role;
        switch (role) {
          case 'ADMINISTRATEUR':
            navigate('/adminAcceuil', { replace: true });
            break;
          case 'AGENT':
            navigate('/agentAcceuil', { replace: true });
            break;
          case 'CITOYEN':
            navigate('/citoyenAcceuil', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      })
      .catch(err => {
        console.error(err);
        alert('Erreur de connexion. Veuillez réessayer.');
      });
  };

  return (
    <div className="login-signup-form animated fadeinDown">
      <div className="form">
        <h1 className="title">
          Connexion
        </h1>
        <form onSubmit={Submit}>
          <input ref={emailRef} type="email" placeholder="Adresse mail" />
          <input ref={passwordRef} type="password" placeholder="Mot de passe" />
          
          <button className="btn btn-block" style={{ backgroundColor :'#4c92ca'}}>Se connecter</button>
          
            <Link to='/forgotPassword' style={{ color :'#4c92ca', textDecoration :'none'}}>mot de passe oublié?</Link>

          <p className="message">
            Vous avez pas de compte?
            <Link to='/register' style={{ color :'#4c92ca', textDecoration :'none'}}> <br />Créer un compte</Link>
          </p>
        </form>
      </div>
      
    </div>
  );
}