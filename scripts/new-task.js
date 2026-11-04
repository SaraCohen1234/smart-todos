const overlay = document.getElementById("overlay");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const titleCounter = document.getElementById("title-counter");
const extraFields = document.getElementById("extra-fields");
const moreToggle = document.getElementById("more-toggle");
const priorityScore = document.getElementById("priority-score");
const priorityDescription = document.getElementById("priority-description");
const toast = document.getElementById("toast");
const openModalButton = document.getElementById("open-modal");
let selectedImportance = "high";
let previousFocus = null;

const importanceScores = {
  low: { score: 30, label: "נמוכה" },
  normal: { score: 50, label: "רגילה" },
  high: { score: 72, label: "גבוהה" },
  urgent: { score: 92, label: "דחופה" }
};

function openModal() {
  previousFocus = document.activeElement;
  overlay.hidden = false;
  openModalButton.setAttribute("aria-expanded", "true");
  titleInput.focus();
}

function closeModal() {
  overlay.hidden = true;
  openModalButton.setAttribute("aria-expanded", "false");
  form.reset();
  selectedImportance = "high";
  updateImportance();
  extraFields.hidden = true;
  moreToggle.setAttribute("aria-expanded", "false");
  updateTitleCounter();
  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  } else {
    openModalButton.focus();
  }
}

function updateImportance() {
  document.querySelectorAll(".importance-option").forEach((option) => {
    option.setAttribute("aria-checked", String(option.dataset.importance === selectedImportance));
  });
  const selected = importanceScores[selectedImportance];
  priorityScore.textContent = String(selected.score);
  priorityDescription.textContent = `לפי רמת החשיבות ${selected.label} שבחרת`;
}

function updateTitleCounter() {
  titleCounter.textContent = `${titleInput.value.length} / 120 תווים`;
}

function createTaskFromForm() {
  const formData = new FormData(form);
  const estimate = formData.get("estimate");
  return {
    title: String(formData.get("title") || "").trim(),
    dueDate: formData.get("dueDate") || null,
    estimatedMinutes: estimate ? Number(estimate) : null,
    importance: selectedImportance,
    priorityScore: importanceScores[selectedImportance].score,
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    dependency: String(formData.get("dependency") || "").trim() || null,
    description: String(formData.get("description") || "").trim()
  };
}

async function saveTask(task) {
  document.dispatchEvent(new CustomEvent("tasksubmit", { detail: task }));
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

document.getElementById("open-modal").addEventListener("click", openModal);
document.getElementById("close-modal").addEventListener("click", closeModal);
document.getElementById("cancel-modal").addEventListener("click", closeModal);

moreToggle.addEventListener("click", () => {
  const isExpanded = moreToggle.getAttribute("aria-expanded") === "true";
  moreToggle.setAttribute("aria-expanded", String(!isExpanded));
  extraFields.hidden = isExpanded;
});

document.querySelectorAll(".importance-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectedImportance = option.dataset.importance;
    updateImportance();
  });
});

document.querySelector(".importance-options").addEventListener("keydown", (event) => {
  const options = [...document.querySelectorAll(".importance-option")];
  const currentIndex = options.indexOf(document.activeElement);
  let nextIndex;

  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % options.length;
  } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + options.length) % options.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = options.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  options[nextIndex].focus();
  options[nextIndex].click();
});

titleInput.addEventListener("input", updateTitleCounter);

document.addEventListener("keydown", (event) => {
  if (overlay.hidden) {
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
  } else if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!titleInput.value.trim()) {
    titleInput.setCustomValidity("נא למלא כותרת למשימה");
    titleInput.reportValidity();
    return;
  }
  titleInput.setCustomValidity("");

  const task = createTaskFromForm();
  try {
    await saveTask(task);
  } catch (error) {
    showToast("לא ניתן להשלים את המשימה. החלון נשאר פתוח.");
    return;
  }

  closeModal();
  showToast("המשימה נאספה בהצלחה. היא לא תישמר לאחר רענון.");
});

titleInput.addEventListener("input", () => titleInput.setCustomValidity(""));
updateTitleCounter();
updateImportance();
titleInput.focus();
