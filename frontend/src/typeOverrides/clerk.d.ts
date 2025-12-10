import {UserRole} from '../features/auth/types';

export {};

declare global{
    interface CustomJwtSessionClaims{
        dbId?: string,
        role?: UserRole,
    }

    interface UserPublicMetadata{
        dbId?: string,
        role?: UserRole,
    }
}