import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ApplicationBanner } from "./ApplicationBanner";
import { Button } from "./Button";
import { ErrorPage } from "./ErrorPage";
import { ViewerQuery, ViewerQueryVariables } from "./graphql/types";
import { Loading } from "./Loading";
import { useRequireAuthenticated } from "./useRequreAuthenticated";
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

export function AdminShell({ children }: { children: ReactNode }) {
  const token = useToken();
  const navigate = useNavigate();
  useRequireAuthenticated();
  const { data, loading, error } = useQuery(VIEWER_QUERY);

  function logout() {
    sessionStorage.removeItem("shadowedSession");
    token.clear();
  }

  const navigation = [{ name: "Users", href: "/admin/users" }];

  if (loading) return <Loading />;
  if (error || !data) return <ErrorPage />;
  if (data.viewer.role !== "ADMIN") navigate("/redirect");

  return (
    <div className="flex h-full min-w-96 flex-col">
      <Disclosure as="nav" className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button text="Sign out" onClick={logout} />
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                  )
                }
              >
                <DisclosureButton
                  as="div"
                  className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                >
                  {item.name}
                </DisclosureButton>
              </NavLink>
            ))}
            <DisclosureButton
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Sign out
            </DisclosureButton>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="h-full flex-grow overflow-auto py-4">{children}</div>
    </div>
  );
}

export function ApplicationShell({ children }: { children: ReactNode }) {
  const token = useToken();
  const navigate = useNavigate();
  useRequireAuthenticated();
  const { data, loading, error } = useQuery(VIEWER_QUERY);

  function logout() {
    sessionStorage.removeItem("shadowedSession");
    token.clear();
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Components", href: "/components" },
  ];

  if (loading) return <Loading />;
  if (error || !data) return <ErrorPage />;
  if (data.viewer.role === "ADMIN") navigate("/redirect");

  return (
    <div className="flex h-full min-w-96 flex-col">
      {sessionStorage.getItem("shadowedSession") === "true" && (
        <ApplicationBanner
          text="Impersonation session"
          onClick={() => {
            fetch("http://localhost:8080/unimpersonate", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
              },
            }).then((response) => {
              if (response.status === 401) {
                sessionStorage.removeItem("token");
              } else if (response.status === 200) {
                response.text().then((value) => {
                  token.setToken(value);
                  sessionStorage.removeItem("shadowedSession");
                  window.location.assign("/admin");
                });
              } else {
                sessionStorage.removeItem("token");
              }
            });
          }}
        />
      )}
      <Disclosure as="nav" className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button text="Sign out" onClick={logout} />
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                  )
                }
              >
                <DisclosureButton
                  as="div"
                  className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                >
                  {item.name}
                </DisclosureButton>
              </NavLink>
            ))}
            <DisclosureButton
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Sign out
            </DisclosureButton>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="flex-grow overflow-auto py-4">{children}</div>
    </div>
  );
}

export function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <div className="mx-auto flex max-w-7xl items-center px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {title}
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
