import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../views/gestionUser.css'; // Assurez-vous d'avoir créé ce fichier pour le style

export default function GestionUser() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
            console.error('Validation errors:', err.response.data.errors);
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
        <form onSubmit={handleFormSubmit}>
          <label>Nom:</label>
          <input type="text" name="name" required />
          <br />
          <label>Prénom:</label>
          <input type="text" name="prenom" required />
          <br />
          <label>Âge:</label>
          <input type="number" name="age" required />
          <br />
          <label>Genre:</label>
          <select name="genre" required>
            <option value="" disabled>Sélectionner un genre</option>
            <option value="FEMME">FEMME</option>
            <option value="HOMME">HOMME</option>
          </select>
          <br />
          <label>Rôle:</label>
          <select name="role" required>
            <option value="" disabled>Sélectionner un rôle</option>
            <option value="CITOYEN">CITOYEN</option>
            <option value="ADMINISTRATEUR">ADMINISTRATEUR</option>
            <option value="AGENT">AGENT</option>
          </select>
          <br />
          <label>Email:</label>
          <input type="email" name="email" required />
          <br />
          <label>Password:</label>
          <input type="password" name="password" required />
          <br />
          <label>Téléphone:</label>
          <input type="tel" name="telephone" required />
          <br />
          <label>Photo:</label>
          <input type="file" name="photo" />
          <br />
          <button type="submit">Ajouter</button>
          <button type="button" className="ajouter-utilisateur" onClick={backToList}>Retour à la liste</button>
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
