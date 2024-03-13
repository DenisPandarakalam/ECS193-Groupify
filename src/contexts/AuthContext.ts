import { createContext } from 'react';

interface AuthContextType {
  loggedIn: boolean,
  credentials: any,
  setCredentials?: React.Dispatch<React.SetStateAction<{}>>,
  clearCredentials?: CallableFunction,
}

const defaultAuthContext: AuthContextType = {
  loggedIn: false,
  credentials: null
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);