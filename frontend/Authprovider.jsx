import React, { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';
import Loading from './loading';
import { useMutation } from 'convex/react';

import { UserContext } from './_context/UserContext';
import { api } from '@/convex/_generated/api';

function AuthProvider({ children }) {
    const user = useUser();
    const CreateUser = useMutation(api.users.createUser);
    const [userData, setUserData] = useState();

    useEffect(() => {
        if (user && !userData) {
            CreateNewuser();
        }
    }, [user, userData]);

    const CreateNewuser = async () => {
        try {
            const result = await CreateUser({
                name: user?.displayName,
                email: user.primaryEmail
            });
            console.log(result);
            setUserData(result);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}

export default AuthProvider;
