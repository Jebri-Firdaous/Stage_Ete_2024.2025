import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reclamation() {
  const [reclamations, setReclamations] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // New state for recommendations
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [editReclamation, setEditReclamation] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/api/user', {
        headers: { 'Authorization': `Bearer ${token.trim()}` }
      })
      .then(response => {
        setUser(response.data);
        fetchReclamations(); // Fetch reclamations once user data is available
        fetchRecommendations(); // Fetch recommendations
      })
      .catch(error => {
        console.error('Error verifying user:', error.response ? error.response.data : error.message);
      });
    }
  }, [token]);

  const fetchReclamations = () => {
    axios.get('http://localhost:8000/api/reclamations', {
      headers: { 'Authorization': `Bearer ${token.trim()}` }
    })
    .then(response => {
      if (Array.isArray(response.data)) {
        setReclamations(response.data);
      } else if (response.data.reclamations) {
        setReclamations(response.data.reclamations);
      } else {
        console.error('Unexpected data structure:', response.data);
      }
    })
    .catch(error => {
      console.error('Error fetching reclamations:', error.response ? error.response.data : error.message);
    });
  };

  const fetchRecommendations = () => {
    axios.get('http://localhost:8000/api/recommendations', {
      headers: { 'Authorization': `Bearer ${token.trim()}` }
    })
    .then(response => {
      setRecommendations(response.data);
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error.response ? error.response.data : error.message);
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const description = form.description.value;
    const payload = new FormData();
    payload.append('description', description);
    payload.append('idCitoyen', user ? user.id : '');

    axios.get('http://localhost:8000/sanctum/csrf-cookie')
      .then(() => {
        const csrfToken = axios.defaults.headers.common['X-CSRF-TOKEN'];
        axios.post('http://localhost:8000/api/addReclamation', payload, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token.trim()}`,
            'X-CSRF-TOKEN': csrfToken
          }
        })
        .then(() => {
          setShowForm(false);
          fetchReclamations(); // Refresh the list after adding a new reclamation
        })
        .catch(err => {
          console.error('Error adding reclamation:', err.response ? err.response.data : err.message);
        });
      });
  };

  const handleUpdate = (reclamation) => {
    setEditReclamation(reclamation);
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const description = form.description.value;

    axios.get('http://localhost:8000/sanctum/csrf-cookie')
      .then(() => {
        const csrfToken = axios.defaults.headers.common['X-CSRF-TOKEN'];
        axios.put(`http://localhost:8000/api/reclamations/${editReclamation.idRec}`, { description }, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'X-CSRF-TOKEN': csrfToken
          }
        })
        .then(response => {
          setReclamations(reclamations.map(reclamation =>
            reclamation.idRec === editReclamation.idRec ? { ...reclamation, description } : reclamation
          ));
          setShowUpdateForm(false);
          setEditReclamation(null);
          fetchReclamations(); // Refresh the list after updating a reclamation
          console.log('Réclamation mise à jour:', response.data);
        })
        .catch(err => {
          console.error('Erreur lors de la mise à jour:', err.response ? err.response.data : err.message);
        });
      });
  };

  const handleDelete = (idRec) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette réclamation ?')) {
      axios.get('http://localhost:8000/sanctum/csrf-cookie')
        .then(() => {
          const csrfToken = axios.defaults.headers.common['X-CSRF-TOKEN'];
          axios.delete(`http://localhost:8000/api/reclamations/${idRec}`, {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token.trim()}`,
              'X-CSRF-TOKEN': csrfToken
            }
          })
          .then(response => {
            setReclamations(reclamations.filter(reclamation => reclamation.idRec !== idRec));
            console.log('Réclamation supprimée:', response.data);
          })
          .catch(error => {
            console.error('Erreur lors de la suppression:', error.response ? error.response.data : error.message);
          });
        });
    }
  };

  // Filter reclamations based on user, state, and search query
  const filteredReclamations = reclamations.filter(reclamation => {
    const matchesUser = user && reclamation.idCitoyen === user.id;
    const matchesState = !selectedState || reclamation.status === parseInt(selectedState);
    const matchesSearch = reclamation.dateSoumission.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reclamation.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUser && matchesState && matchesSearch;
  });

// Get recommendations that match reclamation id
const getRecommendationsForReclamation = (idRec) => {
  const recs = recommendations.filter(recommendation => recommendation.idRec === idRec);
  return recs.length > 0 ? recs : [{ text: 'Aucune recommandation' }];
};


  return (
    <div className="gestion-user-container">
      <div className="header">
        <h2>Liste des Réclamations</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="date ou description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="role-filter">
            <label>Filtrer par status:</label>
            <select onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
              <option value="">Tous les status</option>
              <option value="1">traité</option>
              <option value="0">non traité</option>
              <option value="2">en attente</option>
            </select>
          </div>
          <button className="ajouter-utilisateur" onClick={() => setShowForm(true)}>Ajouter Réclamation</button>
        </div>
      </div>
      {showForm ? (
        <form onSubmit={handleFormSubmit}>
          <label>Description:</label>
          <input type="text" name="description" required />
          <br />
          <button type="submit">Ajouter</button>
          <button type="button" className="ajouter-utilisateur" onClick={() => setShowForm(false)}>Retour à la liste</button>
        </form>
      ) : showUpdateForm ? (
        <form onSubmit={handleUpdateSubmit}>
          <label>Description:</label>
          <input type="text" name="description" defaultValue={editReclamation.description} required />
          <br />
          <button type="submit">Mettre à jour</button>
          <button type="button" className="ajouter-utilisateur" onClick={() => setShowUpdateForm(false)}>Annuler</button>
        </form>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Description</th>
              <th>Date Soumission</th>
              <th>Status</th>
              <th>Recommandations</th> {/* New column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReclamations.map(reclamation => (
              <tr key={reclamation.idRec}>
                <td style={{ maxWidth: '100px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  {reclamation.description}
                </td>
                <td>{reclamation.dateSoumission}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {reclamation.status === 0 && <span>❌</span>}
                  {reclamation.status === 1 && <span>✅</span>}
                  {reclamation.status === 2 && <span>⏳</span>}
                </td>
                <td>
                  <ul>
                    {getRecommendationsForReclamation(reclamation.idRec).map(recommendation => (
                      <li key={recommendation.idRec}>{recommendation.text}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => handleDelete(reclamation.idRec)}>Supprimer</button>
                  <br />
                  <button onClick={() => handleUpdate(reclamation)}>Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
