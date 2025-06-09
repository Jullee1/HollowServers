// Redirect if not logged in
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

// Back to dashboard
function goHome() {
  window.location.href = "dashboard.html";
}

if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

function goHome() {
  window.location.href = "dashboard.html";
}

function showTab(region) {
  const allTabs = document.querySelectorAll(".tab-content");
  const allButtons = document.querySelectorAll(".tab-btn");

  allTabs.forEach(tab => {
    tab.style.display = "none";
  });

  allButtons.forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(`${region}-tab`).style.display = "flex";
  document.querySelector(`.tab-btn[onclick*="${region}"]`).classList.add("active");
}

window.onload = () => {
  showTab('us'); // Default tab
};

function captureCard(cardElement) {
  const clone = cardElement.cloneNode(true);
  const style = window.getComputedStyle(cardElement);

  clone.style.background = style.background;
  clone.style.boxShadow = style.boxShadow;
  clone.style.margin = '0';
  clone.style.position = 'relative';

  const wrapper = document.createElement('div');
  wrapper.style.padding = '10px'; // Extra yta runt kortet
  wrapper.style.background = 'transparent';
  wrapper.style.display = 'inline-block';
  wrapper.style.position = 'absolute';
  wrapper.style.top = '-9999px';
  wrapper.style.left = '-9999px';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  html2canvas(wrapper, {
    backgroundColor: null,
    scale: 2,
    scrollY: -window.scrollY,
    useCORS: true
  }).then(canvas => {
    document.body.removeChild(wrapper);

    canvas.toBlob(blob => {
      if (!blob) return;
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item])
        .then(() => {
          cardElement.classList.add('copied');
          setTimeout(() => cardElement.classList.remove('copied'), 1000);
        })
        .catch(err => {
          console.error('Clipboard error:', err);
        });
    });
  });
}

function captureTab(tabId) {
  const tabElement = document.getElementById(tabId);

  // Skapa en klon utan knappen
  const clone = tabElement.cloneNode(true);
  clone.querySelectorAll('.screenshot-all-btn-wrapper').forEach(btn => btn.remove());

  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.top = '-9999px';
  wrapper.style.left = '-9999px';
  wrapper.style.background = 'transparent';
  wrapper.style.padding = '20px';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  html2canvas(wrapper, {
    backgroundColor: null,
    scale: 2,
    scrollY: -window.scrollY,
    useCORS: true
  }).then(canvas => {
    document.body.removeChild(wrapper);

    canvas.toBlob(blob => {
      if (!blob) return;
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item])
        .catch(err => console.error('Clipboard error:', err));
    });
  });
}
