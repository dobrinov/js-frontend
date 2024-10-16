import {
  gql,
  TypedDocumentNode,
  useApolloClient,
  useQuery,
} from "@apollo/client";
import { createContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { ViewerQuery, ViewerQueryVariables } from "./graphql/types";
import { Loading } from "./Loading";
import { useToken } from "./useToken";

const IMPERSONATION_ERROR_SCHEMA = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});

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
  impersonate: (args: {
    userId: string;
    onSuccess: () => void;
    onError: (error: string) => void;
  }) => Promise<void>;
  unimpersonate: (args: {
    onSuccess: () => void;
    onError: (error: string) => void;
  }) => Promise<void>;
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

  function impersonate({
    userId,
    onSuccess,
    onError,
  }: {
    userId: string;
    onSuccess: () => void;
    onError: (error: string) => void;
  }) {
    return fetch("http://localhost:8080/impersonate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => {
        if (response.status === 400) {
          sessionStorage.removeItem(SHADOWED_SESSION_KEY);
          response.json().then((value) => {
            const result = IMPERSONATION_ERROR_SCHEMA.parse(value);
            for (const error of result.errors) onError(error.message);
          });
        } else if (response.status === 401) {
          sessionStorage.removeItem(SHADOWED_SESSION_KEY);
          window.location.assign("/");
        } else if (response.status === 200) {
          response.text().then((value) => {
            token.setToken({ value, reactive: false });
            sessionStorage.setItem(SHADOWED_SESSION_KEY, "true");
            onSuccess();
          });
        } else {
          sessionStorage.removeItem(SHADOWED_SESSION_KEY);
          onError("Something went wrong");
        }
      })
      .catch(() => {
        sessionStorage.removeItem("shadowedSession");
        onError("Something went wrong");
      });
  }

  function unimpersonate({
    onSuccess,
    onError,
  }: {
    onSuccess: () => void;
    onError: (error: string) => void;
  }) {
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
          token.setToken({ value, reactive: false });
          sessionStorage.removeItem(SHADOWED_SESSION_KEY);
          onSuccess();
        });
      } else {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem(SHADOWED_SESSION_KEY);
        onError("Something went wrong");
      }
    });
  }

  return (
    <ViewerContext
      token={token.value}
      isImpersonatedSession={isImpersonatedSession}
      impersonate={impersonate}
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
  impersonate,
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
    impersonate,
    unimpersonate,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
