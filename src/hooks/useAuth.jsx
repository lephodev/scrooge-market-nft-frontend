import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  login: () => {}
});

export default AuthContext;