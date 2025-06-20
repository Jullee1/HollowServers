const expires = localStorage.getItem("loginExpires");

if (
  localStorage.getItem("loggedIn") !== "true" ||
  !expires ||
  Date.now() > parseInt(expires)
) {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loginExpires");
  window.location.href = "../index.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loginExpires");
  window.location.href = "../index.html";
}

function goTo(tab) {
  alert("Navigating to: " + tab);
  // Example for real navigation:
  // window.location.href = `${tab}.html`;
}
