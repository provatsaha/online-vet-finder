import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
	userId: string | null;
	vetId: string | null;
	setAuth: (userId: string, vetId?: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [userId, setUserId] = useState<string | null>(
		localStorage.getItem("user_id")
	);
	const [vetId, setVetId] = useState<string | null>(
		localStorage.getItem("vet_id")
	);

	const setAuth = (userId: string, vetId?: string) => {
		setUserId(userId);
		localStorage.setItem("user_id", userId);

		if (vetId) {
			setVetId(vetId);
			localStorage.setItem("vet_id", vetId);
		} else {
			setVetId(null);
			localStorage.removeItem("vet_id");
		}
	};

	const logout = () => {
		setUserId(null);
		setVetId(null);
		localStorage.removeItem("user_id");
		localStorage.removeItem("vet_id");
	};

	return (
		<AuthContext.Provider value={{ userId, vetId, setAuth, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
