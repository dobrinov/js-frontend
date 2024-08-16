import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { Button } from "./Button";

export function ErrorPage() {
  const error = useRouteError();

  return isRouteErrorResponse(error) ? (
    <Page
      code={404}
      title="Page not found"
      description="The page that you are looking for cannot be found."
    />
  ) : (
    <Page
      code={500}
      title="Oops! Something went wrong."
      description="The previous action did not finish successfully."
    />
  );
}

function Page({
  code,
  title,
  description,
}: {
  code: number;
  title: string;
  description: string;
}) {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">{code}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">{description}</p>
      </div>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button
          text="Go back home"
          style="primary"
          onClick={() => navigate("/redirect")}
        />
      </div>
    </main>
  );
}
