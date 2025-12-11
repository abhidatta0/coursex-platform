import {Link} from 'react-router';
import {SignedIn,UserButton, SignedOut, SignInButton} from '@clerk/react-router';
import { Button } from '@/components/ui/button';
import Config from '@/lib/app/config';

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10 justify-center p-3">
      <nav className="flex gap-4 flex-1">
        <Link
          className="mr-auto text-lg hover:underline flex items-center"
          to="/"
        >
        {Config.APP_NAME}
        </Link>
        <SignedIn>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              to="courses"
            >
              Courses
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              to="products"
            >
              Products
            </Link>
             <Link
              className="hover:bg-accent/10 flex items-center px-2"
              to="sales"
            >
              Sales
            </Link>
            <div className="size-8 self-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              />
            </div>
        </SignedIn>
        <SignedOut>
          <Button className="self-center" asChild>
            <SignInButton>Sign In</SignInButton>
          </Button>
        </SignedOut>
      </nav>
    </header>
  )
}

export default Navbar;

function AdminLink(){

  return (
    <Link
      className="hover:bg-accent/10 flex items-center px-2"
      to="/admin"
    >
      Admin
    </Link>
  )
}