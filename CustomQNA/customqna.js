const expires = localStorage.getItem("loginExpires");

if (
  localStorage.getItem("loggedIn") !== "true" ||
  !expires ||
  Date.now() > parseInt(expires)
) {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loginExpires");
  window.location.href = "../login.html";
}

// Back to dashboard
function goHome() {
  window.location.href = "../Dashboard/dashboard.html";
}

const faqList = document.getElementById('faq-list');
const addFaqForm = document.getElementById('add-faq-form');
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');
const searchInput = document.getElementById('search-input');

let faqData = [];

function saveFaqs() {
  localStorage.setItem('faqData', JSON.stringify(faqData));
}

function createFaqItem(question, answer, index = faqData.length - 1) {
  const item = document.createElement('div');
  item.className = 'faq-item';

  const q = document.createElement('div');
  q.className = 'faq-question';
  q.textContent = question;

  const a = document.createElement('div');
  a.className = 'faq-answer';
  a.textContent = answer;

  const copyContainer = document.createElement('div');
  copyContainer.className = 'copy-container';

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = 'Copied!';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-button';
  copyBtn.innerHTML = '📋 Copy';
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(answer);
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 1500);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-button';
  deleteBtn.textContent = 'Delete';
  let confirmTimeout = null;
  let confirmState = false;

  deleteBtn.addEventListener('click', () => {
    if (!confirmState) {
      deleteBtn.textContent = 'U sure?';
      confirmState = true;
      confirmTimeout = setTimeout(() => {
        deleteBtn.textContent = 'Delete';
        confirmState = false;
      }, 4000);
    } else {
      clearTimeout(confirmTimeout);
      faqData.splice(index, 1);
      saveFaqs();
      renderFaqs();
    }
  });

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-button';
  editBtn.textContent = 'Edit';

  editBtn.addEventListener('click', () => {
    if (editBtn.textContent === 'Edit') {
      const qInput = document.createElement('input');
      qInput.type = 'text';
      qInput.value = question;
      qInput.className = 'edit-input';

      const aInput = document.createElement('textarea');
      aInput.value = answer;
      aInput.className = 'edit-input';

      item.replaceChild(qInput, q);
      item.replaceChild(aInput, a);
      editBtn.textContent = 'Save';
    } else {
      const qInput = item.querySelector('input.edit-input');
      const aInput = item.querySelector('textarea.edit-input');
      const newQuestion = qInput.value.trim();
      const newAnswer = aInput.value.trim();

      if (newQuestion && newAnswer) {
        faqData[index] = { question: newQuestion, answer: newAnswer };
        saveFaqs();
        renderFaqs();
      }
    }
  });

  copyContainer.appendChild(deleteBtn);
  copyContainer.appendChild(editBtn);
  copyContainer.appendChild(copyBtn);
  copyContainer.appendChild(tooltip);

  item.appendChild(q);
  item.appendChild(a);
  item.appendChild(copyContainer);

  faqList.appendChild(item);
}

function renderFaqs() {
  faqList.innerHTML = '';
  faqData.forEach((faq, index) => createFaqItem(faq.question, faq.answer, index));
}

function loadFaqs() {
  const stored = localStorage.getItem('faqData');
  if (stored) {
    faqData = JSON.parse(stored);
  }
  renderFaqs();
}

addFaqForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  if (question && answer) {
    faqData.push({ question, answer });
    saveFaqs();
    renderFaqs();
    questionInput.value = '';
    answerInput.value = '';
  }
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question').textContent.toLowerCase();
    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
    item.style.display = question.includes(query) || answer.includes(query) ? 'flex' : 'none';
  });
});

document.getElementById('export-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(faqData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'faq_backup.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-btn').addEventListener('click', () => {
  document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (!Array.isArray(imported)) return alert('Invalid file format.');
      const valid = imported.every(item => item && typeof item.question === 'string' && typeof item.answer === 'string');
      if (!valid) return alert('Invalid data.');
      faqData = [...imported];
      saveFaqs();
      renderFaqs();
    } catch (err) {
      alert('Error reading file.');
    }
  };
  reader.readAsText(file);
});

loadFaqs();
