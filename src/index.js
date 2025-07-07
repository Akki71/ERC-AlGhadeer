import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import './global.css';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';
import { createRoot } from 'react-dom/client'
// Initialize Bugsnag for error monitoring and performance tracking
Bugsnag.start({
  apiKey: 'ed1c2afa7569eef8c8913244afc50103', // Replace with your BugSnag API key
  plugins: [new BugsnagPluginReact()]
});
BugsnagPerformance.start({
  apiKey: 'ed1c2afa7569eef8c8913244afc50103' // Replace with your BugSnag API key
});

// Create the ErrorBoundary component for React
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

// Wrap your app in the ErrorBoundary to catch errors
// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <AuthProvider>
//         <ErrorBoundary>
//           <App />
//         </ErrorBoundary>
//       </AuthProvider>
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}>
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  </Provider>
</React.StrictMode>,
)
