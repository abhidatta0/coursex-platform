import { Navigate, Outlet, useLocation } from "react-router"
import Navbar from "./Navbar"
import useUser from "./useUser";

const RouteGuard = () => {
  const {pathname} = useLocation();

  const {userId, isLoaded} = useUser();

  const showNavbar = ()=>{
    if(pathname.startsWith('/sign-in') || pathname.startsWith('/admin')){
      return false;
    }
    return true;
  }

  const isNavbarShown = showNavbar();

  if(!userId && isLoaded){
    return <Navigate to="/" replace />
  }
  return (
    <>
      {isNavbarShown && <Navbar />}
      <Outlet />
    </>
  )
}
export default RouteGuard