import { Outlet } from "react-router"
import Navbar from "./Navbar"

const RouteGuard = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}
export default RouteGuard