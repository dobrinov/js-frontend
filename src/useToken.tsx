import { useReducer } from "react";

export function useToken() {
  const key = "token";
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return {
    value: sessionStorage.getItem(key),
    setToken: (token: string) => {
      sessionStorage.setItem(key, token);
      forceUpdate();
    },
    clear: () => {
      sessionStorage.removeItem(key);
      forceUpdate();
    },
  };
}
