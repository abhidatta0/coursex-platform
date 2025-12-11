import { Outlet } from "react-router"
import AdminNavbar from "./Navbar"

const AdminRouteGuard = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  )
}
export default AdminRouteGuard