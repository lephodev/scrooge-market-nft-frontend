import { createContext } from "react";
type Dispatch<A> = (value: A) => void;
const AuthContext = createContext({
  user: null,
  setUser: (user: any) => {},
  logout: () => {},
  login: () => {},
  loading: false,
  setLoading: (loading: boolean) => {},
});

export default AuthContext;