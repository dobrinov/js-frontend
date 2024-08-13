const token = await fetch("http://localhost:8080/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@example.com", password: "1" }),
}).then((response) => response.text());

console.log(token);
