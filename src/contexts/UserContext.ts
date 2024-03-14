import { createContext } from 'react';

interface UserContextType {
  user: SpotifyApi.UserObjectPrivate,
  setUser?: React.Dispatch<React.SetStateAction<{}>>,
}

const defaultUserContext: UserContextType = {
  user: {
    birthdate: '',
    country: '',
    email: '',
    product: '',
    external_urls: undefined,
    href: '',
    id: '',
    type: 'user',
    uri: ''
  },
  
}

export const UserContext = createContext<UserContextType>(defaultUserContext);