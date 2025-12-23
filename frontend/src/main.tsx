import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/react-router'
import {BrowserRouter, Routes, Route} from 'react-router';
import Login from './features/auth/Login.tsx'
import RouteGuard from '@/features/auth/RouteGuard.tsx'
import SSOCallback from '@/features/auth/SSOCallback.tsx'
import AdminHome from '@/features/admin/AdminHome.tsx'
import AdminRouteGuard from '@/features/admin/auth/AdminRouteGuard.tsx'
import Courses from '@/features/admin/courses/Courses.tsx'
import NewCourseCreate from '@/features/admin/courses/NewCourseCreate.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner"
import EditCourse from '@/features/admin/courses/EditCourse.tsx'
import Products from '@/features/admin/products/Products.tsx'
import ConsumerProducts from '@/features/consumer/products/Products.tsx'
import NewProductCreate from '@/features/admin/products/NewProductCreate.tsx'
import EditProduct from '@/features/admin/products/EditProduct.tsx'
import ProductDetails from '@/features/consumer/products/ProductDetails.tsx'

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus: false,
    }
  }
})

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl='/sign-in'>
      <Routes>
        <Route path="/" element={<RouteGuard />}>
        <Route index element={<ConsumerProducts />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="sign-in" >
          <Route index element={<Login />} />
          <Route path="create/sso-callback" element={<SSOCallback />} />
        </Route>
        </Route>
        <Route path="admin" element={<AdminRouteGuard />}>
          <Route index element={<AdminHome />} />
          <Route path="courses">
            <Route index Component={Courses} />
            <Route path="new" Component={NewCourseCreate} />
            <Route path=":courseId/edit" Component={EditCourse} />
          </Route>
           <Route path="products">
            <Route index Component={Products} />
            <Route path='new' Component={NewProductCreate} />
            <Route path=':productId/edit' Component={EditProduct} />
          </Route>
        </Route>
      </Routes>
      </ClerkProvider>
    </BrowserRouter>
    <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
)
