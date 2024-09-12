import axios from "axios";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { useState } from "react";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [telephone, setTelephone] = useState('');
    const [age, setAge] = useState('');
    const [genre, setGenre] = useState('');
    const [photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({});

    const { setUser, setToken } = useStateContext();
    
    const handleSubmit = (ev) => {
        ev.preventDefault();
        
        const payload = new FormData();
        payload.append('name', name);
        payload.append('prenom', prenom);
        payload.append('email', email);
        payload.append('password', password);
        payload.append('role', role);
        payload.append('telephone', telephone);
        payload.append('age', age);
        payload.append('genre', genre);
        if (photo) {
            payload.append('photo', photo);
        }
    
        axiosClient.post("/register", payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(({ data }) => {
            setUser(data.user);
            setToken(data.token);
            navigate('/login'); // Redirect to login page
        })
        .catch((err) => {
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                setErrors(errors);
            }
        });
    };

    return (
        <div className="login-signup-form animated fadeinDown">
            <div className="form">
                <h1 className="title">Creer un Compte</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <span style={{ color: 'red' }}>{errors.name[0]}</span>}

                    <input type="text" placeholder="Prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    {errors.prenom && <span style={{ color: 'red' }}>{errors.prenom[0]}</span>}

                    <input type="email" placeholder="Adresse mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span style={{ color: 'red' }}>Veuillez entrer une adresse e-mail valide</span>}

                    <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password[0]}</span>}

                    <select className="custom-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="" disabled>Sélectionner un rôle</option>
                        <option value="CITOYEN">CITOYEN</option>
                        <option value="ADMINISTRATEUR">ADMINISTRATEUR</option>
                        <option value="AGENT">AGENT</option>
                    </select>
                    {errors.role && <span style={{ color: 'red' }}>{errors.role[0]}</span>}

                    <input type="number" placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} style={{ marginTop: '15px' }} />
                    {errors.telephone && <span style={{ color: 'red' }}>{errors.telephone[0]}</span>}

                    <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                    {errors.age && <span style={{ color: 'red' }}>{errors.age[0]}</span>}

                    <select className="custom-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                        <option value="" disabled>Sélectionner un genre</option>
                        <option value="FEMME">FEMME</option>
                        <option value="HOMME">HOMME</option>
                    </select>
                    {errors.genre && <span style={{ color: 'red' }}>{errors.genre[0]}</span>}

                    <input type="file" className="custom-file-input" onChange={(e) => setPhoto(e.target.files[0])} style={{ marginTop: '15px' }} />
                    {errors.photo && <span style={{ color: 'red' }}>{errors.photo[0]}</span>}

                    <button className="btn btn-block" style={{ backgroundColor :'#4c92ca', textDecoration :'none'}}>S'inscrire</button>
                    <div className="message">
                        Vous avez déjà un compte? <Link to='/login' style={{ color :'#4c92ca', textDecoration :'none'}}>Connexion</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
