import { useReducer, createContext, useContext } from "react";
import { reducerFunc } from "./Reducer";


export const GlobalContext = createContext(null);
// This is the context wrapper component which will be wrapped around the index.js file
export const ContextWrapper = ({ children }) => {
   let data = {
      user: {},
      isLogin: true,
   }
   const [state, dispatch] = useReducer(reducerFunc, data)
   return (
      <GlobalContext.Provider value={{ state, dispatch }}>
         {children}
      </GlobalContext.Provider>
   )
}