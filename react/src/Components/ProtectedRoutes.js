import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Protected Route for Admins
const ProtectedRouteAdmin = () => {
  const token = localStorage.getItem('token');
  const decodedData = token ? jwtDecode(token) : null;

  if (decodedData && decodedData.role === 'ADMINISTRATEUR') {
    return <Outlet />; // Allow access to admin routes
  } else if (decodedData && decodedData.role === 'AGENT') {
    return <Navigate to="/agentAcceuil" />; // Redirect agents to agentAcceuil
  } else if (decodedData && decodedData.role === 'CITOYEN') {
    return <Navigate to="/citoyenAcceuil" />; // Redirect citizens to citoyenAcceuil
  } else {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }
};

// Protected Route for Agents
const ProtectedRouteAgent = () => {
  const token = localStorage.getItem('token');
  const decodedData = token ? jwtDecode(token) : null;

  if (decodedData && decodedData.role === 'AGENT') {
    return <Outlet />; // Allow access to agent routes
  } else if (decodedData && decodedData.role === 'ADMINISTRATEUR') {
    return <Navigate to="/adminAcceuil" />; // Redirect admins to adminAcceuil
  } else if (decodedData && decodedData.role === 'CITOYEN') {
    return <Navigate to="/citoyenAcceuil" />; // Redirect citizens to citoyenAcceuil
  } else {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }
};

// Protected Route for Citizens
const ProtectedRouteCitoyen = () => {
  const token = localStorage.getItem('token');
  const decodedData = token ? jwtDecode(token) : null;

  if (decodedData && decodedData.role === 'CITOYEN') {
    return <Outlet />; // Allow access to citizen routes
  } else if (decodedData && decodedData.role === 'ADMINISTRATEUR') {
    return <Navigate to="/adminAcceuil" />; // Redirect admins to adminAcceuil
  } else if (decodedData && decodedData.role === 'AGENT') {
    return <Navigate to="/agentAcceuil" />; // Redirect agents to agentAcceuil
  } else {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }
};

export { ProtectedRouteAdmin, ProtectedRouteAgent, ProtectedRouteCitoyen };
