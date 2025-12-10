import { useAuth } from "@clerk/react-router";

function useUser(){
 const { userId, sessionClaims } = useAuth();

 return {
        clerkUserId: userId,
        userId: sessionClaims?.dbId,
        role: sessionClaims?.role,
};
}

export default useUser;