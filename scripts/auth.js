const form = document.getElementById("auth-form");

const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginOptions = document.getElementById("login-options");

const submitButton = document.getElementById("submit-button");
const buttonText = submitButton.querySelector(".button-text");

const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");

const footerText = document.getElementById("footer-text");
const footerSwitch = document.getElementById("footer-switch");

const forgotPassword = document.getElementById("forgot-password");

/* Page to open after a successful login or registration */
const TASKS_PAGE = "new-task.html";
const SESSION_KEY = "smartTodos.session";

/* Simulated server delay in milliseconds */
const MOCK_DELAY_MS = 1200;

let currentMode = "login";

/* Hide the error message */
function hideError() {
    errorMessage.hidden = true;
}

/* Show an error message */
function showError(message) {
    errorText.textContent = message;
    errorMessage.hidden = false;
}

/* Switch between login and register */
function setMode(mode) {
    currentMode = mode;
    hideError();

    const isLogin = mode === "login";

    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);

    loginTab.setAttribute("aria-selected", String(isLogin));
    registerTab.setAttribute("aria-selected", String(!isLogin));

    if (isLogin) {
        formTitle.textContent = "כניסה לחשבון";
        formSubtitle.textContent =
            "המשימות שלך, מתועדפות אוטומטית לפי מה שחשוב באמת.";

        buttonText.textContent = "כניסה";

        footerText.textContent = "אין לך חשבון עדיין?";
        footerSwitch.textContent = "להרשמה";

        loginOptions.hidden = false;
        passwordInput.autocomplete = "current-password";
    } else {
        formTitle.textContent = "יצירת חשבון";
        formSubtitle.textContent =
            "הצטרפו ונהלו את המשימות שלכם בצורה חכמה.";

        buttonText.textContent = "הרשמה";

        footerText.textContent = "כבר יש לך חשבון?";
        footerSwitch.textContent = "לכניסה";

        loginOptions.hidden = true;
        passwordInput.autocomplete = "new-password";
    }
}

/* Tab buttons */
loginTab.addEventListener("click", () => {
    setMode("login");
});

registerTab.addEventListener("click", () => {
    setMode("register");
});

/* Footer switch */
footerSwitch.addEventListener("click", () => {
    setMode(currentMode === "login" ? "register" : "login");
});

/* Email validation */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Loading state */
function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.classList.toggle("loading", isLoading);

    buttonText.textContent = isLoading
        ? "מתחבר..."
        : currentMode === "login"
            ? "כניסה"
            : "הרשמה";
}

/*
  Mock authentication for development only.
  Replace the body of this function with a real API call once a server exists.
*/
function mockAuthenticate(mode, email) {
    return new Promise((resolve) => {
        window.setTimeout(() => resolve({ mode, email }), MOCK_DELAY_MS);
    });
}

/* Keep a minimal session marker. Never store the password. */
function saveSession(email) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    } catch {
        /* Storage can be unavailable (e.g. private mode); the redirect still works. */
    }
}

/* Form submission */
form.addEventListener("submit", (event) => {
    event.preventDefault();

    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError("יש למלא כתובת אימייל וסיסמה.");
        return;
    }

    if (!isValidEmail(email)) {
        showError("כתובת האימייל אינה תקינה.");
        emailInput.focus();
        return;
    }

    if (password.length < 8) {
        showError("הסיסמה חייבת להכיל לפחות 8 תווים.");
        passwordInput.focus();
        return;
    }

    setLoading(true);

    mockAuthenticate(currentMode, email)
        .then(() => {
            saveSession(email);
            window.location.href = TASKS_PAGE;
        })
        .catch(() => {
            setLoading(false);
            showError("אירעה שגיאה. נסו שוב.");
        });
});

/* Clear errors when the user edits the fields */
emailInput.addEventListener("input", hideError);
passwordInput.addEventListener("input", hideError);

/* Forgot password */
forgotPassword.addEventListener("click", () => {
    showError("אפשרות איפוס הסיסמה תתווסף במסך המתאים.");
});

/* Initial state */
setMode("login");