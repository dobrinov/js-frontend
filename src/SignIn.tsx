import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";
import { SubmitButton } from "./Button";
import { EmailInput, PasswordInput } from "./form";
import { useToken } from "./useToken";

type Inputs = {
  email: string;
  password: string;
};

export function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const token = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token.value) navigate("/home", { replace: true });
  }, [navigate, token.value]);

  const form = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const email = data.email.trim();
    const password = data.password.trim();

    fetch("http://localhost:8080/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((response) => {
      if (response.status === 401) {
        response.text().then((error) => {
          setError(error);
          sessionStorage.removeItem("token");
        });
      } else if (response.status === 200) {
        setError(null);
        response.text().then((value) => {
          token.setToken({ value });
          navigate("/", { replace: true });
        });
      } else {
        setError("Something went wrong");
        sessionStorage.removeItem("token");
      }
    });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {error && <Alert text={error} className="mb-5" />}
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <EmailInput label="Email" field="email" form={form} required />
              <PasswordInput
                label="Password"
                field="password"
                form={form}
                required
              />
              <div className="flex flex-row-reverse">
                <SubmitButton text="Sign in" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
