import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { PageLayout } from "./Layout";
import { Loading } from "./Loading";
import { ViewerQuery, ViewerQueryVariables } from "./graphql/types";

const VIEWER_QUERY = gql`
  query ViewerQuery {
    viewer {
      id
      name
      role
    }
  }
` as TypedDocumentNode<ViewerQuery, ViewerQueryVariables>;

export function Home() {
  const { data, loading, error } = useQuery(VIEWER_QUERY);

  if (loading) return <Loading />;
  if (error) return <div>Error</div>;
  if (!data) return <div>No data</div>;

  return <PageLayout title="Home">Welcome, {data.viewer.name}!</PageLayout>;
}
