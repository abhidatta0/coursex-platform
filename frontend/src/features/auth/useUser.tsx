import { useAuth, useUser as useUserClerk } from "@clerk/react-router";

function useUser(){
 const { userId,isLoaded } = useAuth();
 const {user} = useUserClerk();

 const publicMetadata = (user || {}).publicMetadata;

 return {
        clerkUserId: userId,
        userId: publicMetadata?.dbId,
        role: publicMetadata?.role,
        isLoggedIn: !!publicMetadata?.dbId,
        isLoaded: isLoaded,
};
}

export default useUser;