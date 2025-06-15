function login(event) {
  event.preventDefault(); // Prevent form reload

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  if (username === "administrator" && password === "hollowservers") {
    localStorage.setItem("loggedIn", "true");

    // Set expiration to 2 hours from now
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
    localStorage.setItem("loginExpires", expiresAt.toString());

    window.location.href = "dashboard.html";
  } else {
    errorMessage.style.color = "var(--error)";
    errorMessage.textContent = "Invalid username or password.";
  }
}
