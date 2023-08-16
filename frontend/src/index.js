import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';

import Root from './routes/Root';
import Home from './routes/Home/Home';
import Login from './routes/Auth/Login';
import Register from './routes/Auth/Register';
import Leaderboard from './routes/Leaderboard/Leaderboard';
import Friends from './routes/Friends/Friends';
import AddNewFriend from './routes/Friends/AddNewFriend';
import ErrorPage from './error-page';

import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
  },
  {
    path: '/friends',
    element: <Friends />,
  },
  {
    path: '/addnewfriend',
    element: <AddNewFriend />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);

