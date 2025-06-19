const auth = firebase.auth();

function login(event) {
  event.preventDefault();

  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      localStorage.setItem("loggedIn", "true");

      const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
      localStorage.setItem("loginExpires", expiresAt.toString());

      window.location.href = "dashboard.html";
    })
    .catch(error => {
      errorMessage.style.color = "var(--error)";
      
      let message = "Login failed: Invalid credentials";

      if (error.code === "auth/user-not-found") {
        message = "Login failed: No such user";
      } else if (error.code === "auth/wrong-password") {
        message = "Login failed: Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        message = "Login failed: Invalid email format";
      }

      errorMessage.textContent = message;
      console.error(error.code, error.message);
    });
}
