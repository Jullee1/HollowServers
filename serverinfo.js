const expires = localStorage.getItem("loginExpires");

if (
  localStorage.getItem("loggedIn") !== "true" ||
  !expires ||
  Date.now() > parseInt(expires)
) {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loginExpires");
  window.location.href = "index.html";
}

// Back to dashboard
function goHome() {
  window.location.href = "dashboard.html";
}

function showTab(region) {
  const allTabs = document.querySelectorAll(".tab-content");
  const allButtons = document.querySelectorAll(".tab-btn");

  allTabs.forEach(tab => tab.style.display = "none");
  allButtons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(`${region}-tab`).style.display = "flex";
  document.querySelector(`.tab-btn[onclick*="${region}"]`).classList.add("active");
}

window.onload = () => {
  showTab('us');
  fetchPlayerCounts(); // initial load
  setInterval(fetchPlayerCounts, 120000); // refresh every 120 seconds
};

async function fetchPlayerCounts() {
  const countElements = document.querySelectorAll(".player-count");

  for (const el of countElements) {
    const serverId = el.dataset.bmId;
    if (!serverId) continue;

    try {
      const res = await fetch(`https://api.battlemetrics.com/servers/${serverId}`);
      if (!res.ok) throw new Error(`Server ${serverId} not found`);
      const data = await res.json();

      const { players, maxPlayers, ip, port } = data?.data?.attributes || {};
      el.textContent = `Online: ${players} / ${maxPlayers}`;
      el.style.color = "#93ff95";

      const ipElement = el.parentElement.querySelector('.ip-address');
      if (ipElement) {
        if (ip && port) {
          ipElement.innerHTML = `IP: <span class="copy-ip" title="Click to copy connect ${ip}:${port}" data-connect="connect ${ip}:${port}" style="color: #bbb; cursor: pointer; text-decoration: underline;">${ip}:${port}</span>`;
        } else {
          ipElement.textContent = "IP: Unavailable";
          ipElement.style.color = "#ff6666";
        }
      }
    } catch (err) {
      console.error(`Failed to fetch data for server ${serverId}`, err);
      el.textContent = "Online: Unavailable";
      el.style.color = "#ff6666";

      const ipElement = el.parentElement.querySelector('.ip-address');
      if (ipElement) {
        ipElement.textContent = "IP: Unavailable";
        ipElement.style.color = "#ff6666";
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300)); // Wait 300ms between requests
  }
}

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

document.addEventListener('click', function (e) {
  // ✅ Handle clicking the IP to copy "connect <ip>:<port>"
  if (e.target.classList.contains('copy-ip')) {
    e.stopPropagation(); // prevent card click if needed
    const command = e.target.dataset.connect;

    navigator.clipboard.writeText(command)
      .then(() => {
        const originalText = e.target.textContent;
        e.target.textContent = "Copied!";
        setTimeout(() => {
          e.target.textContent = originalText;
        }, 1000);
      })
      .catch(err => console.error("Clipboard copy failed:", err));
    return;
  }

  // ✅ Handle shift+click on server card to capture
  const card = e.target.closest('.server-card');
  if (card && e.shiftKey) {
    captureCard(card);
  }
});

// Highlight servers that wipe today
document.querySelectorAll(".server-card").forEach(card => {
  const wipeInfo = card.querySelector(".wipe-info");
  if (!wipeInfo) return;

  const wipeDays = wipeInfo.dataset.wipe?.toLowerCase();
  if (!wipeDays) return;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  if (wipeDays.includes(today)) {
    if (!card.querySelector(".wipe-today-badge")) {
      const badge = document.createElement("div");
      badge.className = "wipe-today-badge";
      badge.textContent = "WIPE TODAY";
      card.appendChild(badge);
    }
  }
});
