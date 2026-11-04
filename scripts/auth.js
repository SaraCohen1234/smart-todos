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
const authDefaultView = document.getElementById("auth-default-view");
const recoveryView = document.getElementById("recovery-view");
const recoverySentView = document.getElementById("recovery-sent-view");
const recoveryForm = document.getElementById("recovery-form");
const recoveryEmailInput = document.getElementById("recovery-email");
const recoveryError = document.getElementById("recovery-error");
const recoveryErrorText = document.getElementById("recovery-error-text");
const recoveryTitle = document.getElementById("recovery-title");
const recoverySentTitle = document.getElementById("recovery-sent-title");
const resendFeedback = document.getElementById("resend-feedback");

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
    recoveryEmailInput.value = emailInput.value.trim();
    errorMessage.hidden = true;
    authDefaultView.hidden = true;
    recoverySentView.hidden = true;
    recoveryView.hidden = false;
    recoveryError.hidden = true;
    resendFeedback.hidden = true;
    document.title = "משימות | שחזור סיסמה";
    recoveryTitle.focus();
});

function returnToLogin() {
    recoveryView.hidden = true;
    recoverySentView.hidden = true;
    authDefaultView.hidden = false;
    setMode("login");
    document.title = "משימות | כניסה לחשבון";
    emailInput.focus();
}

document.getElementById("recovery-back").addEventListener("click", returnToLogin);
document.getElementById("recovery-sent-back").addEventListener("click", returnToLogin);

recoveryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    recoveryError.hidden = true;

    const email = recoveryEmailInput.value.trim();
    if (!isValidEmail(email)) {
        recoveryErrorText.textContent = "כתובת האימייל אינה תקינה.";
        recoveryError.hidden = false;
        recoveryEmailInput.focus();
        return;
    }

    recoveryEmailInput.value = email;
    recoveryView.hidden = true;
    recoverySentView.hidden = false;
    resendFeedback.hidden = true;
    document.title = "משימות | קישור נשלח";
    recoverySentTitle.focus();
});

document.getElementById("resend-recovery").addEventListener("click", () => {
    resendFeedback.hidden = false;
});

/* Initial state */
setMode("login");