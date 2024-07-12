import { createContext } from "react";
const AuthContext = createContext({
  spendedAmount: null,
  setSpendedAmount: (amount: any) => {},
  user: null,
  setUser: (user: any) => {},
  logout: () => {},
  login: () => {},
  loading: false,
  setLoading: (loading: boolean) => {},
  dateTimeNow: "",
  mode:"",
  setMode:(user: any) => {},

});

export default AuthContext;
