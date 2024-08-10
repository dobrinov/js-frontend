import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { ExampleQuery, ExampleQueryVariables } from "./graphql/types";
import { PageLayout } from "./Layout";
import { Loading } from "./Loading";

const EXAMPLE_QUERY = gql`
  query ExampleQuery {
    viewer {
      id
      name
    }
  }
` as TypedDocumentNode<ExampleQuery, ExampleQueryVariables>;

export function Home() {
  const { data, loading, error } = useQuery(EXAMPLE_QUERY);

  if (loading) return <Loading />;
  if (error) return <div>Error</div>;
  if (!data) return <div>No data</div>;

  return <PageLayout title="Home">Welcome, {data.viewer.name}!</PageLayout>;
}
