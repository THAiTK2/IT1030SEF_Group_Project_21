// 5) Theme logic (manual only)
// Purpose: Start with light theme and let user switch manually.
// Inputs: theme button click.
// Outputs: updates #app[data-theme] and button label.
// Side effects: clears old auto-theme storage keys once on startup.
// ================================
function updateThemeSwitcherLabel(currentTheme) {
  const themeSwitcher = document.getElementById("theme-switcher");
  if (!themeSwitcher) {
    return;
  }

  if (currentTheme === "dark") {
    themeSwitcher.innerHTML = '<span class="material-symbols-outlined inline-icon">light_mode</span>Switch to Light Mode';
    return;
  }

  themeSwitcher.innerHTML = '<span class="material-symbols-outlined inline-icon">dark_mode</span>Switch to Dark Mode';
}

function applyTheme(theme) {
  const appRoot = document.getElementById("app");
  if (!appRoot) {
    return;
  }

  appRoot.setAttribute("data-theme", theme);
  updateThemeSwitcherLabel(theme);
}

function clearLegacyThemeStorage() {
  localStorage.removeItem("appThemeManualOverrideV1");
  localStorage.removeItem("appTheme");
}

function initializeTheme() {
  clearLegacyThemeStorage();
  applyTheme("light");
}

function switchTheme() {
  const appRoot = document.getElementById("app");
  if (!appRoot) {
    return;
  }

  let currentTheme = "light";
  if (appRoot.getAttribute("data-theme") === "dark") {
    currentTheme = "dark";
  }

  let nextTheme = "dark";
  if (currentTheme === "dark") {
    nextTheme = "light";
  }

  applyTheme(nextTheme);
}

// ================================
