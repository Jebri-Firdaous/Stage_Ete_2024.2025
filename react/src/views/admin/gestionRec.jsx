import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GestionRec() {
  const [reclamations, setReclamations] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [editReclamation, setEditReclamation] = useState(null);
  const [users, setUsers] = useState([]);
  const [reclamationToAssign, setReclamationToAssign] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [statusToUpdate, setStatusToUpdate] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/api/user', {
        headers: { Authorization: `Bearer ${token.trim()}` },
      })
        .then(response => {
          setUser(response.data);

          // Fetch reclamations
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

          // Fetch users
          axios.get('http://localhost:8000/api/users', {
            headers: { Authorization: `Bearer ${token.trim()}` },
          })
            .then(response => {
              // Filtrer les utilisateurs avec le rôle "AGENT"
              const agents = response.data.filter(user => user.role === 'AGENT');
              setUsers(agents);
            })
            .catch(error => {
              console.error('Error fetching users:', error.response ? error.response.data : error.message);
            });
        })
        .catch(error => {
          console.error('Error verifying user:', error.response ? error.response.data : error.message);
        });
    }
  }, [token]);

  // Fonction pour recharger les réclamations
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

  const handleAssignAgent = () => {
    if (!selectedAgent) {
      alert('Veuillez sélectionner un agent');
      return;
    }

    axios.put(`http://localhost:8000/api/reclamations/${reclamationToAssign}/assign`,
      { agentId: selectedAgent },
      {
        headers: { Authorization: `Bearer ${token.trim()}` },
      })
      .then(response => {
        console.log('Agent assigned successfully:', response.data);
        reloadReclamations();
        setReclamationToAssign(null);
        setSelectedAgent(''); // Réinitialiser la sélection de l'agent
      })
      .catch(error => {
        console.error('Error assigning agent:', error.response ? error.response.data : error.message);
      });
  };

  const handleUpdateStatus = (idRec, newStatus) => {
    axios.put(`http://localhost:8000/api/reclamations/${idRec}/status`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token.trim()}` },
      })
      .then(response => {
        console.log('Status updated successfully:', response.data);
        reloadReclamations();
        setStatusToUpdate(null);
      })
      .catch(error => {
        console.error('Error updating status:', error.response ? error.response.data : error.message);
      });
  };

  const filteredReclamations = reclamations.filter(reclamation => {
    const matchesState = !selectedState || reclamation.status === parseInt(selectedState);
    const matchesSearch = reclamation.dateSoumission.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reclamation.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
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
          <input type="text" name="description" defaultValue={editReclamation.description} required />
          <br />
          <button type="submit">Mettre à jour</button>
          <button type="button" className="ajouter-utilisateur" onClick={() => setShowUpdateForm(false)}>Annuler</button>
        </form>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Description</th>
              <th>Date Soumission</th>
              <th>Status</th>
              <th>Agent</th>
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
  {reclamation.idAgent
    ? users.find(agent => agent.id === reclamation.idAgent)
        ? `${users.find(agent => agent.id === reclamation.idAgent).name} ${users.find(agent => agent.id === reclamation.idAgent).prenom}`
        : 'Agent non trouvé'
    : 'Non assigné'}
</td>

                <td>
                  {reclamationToAssign === reclamation.idRec ? (
                    <div>
                      <select
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        value={selectedAgent}
                      >
                        <option value="">Sélectionner un agent</option>
                        {users.map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name} {agent.prenom}
                          </option>
                        ))}
                      </select>
                      <button onClick={handleAssignAgent}>Confirmer</button>
                    </div>
                  ) : (
                    <button onClick={() => setReclamationToAssign(reclamation.idRec)}>Assigner à un agent</button>
                  )}
                  <br/>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
