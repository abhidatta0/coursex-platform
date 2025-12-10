import { Outlet, useLocation } from "react-router"
import Navbar from "./Navbar"

const RouteGuard = () => {
  const {pathname} = useLocation();

  const showNavbar = ()=>{
    if(pathname.startsWith('/sign-in')){
      return false;
    }
    return true;
  }

  const isNavbarShown = showNavbar();
  return (
    <>
      {isNavbarShown && <Navbar />}
      <Outlet />
    </>
  )
}
export default RouteGuard