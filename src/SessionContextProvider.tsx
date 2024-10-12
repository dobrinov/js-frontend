import {
  gql,
  TypedDocumentNode,
  useApolloClient,
  useQuery,
} from "@apollo/client";
import { createContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ViewerQuery, ViewerQueryVariables } from "./graphql/types";
import { Loading } from "./Loading";
import { useToken } from "./useToken";

const VIEWER_QUERY = gql`
  query ViewerQuery {
    viewer {
      id
      name
      role
    }
  }
` as TypedDocumentNode<ViewerQuery, ViewerQueryVariables>;

type ViewerContextType = {
  token: string;
  isImpersonatedSession: boolean;
  unimpersonate: () => Promise<void>;
  logout: () => void;
};

export type SessionContextType = {
  viewer: {
    id: string;
    name: string;
    role: ViewerQuery["viewer"]["role"];
  };
} & ViewerContextType;

const SHADOWED_SESSION_KEY = "shadowedSession";

export const SessionContext = createContext<SessionContextType | null>(null);

export function SessionContextProvider({ children }: { children: ReactNode }) {
  const token = useToken();
  const apollo = useApolloClient();

  if (!token.value) {
    if (!token.value) apollo.clearStore();
    return <Navigate to="/sign-in" />;
  }

  const isImpersonatedSession =
    sessionStorage.getItem(SHADOWED_SESSION_KEY) === "true";

  function logout() {
    token.clear();
    sessionStorage.removeItem(SHADOWED_SESSION_KEY);
  }

  function unimpersonate() {
    if (!isImpersonatedSession) return Promise.resolve();

    return fetch("http://localhost:8080/unimpersonate", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.text().then((value) => {
          token.setTokenNonReactive(value);
          sessionStorage.removeItem(SHADOWED_SESSION_KEY);
          window.location.assign("/admin");
        });
      } else {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem(SHADOWED_SESSION_KEY);
      }
    });
  }

  return (
    <ViewerContext
      token={token.value}
      isImpersonatedSession={isImpersonatedSession}
      unimpersonate={unimpersonate}
      logout={logout}
    >
      {children}
    </ViewerContext>
  );
}

function ViewerContext({
  token,
  isImpersonatedSession,
  unimpersonate,
  logout,
  children,
}: ViewerContextType & { children: ReactNode }) {
  const { data, loading, error } = useQuery(VIEWER_QUERY);

  if (loading) return <Loading />;
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Cannot fetch viewer");

  const { id, name, role } = data.viewer;

  const value = {
    viewer: { id, name, role },
    isImpersonatedSession,
    token,
    unimpersonate,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
