import { createBrowserRouter } from 'react-router-dom';
import Login from './views/login.jsx';
import Register from './views/register.jsx';
import DefaultLayout from './Components/DefaultLayout.jsx';
import GuestLayout from './Components/GuestLayout.jsx';
import Users from './views/users.jsx';
import UserForm from './views/UserForm.jsx';
import Mdp from './views/mdpoublie.jsx';
import AdminAcceuil from './views/admin/acceuil_admin.jsx';
import AgentAcceuil from './views/agent/acceuil_agent.jsx';
import CitoyenAcceuil from './views/citoyen/acceuil_citoyen.jsx';
import Reclamation from './views/citoyen/reclamation.jsx';
import Dashbord from './views/admin/Dashbord.jsx';
import GestionRec from './views/admin/gestionRec.jsx';
import GestionUser from './views/admin/gestionUser.jsx';
import AdminProfile from './views/admin/adminProfile.jsx';
import GestionAgentRec from './views/agent/gestionAgentRec.jsx';
import Acceuil from './views/agent/acceuil.jsx'
const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: 'users',
                element: <Users />,
            },
            {
                path: 'users/new',
                element: <UserForm key="userCreate" />,
            },
            {
                path: 'users/:id',
                element: <UserForm key="userUpdate" />,
            },
        ],
    },
    {
        path: '/agentAcceuil',
        element: <AgentAcceuil />,
        children: [
            {
                path: 'acceuil',  // This is the missing route
                element: <Acceuil />,  // Replace with the correct component if needed
            },
            {
                path: 'gestionAgentRec',
                element: <GestionAgentRec />,
            },
            {
                path: 'profile',
                element: <AdminProfile />,
            },
        ],
    },
    {
        path: '/citoyenAcceuil',
        element: <CitoyenAcceuil />,
        children: [
            {
                path: 'reclamation',
                element: <Reclamation />,
            },
        ],
    },
    {
        path: '/adminAcceuil',
        element: <AdminAcceuil />,
        children: [
            {
                path: 'Dashbord',
                element: <Dashbord />,
            },
            {
                path: 'gestionUser',
                element: <GestionUser />,
            },
            {
                path: 'gestionRec',
                element: <GestionRec />,
            },
            {
                path: 'profile',
                element: <AdminProfile />,
            },
        ],
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'forgotPassword',
                element: <Mdp />,
            },
        ],
    },
]);

export default router;
