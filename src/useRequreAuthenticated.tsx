import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "./useToken";

export function useRequireAuthenticated() {
  const { value } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!value) navigate("/sign-in", { replace: true });
  }, [navigate, value]);
}
