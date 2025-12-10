import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/react-router'
import {BrowserRouter, Routes, Route} from 'react-router';
import Login from './features/auth/Login.tsx'
import RouteGuard from './features/auth/RouteGuard.tsx'
import SSOCallback from './features/auth/SSOCallback.tsx'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl='/sign-in'>
      <Routes>
        <Route path="/" element={<RouteGuard />}>
        <Route index element={<App />} />
        <Route path="sign-in" >
          <Route index element={<Login />} />
          <Route path="create/sso-callback" element={<SSOCallback />} />
        </Route>
        </Route>
      </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
