import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Components } from "./Components";
import { UserRole } from "./graphql/types";
import { Home } from "./Home";
import "./index.css";
import { AdminShell, ApplicationShell } from "./Layout";
import { Loading } from "./Loading";
import { ViewerQuery } from "./operations/ViewerQuery.generated";
import { SignIn } from "./SignIn";
import { useRequireAuthenticated } from "./useRequreAuthenticated";

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
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/redirect",
    element: <LandingDestination />,
  },
  {
    path: "/admin",
    element: (
      <AdminShell>
        <Outlet />
      </AdminShell>
    ),
    children: [{ index: true, element: <div>Admin home</div> }],
  },
  {
    element: (
      <ApplicationShell>
        <Outlet />
      </ApplicationShell>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/components",
        element: <Components />,
      },
    ],
  },
]);

function LandingDestination() {
  useRequireAuthenticated();

  const { data, loading, error } = useQuery(ViewerQuery);

  if (loading) return <Loading />;
  if (!data || error) throw new Error("Cannot load viewer");

  const role = data.viewer.role;

  if (role === UserRole.ADMIN) {
    window.location.assign("/admin");
  } else if (role === UserRole.BASIC) {
    window.location.assign("/");
  } else {
    throw new Error("Unsupported scenario");
  }

  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>,
);
