import { useRequireAuthenticated } from "./useRequreAuthenticated";
import { useToken } from "./useToken";

export function Home() {
  const token = useToken();
  useRequireAuthenticated();

  return (
    <div>
      <h1>Home</h1>
      <button type="button" onClick={() => token.clear()}>
        Logout
      </button>
    </div>
  );
}
