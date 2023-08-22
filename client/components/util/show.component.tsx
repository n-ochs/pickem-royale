import React from 'react';

interface IShowProps {
	when: boolean;
	fallback?: JSX.Element;
	children: React.ReactNode;
}

const Show: React.FC<IShowProps> = ({ when, fallback, children }) => {
	if (when) {
		return <>{children}</>;
	} else if (!when && fallback) {
		return <>{fallback}</>;
	} else {
		return null;
	}
};

export default Show;
