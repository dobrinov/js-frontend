import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "./useToken";

export function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const token = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token.value) navigate("/", { replace: true });
  }, [navigate, token.value]);

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    fetch("http://localhost:8080/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((response) => {
      if (response.status === 401) {
        setError("Invalid email or password");
        sessionStorage.removeItem("token");
      } else if (response.status === 200) {
        setError(null);
        response.text().then((value) => {
          token.setToken(value);
          navigate("/", { replace: true });
        });
      } else {
        setError("Something went wrong");
        sessionStorage.removeItem("token");
      }
    });
  }

  return (
    <form onSubmit={submit}>
      {error && <div>{error}</div>}

      <div>
        <label>Email</label>
        <input ref={emailRef} type="email" />
      </div>

      <div>
        <label>Password</label>
        <input ref={passwordRef} type="password" />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
