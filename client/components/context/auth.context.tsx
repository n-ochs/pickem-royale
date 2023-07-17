import React, { createContext, useContext, useState } from 'react';

import { UserDetails } from '@util/types';

// Types
interface IAuthCtx {
	user?: UserDetails;
	setUser?: React.Dispatch<React.SetStateAction<UserDetails>>;
}

// Defining Ctx
const AuthCtx: React.Context<IAuthCtx> = createContext<IAuthCtx>(undefined);

// Custom Hook
const useAuthCtx: () => IAuthCtx = () => {
	const context: IAuthCtx = useContext(AuthCtx);

	if (context === undefined) {
		throw new Error('useAuthCtx was used outside of its provider');
	}
	return { ...context };
};

// React Provider
const AuthCtxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserDetails>(new UserDetails());

	return <AuthCtx.Provider value={{ user, setUser }}>{children}</AuthCtx.Provider>;
};

export { useAuthCtx };
export default AuthCtxProvider;
