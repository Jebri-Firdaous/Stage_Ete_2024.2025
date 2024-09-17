import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GestionAgentRec() {
  const [reclamations, setReclamations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [editReclamation, setEditReclamation] = useState(null);
  const [users, setUsers] = useState([]);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/api/user', {
        headers: { Authorization: `Bearer ${token.trim()}` },
      })
      .then(response => {
        setUser(response.data);
        reloadReclamations();
        reloadRecommendations();
        fetchUsers();
      })
      .catch(error => {
        console.error('Error verifying user:', error.response ? error.response.data : error.message);
      });
    }
  }, [token]);

  const reloadReclamations = () => {
    axios.get('http://localhost:8000/api/reclamations', {
      headers: { Authorization: `Bearer ${token.trim()}` },
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

  const reloadRecommendations = () => {
    axios.get('http://localhost:8000/api/recommendations', {
      headers: { Authorization: `Bearer ${token.trim()}` },
    })
    .then(response => {
      if (Array.isArray(response.data)) {
        setRecommendations(response.data);
      } else {
        console.error('Unexpected data structure:', response.data);
      }
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error.response ? error.response.data : error.message);
    });
  };

  const fetchUsers = () => {
    axios.get('http://localhost:8000/api/users', {
      headers: { Authorization: `Bearer ${token.trim()}` },
    })
    .then(response => {
      const agents = response.data.filter(user => user.role === 'AGENT');
      setUsers(agents);
    })
    .catch(error => {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
    });
  };

  const handleUpdateStatus = (idRec, newStatus) => {
    axios.put(`http://localhost:8000/api/reclamations/${idRec}/status`, 
      { status: newStatus }, 
      { headers: { Authorization: `Bearer ${token.trim()}` } }
    )
    .then(response => {
      console.log('Status updated successfully:', response.data);
      reloadReclamations();  // Refresh the list of reclamations
      setStatusToUpdate(null);  // Close the status update dropdown
    })
    .catch(error => {
      console.error('Error updating status:', error.response ? error.response.data : error.message);
    });
  };
  

  const handleSubmitReply = (idRec) => {
    if (replyText.trim() === '') {
      alert('Veuillez entrer une réponse.');
      return;
    }

    axios.post(`http://localhost:8000/api/reclamations/${idRec}/replies`, 
      { 
        text: replyText,
        date_recommendation: new Date().toISOString().split('T')[0],
        author_id: user?.id
      },
      { headers: { Authorization: `Bearer ${token.trim()}` } }
    )
    .then(response => {
      console.log('Réponse soumise avec succès:', response.data);
      reloadReclamations();
      reloadRecommendations();
      setReplyingTo(null);
      setReplyText('');
    })
    .catch(error => {
      console.error('Erreur lors de la soumission de la réponse:', error.response ? error.response.data : error.message);
    });
  };

  const filteredReclamations = reclamations.filter(reclamation => {
    const matchesState = !selectedState || reclamation.status === parseInt(selectedState);
    const matchesSearch = reclamation.dateSoumission.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reclamation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isAssignedToUser = reclamation.idAgent === user?.id;

    return matchesState && matchesSearch && isAssignedToUser;
  });

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
        </div>
      </div>
      {showUpdateForm ? (
        <form onSubmit={handleUpdateSubmit}>
          <label>Description:</label>
          <input type="text" name="description" defaultValue={editReclamation?.description} required />
          <br />
          <button type="submit">Mettre à jour</button>
          <button type="button" className="ajouter-utilisateur" onClick={() => setShowUpdateForm(false)}>Annuler</button>
        </form>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Description</th>
              <th>Date Soumission</th>
              <th>Status</th>
              
              <th>Recommandations</th>
              <th>Actions</th>
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
                  {recommendations
                    .filter(rec => rec.idRec === reclamation.idRec)
                    .map((rec, index) => (
                      <ul key={index}>
                        <li>{rec.text}</li>
                      </ul>
                  ))}
                  {recommendations.every(rec => rec.idRec !== reclamation.idRec) && 'Aucune recommandation'}
                </td>
                <td>
                  <button onClick={() => setStatusToUpdate(reclamation.idRec)}>Modifier status</button>
                  {statusToUpdate === reclamation.idRec && (
                    <div>
                      <select onChange={(e) => handleUpdateStatus(reclamation.idRec, e.target.value)} value={reclamation.status}>
                        <option value="0">Non traité</option>
                        <option value="1">Traité</option>
                        <option value="2">En attente</option>
                      </select>
                    </div>
                  )}
                  <button onClick={() => setReplyingTo(reclamation.idRec)}>Répondre</button>
                  {replyingTo === reclamation.idRec && (
                    <div>
                      <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Écrivez votre réponse ici..."
                      />
                      <br/>
                      <button onClick={() => handleSubmitReply(reclamation.idRec)}>Soumettre</button>
                      <br/>

                      <button onClick={() => setReplyingTo(null)}>Annuler</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
