import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const email = emailRef.current.value;

    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    // Reset error and success messages
    setError("");
    setSuccess("");

    axiosClient.post("/forgotPassword", { email })
      .then((response) => {
        if (response.data.message === 'Reset link sent to your email') {
          setSuccess("Un e-mail de réinitialisation a été envoyé avec succès.");
          navigate("/login", { state: { message: "Vérifiez votre e-mail pour le lien de réinitialisation." } });
        } else {
          setError("Erreur lors de l'envoi de l'e-mail.");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
      });
  };

  return (
    <div className="login-signup-form animated fadeinDown">
      <div className="form">
        <h1 className="title">Mot de passe oublié</h1>
        <form onSubmit={handleSubmit}>
          <input ref={emailRef} type="email" placeholder="Adresse mail" required />
          <button className="btn btn-block">Envoyer le lien de réinitialisation</button>
          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}
          <div className="message">
            Vous vous souvenez de votre mot de passe? <Link to="/login">Connexion</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
