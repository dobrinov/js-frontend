import { gql, TypedDocumentNode, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { DangerousModal } from "./DangerousModal";
import { EmailInput, PasswordInput, SelectInput, TextInput } from "./form";
import {
  ActivateUserMutation,
  ActivateUserMutationVariables,
  CreateUserMutation,
  CreateUserMutationVariables,
  SuspendUserMutation,
  SuspendUserMutationVariables,
  User,
  UserRole,
  UsersQuery,
  UsersQueryVariables,
} from "./graphql/types";
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
  query UsersQuery($after: String) {
    viewer {
      id
    }
    users(first: 10, after: $after) {
      edges {
        node {
          id
          name
          email
          role
          suspendedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
` as TypedDocumentNode<UsersQuery, UsersQueryVariables>;

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      ... on SuccessfulCreateUserPayload {
        user {
          id
          name
          email
        }
      }

      ... on FailedMutationWithFields {
        fieldFailures {
          field
          message
        }
        failureMessage
      }
    }
  }
` as TypedDocumentNode<CreateUserMutation, CreateUserMutationVariables>;

const SUSPEND_USER_MUTATION = gql`
  mutation SuspendUserMutation($userId: ID!) {
    suspendUser(userId: $userId) {
      user {
        id
        suspendedAt
      }
    }
  }
` as TypedDocumentNode<SuspendUserMutation, SuspendUserMutationVariables>;

const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUserMutation($userId: ID!) {
    activateUser(userId: $userId) {
      user {
        id
        suspendedAt
      }
    }
  }
` as TypedDocumentNode<ActivateUserMutation, ActivateUserMutationVariables>;

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
  const { data, loading, error, fetchMore } = useQuery(USERS_QUERY);
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
              Role
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
                {userRoleToLabel(user.role)}
              </td>
              <td className="space-x-2 whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
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
                            window.location.assign("/home");
                          } else if (response.status === 200) {
                            response.text().then((value) => {
                              token.setToken(value);
                              sessionStorage.setItem("shadowedSession", "true");
                              window.location.assign("/home");
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
      <div className="mt-5 text-center text-gray-400">
        Showing {data.users.edges.length} of {data.users.totalCount}
      </div>
      {data.users.pageInfo.hasNextPage && (
        <div className="mt-5 flex justify-center">
          <Button
            text="Load more"
            loading={loading}
            onClick={() => {
              fetchMore({
                variables: { after: data.users.pageInfo.endCursor },
              });
            }}
          />
        </div>
      )}
    </PageLayout>
  );
}

type Inputs = {
  role: User["role"];
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

function CreateUserModal() {
  const { hideModal } = useModal();
  const { showToaster } = useToasters();
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const form = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    createUser({
      variables: { input: data },
      update: (cache, result) => {
        if (
          result.data?.createUser?.__typename === "SuccessfulCreateUserPayload"
        ) {
          cache.evict({ fieldName: "users" });
        }
      },
    })
      .then((response) => {
        if (!response.data || !response.data.createUser) {
          setFailure("Oops something went wrong");
          return;
        } else if (
          response.data.createUser.__typename === "FailedMutationWithFields"
        ) {
          setFailure(response.data.createUser.failureMessage);
          return;
        } else if (
          response.data.createUser.__typename === "SuccessfulCreateUserPayload"
        ) {
          showToaster({
            type: "success",
            title: "User created",
            message: `User "${response.data.createUser.user.name}" was successfuly created.`,
          });

          hideModal();
        } else {
          throw new Error(`Unexpected response ${data}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setFailure("Oops something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ModalHeader title="Create user" />
      <ModalBody>
        {failure && <Alert text={failure} className="mb-5" />}
        <fieldset className="space-y-3">
          <SelectInput
            label="Role"
            field="role"
            form={form}
            options={[
              { id: UserRole.BASIC, label: "Basic" },
              { id: UserRole.ADMIN, label: "Admin" },
            ]}
            required
          />
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
        <SubmitModalAction text="Create" loading={loading} />
        <CloseModalAction />
      </ModalFooter>
    </form>
  );
}

function userRoleToLabel(role: UserRole) {
  if (role === UserRole.ADMIN) {
    return "Admin";
  } else {
    return "Basic";
  }
}
