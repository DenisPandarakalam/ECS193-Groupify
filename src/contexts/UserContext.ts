import { createContext } from 'react';

interface UserContextType extends SpotifyApi.UserObjectPrivate {

}

const defaultUserContext: UserContextType = {
  birthdate: '',
  country: '',
  email: '',
  product: '',
  external_urls: undefined,
  href: '',
  id: '',
  type: 'user',
  uri: ''
}

export const UserContext = createContext<UserContextType>(defaultUserContext);