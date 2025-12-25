import { Outlet } from "react-router"
import AdminNavbar from "./Navbar"
import useUser from "@/features/auth/useUser"

const AdminRouteGuard = () => {
  const {userId} = useUser();
  return (
    <>
      <AdminNavbar />
      <main className="container">
        {userId && <Outlet />}
      </main>
    </>
  )
}
export default AdminRouteGuard