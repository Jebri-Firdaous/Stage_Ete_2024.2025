import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AdminAcceuil from './AdminAcceuil';
import AgentAcceuil from './AgentAcceuil';
import CitoyenAcceuil from './CitoyenAcceuil';
import { ProtectedRouteAdmin, ProtectedRouteAgent, ProtectedRouteCitoyen } from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/adminAcceuil"
          element={<ProtectedRouteAdmin />}
        >
          <Route path="" element={<AdminAcceuil />} />
        </Route>

        <Route
          path="/agentAcceuil"
          element={<ProtectedRouteAgent />}
        >
          <Route path="" element={<AgentAcceuil />} />
        </Route>

        <Route
          path="/citoyenAcceuil"
          element={<ProtectedRouteCitoyen />}
        >
          <Route path="" element={<CitoyenAcceuil />} />
        </Route>

        <Route path="/" element={<HomePage />} /> {/* Replace with your home page component */}
      </Routes>
    </Router>
  );
}

export default App;
