import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { ExampleQuery, ExampleQueryVariables } from "./graphql/types";
import { useRequireAuthenticated } from "./useRequreAuthenticated";
import { useToken } from "./useToken";

const EXAMPLE_QUERY = gql`
  query ExampleQuery {
    viewer {
      id
      name
    }
  }
` as TypedDocumentNode<ExampleQuery, ExampleQueryVariables>;

export function Home() {
  const token = useToken();
  useRequireAuthenticated();
  const { data, loading, error } = useQuery(EXAMPLE_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h1>Welcome, {data.viewer.name}</h1>
      <button type="button" onClick={() => token.clear()}>
        Logout
      </button>
    </div>
  );
}
