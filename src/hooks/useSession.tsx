import { useContext } from "react";
import { SessionContext, SessionContextType } from "../SessionContextProvider";

export function useSession(): SessionContextType {
  const value = useContext(SessionContext);

  if (!value)
    throw new Error("useSession must be used within a SessionContextProvider");

  return value;
}
