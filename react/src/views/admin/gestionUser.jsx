import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../views/gestionUser.css'; // Assurez-vous d'avoir créé ce fichier pour le style

export default function GestionUser() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:8000/api/users')
      .then(response => {
        const userData = Array.isArray(response.data) ? response.data : response.data.users || [];
        setUsers(userData);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  };

  const handleAddUserClick = () => {
    setShowForm(true);
  };

  const backToList = () => {
    setShowForm(false);
    setErrors({}); // Clear errors when returning to the list
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const payload = new FormData(form);

    axios.post("http://localhost:8000/api/register", payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(() => {
        setShowForm(false);
        fetchUsers(); // Rafraîchit la liste après ajout
    })
    .catch((err) => {
        if (err.response && err.response.status === 422) {
            const errors = err.response.data.errors;
            setErrors(errors);
        } else {
            console.error('Server Error:', err.response || err.message);
        }
    });
  };

  const handleBanUser = (userId) => {
    axios.put(`http://localhost:8000/api/users/${userId}`, { isBanned: 1 })
      .then(() => fetchUsers())
      .catch(error => {
        console.error('Error banning user:', error);
      });
  };

  const handleUnbanUser = (userId) => {
    axios.put(`http://localhost:8000/api/users/${userId}`, { isBanned: 0 })
      .then(() => fetchUsers())
      .catch(error => {
        console.error('Error unbanning user:', error);
      });
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesSearch = [user.name, user.prenom, user.email].some(field =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesRole && matchesSearch;
  });

  return (
    <div className="gestion-user-container">
      <div className="header">
        <h2>Liste des Utilisateurs</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="nom, prénom ou email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="role-filter">
            <label>Filtrer par rôle:</label>
            <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
              <option value="">Tous les rôles</option>
              <option value="CITOYEN">CITOYEN</option>
              <option value="ADMINISTRATEUR">ADMINISTRATEUR</option>
              <option value="AGENT">AGENT</option>
            </select>
          </div>
          <button className="ajouter-utilisateur" onClick={handleAddUserClick}>Ajouter Utilisateur</button>
        </div>
      </div>
      {showForm ? (
        <form onSubmit={handleFormSubmit} className="user-form">
          <div className="form-group">
            <label>Nom:</label>
            <input type="text" name="name" />
            {errors.name && <span className="error-message">{errors.name[0]}</span>}
          </div>
          <div className="form-group">
            <label>Prénom:</label>
            <input type="text" name="prenom" />
            {errors.prenom && <span className="error-message">{errors.prenom[0]}</span>}
          </div>
          <div className="form-group">
            <label>Âge:</label>
            <input type="number" name="age" />
            {errors.age && <span className="error-message">{errors.age[0]}</span>}
          </div>
          <div className="form-group">
            <label>Genre:</label>
            <select name="genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value="" disabled>Sélectionner un genre</option>
              <option value="FEMME">FEMME</option>
              <option value="HOMME">HOMME</option>
            </select>
            {errors.genre && <span className="error-message">{errors.genre[0]}</span>}
          </div>

  

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" />
            {errors.email && <span className="error-message">Veuillez entrer une adresse e-mail valide</span>}
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" />
            {errors.password && <span className="error-message">{errors.password[0]}</span>}
          </div>
          <div className="form-group">
            <label>Téléphone:</label>
            <input type="tel" name="telephone" />
            {errors.telephone && <span className="error-message">{errors.telephone[0]}</span>}
          </div>
          <div className="form-group">
            <label>Photo:</label>
            <input type="file" name="photo" />
            {errors.photo && <span className="error-message">{errors.photo[0]}</span>}
          </div>
          <div className="form-group" >
            <label>Rôle:</label>
            <select name="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="" disabled>Sélectionner un rôle</option>
              <option value="CITOYEN">CITOYEN</option>
              <option value="ADMINISTRATEUR">ADMINISTRATEUR</option>
              <option value="AGENT">AGENT</option>
            </select>
            {errors.role && <span className="error-message">{errors.role[0]}</span>}
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-primary">Ajouter</button>
            <button type="button" className="btn-secondary" onClick={backToList}>Retour à la liste</button>
          </div>
        </form>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Âge</th>
              <th>Genre</th>
              <th>Rôle</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Photo</th>
              <th>Banne</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.prenom}</td>
                <td>{user.age}</td>
                <td>{user.genre}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.telephone}</td>
                <td>
                  <img 
                    src={`http://localhost:8000/storage/${user.photo}`} 
                    alt={user.name} 
                    style={{ maxWidth: '70px', maxHeight: '50px' }}
                  />
                </td>
                <td>{user.isBanned === 0 ? '✅' : '⛔️'}</td>
                <td>
                  <button onClick={() => handleBanUser(user.id)}>Bannir</button>
                  <br />
                  <button onClick={() => handleUnbanUser(user.id)}>Annuler le bannissement</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
