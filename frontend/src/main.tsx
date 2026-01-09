import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ClerkProvider } from '@clerk/react-router'
import {BrowserRouter, Routes, Route} from 'react-router';
import Login from './features/auth/Login.tsx'
import RouteGuard from '@/features/auth/RouteGuard.tsx'
import SSOCallback from '@/features/auth/SSOCallback.tsx'
import AdminRouteGuard from '@/features/admin/auth/AdminRouteGuard.tsx'
import Courses from '@/features/admin/courses/Courses.tsx'
import NewCourseCreate from '@/features/admin/courses/NewCourseCreate.tsx'
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner"
import EditCourse from '@/features/admin/courses/EditCourse.tsx'
import Products from '@/features/admin/products/Products.tsx'
import NewProductCreate from '@/features/admin/products/NewProductCreate.tsx'
import EditProduct from '@/features/admin/products/EditProduct.tsx'
import Purchase from '@/features/consumer/products/Purchase.tsx'
import NotFound from '@/features/notFound/NotFound.tsx'
import PaymentReturn from '@/features/consumer/payment/PaymentReturn.tsx'
import PurchasesPage from './features/consumer/purchases/PurchaseTable.tsx';
import ConsumerCourses from '@/features/consumer/courses/Courses.tsx';
import SalesTable from './features/admin/sales/SalesTable.tsx';
import CourseDetails from './features/consumer/courses/courseDetails/CourseDetails.tsx';
import CourseDetailsLayout from './features/consumer/courses/courseDetails/CourseDetailsLayout.tsx';

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQuery?: QueryKey;
    };
  }
}
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus: false,
    },
    
  },
  mutationCache:new MutationCache({
    onSuccess:(data, variables, onMutateResult, mutation)=>{
      if(mutation.meta?.invalidateQuery){
        queryClient.invalidateQueries({
          queryKey:mutation.meta.invalidateQuery
        })
      }
    }
  })
})

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


const AdminHome = lazy(()=> import('@/features/admin/AdminHome.tsx'))
const ConsumerProducts = lazy(()=> import('@/features/consumer/products/Products.tsx'));
const ProductDetails = lazy(()=> import('@/features/consumer/products/ProductDetails.tsx'));
const Lesson = lazy(()=> import('./features/consumer/courses/courseDetails/Lesson.tsx'));

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl='/sign-in'>
      <Routes>
        <Route path="sign-in" >
          <Route index element={<Login />} />
          <Route path="create/sso-callback" element={<SSOCallback />} />
        </Route>
        <Route path="/" element={<RouteGuard />}>
        <Route index element={<ConsumerProducts />} />
        <Route path="products/:id" >
          <Route index element={<ProductDetails />} />
          <Route path="purchase" element={<Purchase />} />
        </Route>
        <Route path="courses">
          <Route index element={<ConsumerCourses />} />
          <Route path=":courseId" Component={CourseDetailsLayout}>
            <Route index Component={CourseDetails} />
            <Route path="lessons/:lessonId" Component={Lesson} />
          </Route>
        </Route>
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path='payment-return' element={<PaymentReturn />} />
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
          <Route path="sales" Component={SalesTable} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ClerkProvider>
    </BrowserRouter>
    <Toaster richColors/>
    </QueryClientProvider>
  </React.StrictMode>,
)
