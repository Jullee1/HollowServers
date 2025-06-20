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

// Back to dashboard
function goHome() {
  window.location.href = "../Dashboard/dashboard.html";
}