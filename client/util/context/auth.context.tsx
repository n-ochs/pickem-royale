import React, { createContext, useContext } from 'react';

import { useQuery } from '@tanstack/react-query';
import { isAuthenticated } from '@util/api/auth.service';

interface IAuthContext {
	isLoading: boolean;
	isSuccess: boolean;
}

// Defining Context
const AuthCtx: React.Context<IAuthContext> = createContext<IAuthContext>(null);

// Custom Hook
export const useAuthCtx: () => IAuthContext = () => {
	return useContext(AuthCtx);
};

// React Component
const AuthCtxProvider: React.FC = ({ children }) => {
	const { isLoading, isSuccess } = useQuery({ queryKey: ['authCheck'], queryFn: isAuthenticated });

	return <AuthCtx.Provider value={{ isLoading, isSuccess }}>{children}</AuthCtx.Provider>;
};

export default AuthCtxProvider;
