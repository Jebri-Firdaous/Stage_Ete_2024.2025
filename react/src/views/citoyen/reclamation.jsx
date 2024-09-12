import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../reclamation.css'; // Import the CSS file

export default function Reclamation() {
  const [reclamations, setReclamations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
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
        fetchReclamations();
        fetchRecommendations();
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
      setReclamations(Array.isArray(response.data) ? response.data : response.data.reclamations || []);
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
      console.log('Recommendations fetched:', response.data); // Vérifiez les données
      setRecommendations(response.data);
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error.response ? error.response.data : error.message);
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const description = event.target.description.value;
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
          fetchReclamations();
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
    const description = event.target.description.value;

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
          fetchReclamations();
          console.log('Réclamation mise à jour:', response.data);
        })
        .catch(err => {
          console.error('Erreur lors de la mise à jour:', err.response ? err.response.data : err.message);
        });
      });
  };

  const handleDelete = (idRec) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette réclamation et ses recommandations ?')) {
      axios.get(`http://localhost:8000/api/recommendationsByReclamation/${idRec}`, {
        headers: { 'Authorization': `Bearer ${token.trim()}` }
      })
      .then(response => {
        console.log('Recommendations for reclamation:', response.data); // Vérifiez les données
        const recommendationsForReclamation = response.data;

        // Filtrer les recommandations avec un ID valide
        const validRecommendations = recommendationsForReclamation.filter(recommendation => recommendation.idComment);

        // Supprimer les recommandations
        const deleteRecommendationsPromises = validRecommendations.map(recommendation =>
          axios.delete(`http://localhost:8000/api/recommendations/${recommendation.idComment}`, {
            headers: { 'Authorization': `Bearer ${token.trim()}` }
          })
        );

        return Promise.all(deleteRecommendationsPromises);
      })
      .then(() => {
        return axios.delete(`http://localhost:8000/api/reclamations/${idRec}`, {
          headers: { 'Authorization': `Bearer ${token.trim()}` }
        });
      })
      .then(response => {
        setReclamations(reclamations.filter(reclamation => reclamation.idRec !== idRec));
        console.log('Réclamation et recommandations supprimées:', response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error.response ? error.response.data : error.message);
      });
    }
  };

  const filteredReclamations = reclamations.filter(reclamation => {
    const matchesUser = user && reclamation.idCitoyen === user.id;
    const matchesState = !selectedState || reclamation.status === parseInt(selectedState);
    const matchesSearch = reclamation.dateSoumission.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reclamation.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUser && matchesState && matchesSearch;
  });

  const getRecommendationsForReclamation = (idRec) => {
    return recommendations.filter(recommendation => recommendation.idRec === idRec);
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
            <label>Filtrer par statut:</label>
            <select onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
              <option value="">Tous les statuts</option>
              <option value="1">Traitée</option>
              <option value="0">Non traitée</option>
              <option value="2">En attente</option>
            </select>
          </div>
          <button className="ajouter-utilisateur" onClick={() => setShowForm(true)}>Ajouter Réclamation</button>
        </div>
      </div>
      {showUpdateForm ? (
  <form onSubmit={handleUpdateSubmit} className="user-form">
    <div style={{
      width: '204%',
      height: '200px',
      border: '2px solid #e6e6e6',
      margin: '0 0 0px',
      padding: '15px',
      boxSizing: 'border-box',
      fontSize: '14px',
      transition: 'all 0.3s',
      overflow: 'hidden',
      color :'black',
      fontSize : '20px',
    }}>
      <label>Description:</label>
      <textarea
        name="description"
        defaultValue={editReclamation ? editReclamation.description : ''}
        required
        style={{
          width: '100%',
          height: '80%',
          fontSize: '15px',
          textAlign: 'left',
          verticalAlign: 'top',
          padding: '10px',
          boxSizing: 'border-box',
          resize: 'none',
          overflow: 'auto',
          lineHeight: '1.2',
        }}
      />
    </div>
    <div className="form-buttons">
      <div className="button-container">
        <button type="submit" className="btn-primary">Mettre à jour</button>
        <button type="button" className="btn-secondary" onClick={() => setShowUpdateForm(false)}>Annuler</button>
      </div>
    </div>
  </form>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Description</th>
              <th>Date Soumission</th>
              <th>Status</th>
              <th>Recommandations</th>
              <th style={{ width: '20%' }}>Action</th>
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
                <td style={{ maxWidth: '10%', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  <ul style={{ padding: '0', margin: '0', listStyleType: 'none' }}>
                    {getRecommendationsForReclamation(reclamation.idRec).map((recommendation, index) => (
                      <li key={`${reclamation.idRec}-${index}`} style={{ marginBottom: '5px' }}>
                        {recommendation.text}
                      </li>
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
