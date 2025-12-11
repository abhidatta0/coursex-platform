import { Outlet } from "react-router"
import AdminNavbar from "./Navbar"

const AdminRouteGuard = () => {
  return (
    <>
      <AdminNavbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
export default AdminRouteGuard