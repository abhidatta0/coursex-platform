import { Button } from "@/components/ui/button"
import { Link } from "react-router"

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-3">
        <p className="text-4xl">OOPS</p>
        <p>This is not the page you are looking for </p>
        <Button asChild>
            <Link to="/">Go To Homepage</Link>
        </Button>
    </div>
  )
}
export default NotFound