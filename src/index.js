import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import './global.css';
import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>

        <App />

      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
