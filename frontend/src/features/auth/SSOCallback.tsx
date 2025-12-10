import { AuthenticateWithRedirectCallback } from "@clerk/react-router"

const SSOCallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2>Completing sign in...</h2>
        <p className="text-gray-600">
          Please wait while we finish signing you in.
        </p>
      </div>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/sign-in"
      />
    </div>
  )
}
export default SSOCallback