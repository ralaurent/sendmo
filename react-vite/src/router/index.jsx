import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home'
import Layout from './Layout';
import Dashboard from '../components/Dashboard';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
      {
        path: "/*",
        element: <h2>404</h2>
      },
    ],
  },
]);