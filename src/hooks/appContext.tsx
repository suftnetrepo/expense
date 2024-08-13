/* eslint-disable prettier/prettier */
import React, { useState, ReactNode, useContext } from "react";
import { User } from "../model/types";
import { useInAppPurchase } from "./useInAppPurchase";

interface Actions  {
	login: (params: { user: User; }) => Promise<void>;
	logout: () => Promise<void>;
	updateCurrentUser: (user: User) => void;
}

interface State {
	user: User | null;	
	purchase_status: boolean;
	payment_status: boolean;
}

interface AppProviderProps {
	children: ReactNode;
}

export const AppContext = React.createContext<(Actions & State) | undefined>(
	undefined,
);

const initialState: State = {
	user: null,	
	purchase_status: false,
	payment_status: false,
};

const AppProvider = ({ children }: AppProviderProps) => {
	const [state, setState] = useState<State>(initialState);
	const { payment_status, purchase_status } = useInAppPurchase();

	const actions: Actions = {
		login: async (params: { user: User }) => {
			const { user } = params;
			setState((prevState) => ({
				...prevState,				
				user,
			}));
		},

		logout: async () => {
			setState(initialState);
		},

		updateCurrentUser: (updatedUser) => {
			setState((prevState) => ({
				...prevState,
				user: updatedUser,
			}));
		},	
	
	};

	return (
		<AppContext.Provider
			value={{
				...state,
				...actions,				
				payment_status,
				purchase_status,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;

export const useAppContext = (): Actions & State => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
