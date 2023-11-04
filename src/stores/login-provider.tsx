import { NextPage } from 'next';
import { createContext, useState } from 'react';


type Props = {
  children: React.ReactNode
}

type AppContextState = {
  email: string
  fullname: string
  isActive: boolean
  noHp: string
  photoId: number
  photoUrl: string
  userId: number
  userType: string
  username: string
}

type LoginContextType = {
  login: AppContextState,
  setLogin: (AppContextState) => void,
}

const LoginContext = createContext<LoginContextType>({
  login: null,
  setLogin: (state: AppContextState) => { },
});

export const LoginContextProvider: NextPage<Props> = ({ children }) => {

  const [login, setLogin] = useState<AppContextState>(null);

  const context = {
    login,
    setLogin,
  };

  return (
    <LoginContext.Provider value={context}>
      {children}
    </LoginContext.Provider>
  );
};


export default LoginContext;