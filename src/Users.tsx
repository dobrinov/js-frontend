import { gql, TypedDocumentNode, useMutation, useQuery } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./Button";
import { DangerousModal } from "./DangerousModal";
import { EmailInput, PasswordInput, TextInput } from "./form";
import { UsersQuery, UsersQueryVariables } from "./graphql/types";
import { PageLayout } from "./Layout";
import { Loading } from "./Loading";
import {
  CloseModalAction,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SubmitModalAction,
} from "./Modal";
import { useModal } from "./useModal";
import { useToasters } from "./useToasters";
import { useToken } from "./useToken";

const USERS_QUERY = gql`
  query UsersQuery {
    viewer {
      id
    }
    users {
      edges {
        node {
          id
          name
          email
          suspendedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
` as TypedDocumentNode<UsersQuery, UsersQueryVariables>;

const SUSPEND_USER_MUTATION = gql`
  mutation SuspendUserMutation($userId: ID!) {
    suspendUser(userId: $userId) {
      user {
        id
        suspendedAt
      }
    }
  }
`;

const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUserMutation($userId: ID!) {
    activateUser(userId: $userId) {
      user {
        id
        suspendedAt
      }
    }
  }
`;

const IMPERSONATION_ERROR_SCHEMA = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});

export function Users() {
  const { showToaster } = useToasters();
  const { showModal } = useModal();
  const token = useToken();
  const { data, loading, error } = useQuery(USERS_QUERY);
  const [suspendUser] = useMutation(SUSPEND_USER_MUTATION);
  const [activateUser] = useMutation(ACTIVATE_USER_MUTATION);

  if (loading) return <Loading />;
  if (!data || error) throw new Error("Failed to load users");

  const users = data.users.edges.map((edge) => edge.node);

  return (
    <PageLayout title="Users">
      <div>
        <Button
          style="primary"
          text="Create user"
          onClick={() => showModal(<CreateUserModal />)}
        />
      </div>
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
              <td className="space-x-2 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {data.viewer.id !== user.id && (
                  <>
                    <Button
                      text="Impersonate"
                      disabled={
                        user.suspendedAt !== null
                          ? "Cannot impersonate suspended user"
                          : false
                      }
                      onClick={() => {
                        fetch("http://localhost:8080/impersonate", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token.value}`,
                          },
                          body: JSON.stringify({ userId: user.id }),
                        }).then((response) => {
                          if (response.status === 400) {
                            response.json().then((value) => {
                              const result =
                                IMPERSONATION_ERROR_SCHEMA.parse(value);

                              for (const error of result.errors) {
                                showToaster({
                                  type: "error",
                                  title: "Impersonation failed",
                                  message: error.message,
                                });
                              }
                            });
                          } else if (response.status === 401) {
                            sessionStorage.removeItem("token");
                            window.location.assign("/");
                          } else if (response.status === 200) {
                            response.text().then((value) => {
                              token.setToken(value);
                              sessionStorage.setItem("shadowedSession", "true");
                              window.location.assign("/");
                            });
                          } else {
                            showToaster({
                              type: "error",
                              title: "Impersonation failed",
                              message: "Oops! Something went wrong.",
                            });
                          }
                        });
                      }}
                    />
                    {user.suspendedAt ? (
                      <Button
                        text="Activate"
                        onClick={() => {
                          activateUser({ variables: { userId: user.id } }).then(
                            () => {
                              showToaster({
                                type: "success",
                                title: "User activated",
                                message: `User ${user.name} was successfuly activated.`,
                              });
                            },
                          );
                        }}
                      />
                    ) : (
                      <Button
                        text="Suspend"
                        style="dangerous"
                        onClick={() => {
                          showModal(
                            <DangerousModal
                              title="Suspend user?"
                              description={`Are you sure that you want to suspend user ${user.name}?`}
                              onConfirm={() => {
                                return suspendUser({
                                  variables: { userId: user.id },
                                }).then(() => {
                                  showToaster({
                                    type: "success",
                                    title: "User suspended",
                                    message: `User ${user.name} was successfuly suspended.`,
                                  });
                                });
                              }}
                            />,
                          );
                        }}
                      />
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}

type Inputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

function CreateUserModal() {
  const form = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ModalHeader title="Create user" />
      <ModalBody>
        <fieldset className="space-y-3">
          <TextInput label="Name" field="name" form={form} required />
          <EmailInput label="Email" field="email" form={form} required />
          <PasswordInput
            label="Password"
            field="password"
            form={form}
            required
          />
          <PasswordInput
            label="Password confirmation"
            field="passwordConfirmation"
            form={form}
            required
            validate={(value, data) =>
              data.password === value ||
              "Password confirmation must match password"
            }
          />
        </fieldset>
      </ModalBody>
      <ModalFooter>
        <SubmitModalAction text="Click me" />
        <CloseModalAction />
      </ModalFooter>
    </form>
  );
}
