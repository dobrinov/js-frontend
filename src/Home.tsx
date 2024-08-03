import { gql, useQuery } from "@apollo/client";
import { useRequireAuthenticated } from "./useRequreAuthenticated";
import { useToken } from "./useToken";

const EXAMPLE_QUERY = gql`
  query ExampleQuery {
    viewer {
      id
      name
    }
  }
`;

export function Home() {
  const token = useToken();
  useRequireAuthenticated();
  const { data, loading, error } = useQuery(EXAMPLE_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error</div>;

  return (
    <div>
      <h1>Welcome, {data.viewer.name}</h1>
      <button type="button" onClick={() => token.clear()}>
        Logout
      </button>
    </div>
  );
}
