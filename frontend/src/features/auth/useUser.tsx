import { useAuth, useUser as useUserClerk } from "@clerk/react-router";

function useUser(){
 const { userId } = useAuth();
 const {user} = useUserClerk();

 const publicMetadata = (user || {}).publicMetadata;

 return {
        clerkUserId: userId,
        userId: publicMetadata?.dbId,
        role: publicMetadata?.role,
        isLoggedIn: !!publicMetadata?.dbId
};
}

export default useUser;