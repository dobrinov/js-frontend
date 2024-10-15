import { useReducer } from "react";

export function useToken() {
  const key = "token";
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return {
    value: sessionStorage.getItem(key),
    setToken: ({
      value,
      reactive = true,
    }: {
      value: string;
      reactive?: boolean;
    }) => {
      sessionStorage.setItem(key, value);
      reactive && forceUpdate();
    },
    clear: (reactive?: boolean) => {
      sessionStorage.removeItem(key);
      (reactive === undefined || reactive) && forceUpdate();
    },
  };
}
