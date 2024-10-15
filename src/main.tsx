import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Components } from "./Components";
import { ErrorPage } from "./ErrorPage";
import { Home } from "./Home";
import "./index.css";
import { LandingDestination } from "./LandingDestination";
import { AdminShell, ApplicationShell } from "./Layout";
import { ModalProvider } from "./Modal";
import { SessionContextProvider } from "./SessionContextProvider";
import { SignIn } from "./SignIn";
import { ToastersProvider } from "./ToastersProvider";
import { Users } from "./Users";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/graph",
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError && "statusCode" in networkError) {
    const { statusCode } = networkError;

    if (statusCode === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            keyArgs: false,
            merge(existing, incoming) {
              // Merge relay connection
              if (!existing) return incoming;
              return {
                ...incoming,
                edges: [...existing.edges, ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
});

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: (
          <ToastersProvider>
            <ModalProvider>
              <Outlet />
            </ModalProvider>
          </ToastersProvider>
        ),
        children: [
          {
            path: "/sign-in",
            element: <SignIn />,
          },
          {
            element: (
              <SessionContextProvider>
                <Outlet />
              </SessionContextProvider>
            ),
            children: [
              {
                path: "/",
                element: <LandingDestination />,
              },
              {
                path: "/admin",
                element: (
                  <AdminShell>
                    <Outlet />
                  </AdminShell>
                ),
                children: [
                  { index: true, element: <Users /> },
                  { path: "users", element: <Users /> },
                ],
              },
              {
                element: (
                  <ApplicationShell>
                    <Outlet />
                  </ApplicationShell>
                ),
                children: [
                  {
                    path: "/home",
                    element: <Home />,
                  },
                  {
                    path: "/components",
                    element: <Components />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>,
);
