import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import { getMeRequest } from './api/auth.api';
import { useAuthStore } from './store/auth.store';

//user hydration on app load
const token = localStorage.getItem('token');
if (token) {
  getMeRequest()
    .then((user) => {
      useAuthStore.getState().setAuth(user, token);
    })
    .catch(() => {
      localStorage.removeItem('token');
    });
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);