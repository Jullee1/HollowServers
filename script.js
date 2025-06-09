function login(event) {
  event.preventDefault(); // Prevent form reload

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  if (username === "administrator" && password === "hollowservers") {
    localStorage.setItem("loggedIn", "true");

    window.location.href = "dashboard.html";
  } else {
    errorMessage.style.color = "var(--error)";
    errorMessage.textContent = "Invalid username or password.";
  }
}
