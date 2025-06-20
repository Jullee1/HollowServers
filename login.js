const expectedUsernameHash = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // admin
const expectedPasswordHash = "7793a896c7d546264c1e561854ff40e69243dda707df3aad377a793a7e6f947e"; // hollowservers00

async function sha256(input) {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function login(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  const usernameHash = await sha256(usernameInput);
  const passwordHash = await sha256(passwordInput);

  if (usernameHash === expectedUsernameHash && passwordHash === expectedPasswordHash) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("loginExpires", (Date.now() + 2 * 60 * 60 * 1000).toString());
    window.location.href = "Dashboard/dashboard.html";
  } else {
    errorMessage.textContent = "Wrong Password, please contact Administrator";
    errorMessage.style.color = "lightred";
    errorMessage.style.marginTop = "25px";
  }
}