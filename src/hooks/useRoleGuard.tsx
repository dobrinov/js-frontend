import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../graphql/types";
import { useSession } from "./useSession";

export function useRoleGuard({ allowedRole }: { allowedRole: UserRole }) {
  const {
    viewer: { role },
  } = useSession();

  const navigate = useNavigate();

  useEffect(() => {
    if (role !== allowedRole) navigate("/");
  }, [role, allowedRole, navigate]);
}
