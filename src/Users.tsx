import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { Button } from "./Button";
import { UsersQuery, UsersQueryVariables } from "./graphql/types";
import { PageLayout } from "./Layout";
import { Loading } from "./Loading";

const USERS_QUERY = gql`
  query UsersQuery {
    users {
      edges {
        node {
          id
          name
          email
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
` as TypedDocumentNode<UsersQuery, UsersQueryVariables>;

export function Users() {
  const { data, loading, error } = useQuery(USERS_QUERY);

  if (loading) return <Loading />;
  if (!data || error) throw new Error("Failed to load users");

  const users = data.users.edges.map((edge) => edge.node);

  return (
    <PageLayout title="Users">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {user.id}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {user.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <Button text="Impersonate" onClick={() => alert("todo")} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}
