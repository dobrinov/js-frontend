import { UserRole } from "./graphql/types";
import { useSession } from "./hooks/useSession";

export function LandingDestination() {
  const {
    viewer: { role },
  } = useSession();

  if (role === UserRole.ADMIN) {
    window.location.assign("/admin");
  } else if (role === UserRole.BASIC) {
    window.location.assign("/");
  } else {
    throw new Error("Unsupported scenario");
  }

  return null;
}
