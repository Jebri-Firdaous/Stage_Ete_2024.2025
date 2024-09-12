import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from "../../contexts/contextprovider";
import '../adminprofile.css'; // Assurez-vous que ce fichier CSS contient le style nécessaire

export default function AdminProfile() {
  const { user, token, setUser } = useStateContext();
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Initialize editableUser with user data
    if (user) {
      setEditableUser({ ...user });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialiser l'état d'erreur
    setSuccess(null); // Réinitialiser l'état de succès

    try {
        const response = await axios.put(`http://localhost:8000/api/usersupdate/${user.id}`, editableUser, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        setUser(response.data); // Mettre à jour le contexte utilisateur avec les données de la réponse
        setSuccess('Profil mis à jour avec succès.');
        setIsEditing(false); // Quitter le mode d'édition
    } catch (error) {
        setError('Erreur lors de la mise à jour du profil.');
        console.error('Error updating user:', error);
    }
  };

  if (!editableUser) {
    return <p>Loading...</p>;
  }

  // Construire l'URL complète de la photo

  return (
    <div className="profile-container" style={{width: '100%', textAlign: 'left'}}>
  <h2 style={{ textAlign: 'left', fontSize: '20px'}}> Profile </h2>
  {error && <p className="error-message">{error}</p>}
  {success && <p className="success-message">{success}</p>}
  {isEditing ? (
    <form onSubmit={handleUpdate}>
      <label>Nom:</label>
      <input
        type="text"
        name="name"
        value={editableUser.name}
        onChange={handleInputChange}
        required
      />
      <br />
      <label>Prénom:</label>
      <input
        type="text"
        name="prenom"
        value={editableUser.prenom}
        onChange={handleInputChange}
        required
      />
      <br />
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={editableUser.email}
        onChange={handleInputChange}
        required
      />
      <br />
      <label>Téléphone:</label>
      <input
        type="tel"
        name="telephone"
        value={editableUser.telephone}
        onChange={handleInputChange}
        required
      />
      <br />
      <br />
      <button type="submit" className="btn-primary" style={{backgroundColor: '#4c92ca'}}>Mettre à jour</button>
      <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{color: '#4c92ca'}}>Annuler</button>
    </form>
  ) : (
    <div style={{width: '100%', textAlign: 'left', fontSize:'15px'}}>
      <p><strong>Nom:</strong> {editableUser.name}</p>
      <p><strong>Prénom:</strong> {editableUser.prenom}</p>
      <p><strong>Email:</strong> {editableUser.email}</p>
      <p><strong>Téléphone:</strong> {editableUser.telephone}</p>
      <p><strong> Rôle: </strong> {user.role} </p>
      <div>
        <p><strong>Photo:</strong></p>
        <img 
          src={`http://localhost:8000/storage/${user.photo}`} 
          alt={user.name} 
          style={{ maxWidth: '150px', maxHeight: '100px', textAlign: 'center'}}
        />
      </div>
      <button onClick={() => setIsEditing(true)} className="btn-edit">Modifier</button>
    </div>
  )}
</div>

  );
}
