// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom';
//
// const rootElement = document.getElementById('root');
//
// if (!rootElement) throw new Error("Root element not found");
//
// ReactDOM.createRoot(rootElement as HTMLElement).render(
//     <React.StrictMode>
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     </React.StrictMode>
// );

import { initThemeMode } from "flowbite-react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.tsx";
import App from './App';
import React from "react";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
);

initThemeMode();
