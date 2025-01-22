const formLogin = document.getElementById("formLogin");
formLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("password").value;
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        errorEmail.textContent = "Identifiants incorrects";
        errorPassword.textContent = "Identifiants incorrects";
      }
      return response.json();
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      }
    });
});
