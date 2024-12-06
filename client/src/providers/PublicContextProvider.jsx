import { createContext, useContext, useState } from "react";
import { getUserCookies } from "../utils/methods";

const PublicContext = createContext();

export const usePublicContext = () => {
  return useContext(PublicContext);
};

export default function ReactPublicContextProvider({ children }) {
  const userData = getUserCookies();
  const [isLoading, setIsLoading] = useState();
  const [isLog, setIsLog] = useState(userData);

  return (
    <PublicContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isLog,
        setIsLog,
      }}
    >
      {children}
    </PublicContext.Provider>
  );
}
