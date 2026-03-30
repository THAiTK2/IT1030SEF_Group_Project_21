// 4) Event binding (split by feature)
// Purpose: Connect UI controls to functions in clear groups.
// Inputs: clicks, submits, changes from user.
// Outputs: function calls to update UI/data.
// Side effects: adds event listeners.
// ================================
// Central action router for all [data-action] buttons.
// Input: clicked button element.
// Output: runs a matching action function.
// Side effect: depends on action (UI updates, storage updates, etc).
function handleActionButtonClick(button) {
  const action = button.dataset.action;

  switch (action) {
    case "toggle-password":
      togglePasswordVisibility();
      break;
    case "open-quick-actions":
      openQuickActions();
      break;
    case "close-quick-actions":
      closeQuickActions();
      break;
    case "open-water-modal":
      openModalFromQuickActions("water");
      break;
    case "open-exercise-modal":
      openModalFromQuickActions("exercise");
      break;
    case "open-weight-modal":
      openModal("weight");
      closeQuickActions();
      break;
    case "open-food-modal":
      openModal("food");
      closeQuickActions();
      break;
    case "show-toast":
      handleStubAction(button.dataset.toast);
      break;
    case "log-workout":
      openModal("exercise");
      break;
    case "track-water":
      openModal("water");
      break;
    case "quick-action":
      handleQuickAction(button.dataset.quick);
      break;
    case "toggle-workout-filter":
      setWorkoutFilter(button.dataset.filter);
      break;
    case "toggle-workout-video":
      toggleWorkoutVideo(button);
      break;
    case "close-workout-video":
      closeWorkoutVideo();
      break;
    case "toggle-metrics-range":
      setMetricsRange(button.dataset.range);
      break;
    case "toggle-profile-edit":
      toggleProfileEdit(!appState.isProfileEditing);
      break;
    case "save-profile":
      handleSaveProfile();
      break;
    case "cancel-profile-edit":
      handleCancelProfileEdit();
      break;
    default:
      break;
  }
}

function bindNavigationEvents() {
  const targetButtons = document.querySelectorAll("[data-target]");
  targetButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showScreen(button.dataset.target);
    });
  });

  const tabButtons = document.querySelectorAll("[data-tab]");
  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showScreen(button.dataset.tab);
    });
  });
}

function bindModalEvents() {
  const modalBackdrops = document.querySelectorAll(".modal-backdrop");
  modalBackdrops.forEach(function (backdrop) {
    backdrop.addEventListener("click", function (event) {
      const modal = event.target.closest("[data-modal]");
      if (modal) {
        closeModal(modal.dataset.modal);
      }
    });
  });

  const closeButtons = document.querySelectorAll("[data-action='close-modal']");
  closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      closeModal(button.dataset.modal);
    });
  });
}

function bindFormEvents() {
  const waterForm = document.getElementById("water-form");
  if (waterForm) {
    waterForm.addEventListener("submit", handleWaterFormSubmit);
  }

  const presetButtons = document.querySelectorAll(".preset-btn");
  presetButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const amountInput = document.getElementById("water-amount");
      if (amountInput) {
        amountInput.value = button.dataset.amount;
        amountInput.focus();
      }
    });
  });

  const exerciseForm = document.getElementById("exercise-form");
  if (exerciseForm) {
    exerciseForm.addEventListener("submit", handleExerciseFormSubmit);
  }

  const exerciseType = document.getElementById("exercise-type");
  const exerciseDuration = document.getElementById("exercise-duration");
  const exerciseIntensity = document.getElementById("exercise-intensity");

  if (exerciseType) {
    exerciseType.addEventListener("change", updateCalorieEstimate);
  }
  if (exerciseDuration) {
    exerciseDuration.addEventListener("input", updateCalorieEstimate);
  }
  if (exerciseIntensity) {
    exerciseIntensity.addEventListener("change", updateCalorieEstimate);
  }

  const weightForm = document.getElementById("weight-form");
  if (weightForm) {
    weightForm.addEventListener("submit", handleWeightFormSubmit);
  }

  const foodForm = document.getElementById("food-form");
  if (foodForm) {
    foodForm.addEventListener("submit", handleFoodFormSubmit);
  }

  const weightTimeInput = document.getElementById("weight-time");
  if (weightTimeInput) {
    weightTimeInput.valueAsDate = new Date();
  }
}

function bindMetricsEvents() {
  const datePicker = document.getElementById("month-date-picker");
  if (datePicker) {
    datePicker.addEventListener("change", function (event) {
      appState.selectedDate = event.target.value;
      if (appState.currentMetricsRange === "month") {
        renderMetricsByRange("month");
      }
    });
  }

  const metricSelector = document.getElementById("metric-selector");
  if (metricSelector) {
    metricSelector.addEventListener("change", function (event) {
      appState.currentMetric = event.target.value;
      renderMetricsByRange(appState.currentMetricsRange);
      updateGoalInputSection();
    });
  }

  const goalSaveButton = document.getElementById("goal-save-btn");
  if (goalSaveButton) {
    goalSaveButton.addEventListener("click", function () {
      const goalInput = document.getElementById("goal-input-value");
      if (!goalInput) {
        return;
      }

      const value = parseFloat(goalInput.value);
      const metric = appState.currentMetric;
      if (isNaN(value) || value <= 0) {
        showToast("Please enter a valid goal value.");
        return;
      }

      setGoal(metric, value);
      const metricConfig = METRIC_CONFIG[metric];
      showToast(`Goal set to ${value} ${metricConfig.unit}`);
      goalInput.value = "";
      renderMetricsByRange(appState.currentMetricsRange);
      updateGoalInputSection();
    });
  }
}

function bindActionEvents() {
  const actionButtons = document.querySelectorAll("[data-action]");
  actionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      handleActionButtonClick(button);
    });
  });
}

function bindLinkEvents() {
  const linkButtons = document.querySelectorAll('a[href="#"]');
  linkButtons.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      handleStubAction(link.dataset.toast);
    });
  });
}

function bindLoginEvent() {
  if (!refs.loginForm) {
    return;
  }

  refs.loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    showScreen("home");
    showToast(`Welcome back, ${demoData.profileData.name}!`);
  });
}

function bindThemeEvent() {
  const themeSwitcher = document.getElementById("theme-switcher");
  if (themeSwitcher) {
    themeSwitcher.addEventListener("click", switchTheme);
  }
}

function bindEvents() {
  bindNavigationEvents();
  bindModalEvents();
  bindFormEvents();
  bindMetricsEvents();
  bindActionEvents();
  bindLinkEvents();
  bindLoginEvent();
  bindThemeEvent();
}

// ================================

// 6) App start
// Purpose: Start app in one predictable order.
// Inputs: DOMContentLoaded event.
// Outputs: initial UI rendered.
// Side effects: binds events + loads saved data/theme.
// ================================
function initApp() {
  bindEvents();
  closeQuickActions();
  initializeTheme();

  loadProfileData();
  loadGoals();
  renderHomeStats();
  renderWorkoutList();
  renderProfileData();
  renderBmiCard();
  renderFoodTargetCard(getFoodTargetResult(demoData.profileData));
  updateGoalInputSection();
  setMetricsRange(appState.currentMetricsRange);
  toggleProfileEdit(false);
  showScreen(appState.currentScreen);
}

document.addEventListener("DOMContentLoaded", initApp);
