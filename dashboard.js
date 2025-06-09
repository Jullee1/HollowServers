if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

function goTo(tab) {
  alert("Navigating to: " + tab);
  // Exempel för riktig navigering:
  // window.location.href = `${tab}.html`;
}
