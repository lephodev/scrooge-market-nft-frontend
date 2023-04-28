import { createContext } from "react";
const AuthContext = createContext({
  user: null,
  setUser: (user: any) => {},
  logout: () => {},
  login: () => {},
  loading: false,
  setLoading: (loading: boolean) => {},
  dateTimeNow:''
});

export default AuthContext;