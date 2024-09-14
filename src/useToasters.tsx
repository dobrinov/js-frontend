import { useContext } from "react";
import { ToastersContext } from "./ToastersProvider";

export function useToasters() {
  const context = useContext(ToastersContext);

  if (!context) {
    throw new Error("useToasters must be used within a ToastersProvider");
  }

  return context;
}
