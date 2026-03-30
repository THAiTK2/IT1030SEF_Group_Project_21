function renderProfileData() {
  const profile = demoData.profileData;

  if (refs.homeWelcomeName) {
    refs.homeWelcomeName.textContent = profile.name;
  }

  if (refs.profileNameTitle) {
    refs.profileNameTitle.textContent = profile.name;
  }

  if (refs.profileNameValue) {
    refs.profileNameValue.textContent = profile.name;
  }

  if (refs.profileHeightValue) {
    refs.profileHeightValue.textContent = `${profile.heightCm} cm`;
  }

  if (refs.profileWeightValue) {
    refs.profileWeightValue.textContent = `${profile.weightKg} kg`;
  }

  if (refs.profileSportValue) {
    refs.profileSportValue.textContent = profile.sport;
  }

  if (refs.profileHobbyValue) {
    refs.profileHobbyValue.textContent = profile.hobby;
  }

  if (refs.profileAgeValue) {
    if (Number.isFinite(profile.age)) {
      refs.profileAgeValue.textContent = String(profile.age);
    } else {
      refs.profileAgeValue.textContent = "--";
    }
  }

  if (refs.profileSexValue) {
    if (profile.sex) {
      refs.profileSexValue.textContent = profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1);
    } else {
      refs.profileSexValue.textContent = "--";
    }
  }

  if (refs.profileActivityValue) {
    refs.profileActivityValue.textContent = getActivityLabel(profile.activityLevel);
  }

  if (refs.profileGoalValue) {
    refs.profileGoalValue.textContent = getGoalLabel(profile.goal);
  }

  if (refs.profileInputName) {
    refs.profileInputName.value = profile.name;
  }

  if (refs.profileInputHeight) {
    refs.profileInputHeight.value = String(profile.heightCm);
  }

  if (refs.profileInputWeight) {
    refs.profileInputWeight.value = String(profile.weightKg);
  }

  if (refs.profileInputSport) {
    refs.profileInputSport.value = profile.sport;
  }

  if (refs.profileInputHobby) {
    refs.profileInputHobby.value = profile.hobby;
  }

  if (refs.profileInputAge) {
    if (Number.isFinite(profile.age)) {
      refs.profileInputAge.value = String(profile.age);
    } else {
      refs.profileInputAge.value = "";
    }
  }

  if (refs.profileInputSex) {
    refs.profileInputSex.value = profile.sex || "";
  }

  if (refs.profileInputActivity) {
    refs.profileInputActivity.value = profile.activityLevel || "";
  }

  if (refs.profileInputGoal) {
    refs.profileInputGoal.value = profile.goal || "";
  }

  renderBmiCard();
  renderFoodTargetCard(getFoodTargetResult(profile));
}

function toggleProfileEdit(isEditing) {
  appState.isProfileEditing = isEditing;

  if (refs.profileDetailsView) {
    refs.profileDetailsView.classList.toggle("hidden", isEditing);
  }

  if (refs.profileEditForm) {
    refs.profileEditForm.classList.toggle("hidden", !isEditing);
  }

  if (refs.profileEditTrigger) {
    if (isEditing) {
      refs.profileEditTrigger.textContent = "Editing...";
    } else {
      refs.profileEditTrigger.textContent = "Edit Profile";
    }
  }

  if (isEditing) {
    renderProfileData();
  }
}

function handleSaveProfile() {
  let inputName = "";
  if (refs.profileInputName) {
    inputName = refs.profileInputName.value;
  }

  let inputHeight = "";
  if (refs.profileInputHeight) {
    inputHeight = refs.profileInputHeight.value;
  }

  let inputWeight = "";
  if (refs.profileInputWeight) {
    inputWeight = refs.profileInputWeight.value;
  }

  let inputSport = "";
  if (refs.profileInputSport) {
    inputSport = refs.profileInputSport.value;
  }

  let inputHobby = "";
  if (refs.profileInputHobby) {
    inputHobby = refs.profileInputHobby.value;
  }

  let inputAge = "";
  if (refs.profileInputAge) {
    inputAge = refs.profileInputAge.value;
  }

  let inputSex = "";
  if (refs.profileInputSex) {
    inputSex = refs.profileInputSex.value;
  }

  let inputActivity = "";
  if (refs.profileInputActivity) {
    inputActivity = refs.profileInputActivity.value;
  }

  let inputGoal = "";
  if (refs.profileInputGoal) {
    inputGoal = refs.profileInputGoal.value;
  }

  const profileFormData = {
    name: inputName,
    heightCm: inputHeight,
    weightKg: inputWeight,
    sport: inputSport,
    hobby: inputHobby,
    age: inputAge,
    sex: inputSex,
    activityLevel: inputActivity,
    goal: inputGoal,
  };

  const validation = normalizeProfileData(profileFormData);
  if (!validation.valid) {
    showToast(validation.message);
    return;
  }

  demoData.profileData = validation.data;
  saveProfileData();
  renderProfileData();
  renderGoalSpecificTracking(); // Update tracking display when goal changes
  toggleProfileEdit(false);
  showToast("Profile updated successfully.");
}

function handleCancelProfileEdit() {
  renderProfileData();
  toggleProfileEdit(false);
  showToast("Profile edit cancelled.");
}

function showScreen(screenId) {
  if (!coreScreens.includes(screenId)) {
    return;
  }

  refs.screens.forEach((screen) => {
    const id = screen.dataset.screen;
    if (id === "quick-actions-overlay") {
      return;
    }

    screen.classList.toggle("screen-current", id === screenId);
  });

  appState.currentScreen = screenId;

  const shouldShowBottomNav = ["home", "workouts", "metrics", "profile"].includes(screenId);
  refs.bottomNav.classList.toggle("hidden", !shouldShowBottomNav);

  if (shouldShowBottomNav) {
    setActiveBottomNav(screenId);
  }

  if (appState.isQuickActionsOpen && screenId !== "home") {
    closeQuickActions();
  }

  if (screenId !== "workouts" && appState.isWorkoutVideoOpen) {
    closeWorkoutVideo();
  }

  // Render metrics visuals when viewing metrics
  if (screenId === "metrics") {
    setTimeout(() => {
      renderMetricsByRange(appState.currentMetricsRange);
    }, 100);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

function setActiveBottomNav(tabId) {
  appState.currentTab = tabId;

  const navItems = document.querySelectorAll("[data-tab]");
  navItems.forEach((item) => {
    item.classList.toggle("nav-active", item.dataset.tab === tabId);
  });
}

function togglePasswordVisibility() {
  if (!refs.passwordInput || !refs.passwordIcon) {
    return;
  }

  appState.isPasswordVisible = !appState.isPasswordVisible;
  if (appState.isPasswordVisible) {
    refs.passwordInput.type = "text";
    refs.passwordIcon.textContent = "visibility_off";
  } else {
    refs.passwordInput.type = "password";
    refs.passwordIcon.textContent = "visibility";
  }
}

// Open quick action sheet (only inside main app screens).
// Input: none.
// Output: quick sheet visible to user.
// Side effect: updates overlay classes and appState flag.
function openQuickActions() {
  const allowedScreens = ["home", "workouts", "metrics", "profile"];
  if (!allowedScreens.includes(appState.currentScreen)) {
    showToast("Quick Actions are available after login.");
    return;
  }

  if (!refs.quickActionsOverlay) {
    return;
  }

  appState.isQuickActionsOpen = true;
  refs.quickActionsOverlay.classList.remove("hidden");
  refs.quickActionsOverlay.classList.add("active");
}

// Close quick action sheet only.
// Input: none.
// Output: quick sheet hidden.
// Side effect: updates overlay classes and appState flag.
function closeQuickActions() {
  if (!refs.quickActionsOverlay) {
    return;
  }

  appState.isQuickActionsOpen = false;
  refs.quickActionsOverlay.classList.add("hidden");
  refs.quickActionsOverlay.classList.remove("active");
}

// Helper for actions that should close quick sheet first, then open a modal.
function openModalFromQuickActions(modalId) {
  closeQuickActions();
  requestAnimationFrame(function () {
    openModal(modalId);
  });
}

function renderHomeStats() {
  // Home no longer shows old steps ring/progress UI.
  // We only update data that still exists on screen.

  // Get real water data
  const waterMl = getTodayWater();
  const waterLiters = (waterMl / 1000).toFixed(2);
  if (refs.waterValue) refs.waterValue.textContent = waterLiters;

  // Get real exercise data
  const exerciseStats = getTodayExerciseStats();
  const foodCalories = getTodayFoodCalories();
  const todayCaloriesEl = document.getElementById("today-calories");
  const todayCaloriesEatenEl = document.getElementById("today-calories-eaten");

  if (todayCaloriesEl) todayCaloriesEl.textContent = exerciseStats.totalCalories;
  if (todayCaloriesEatenEl) todayCaloriesEatenEl.textContent = foodCalories;

  // Update goal-specific tracking
  renderGoalSpecificTracking();
}

function renderGoalSpecificTracking() {
  const userGoal = demoData.profileData.goal || "maintenance";
  const targets = getGoalTrackingTargets(userGoal);

  // Update water target
  let waterTarget = null;
  if (refs.waterValue && refs.waterValue.parentElement) {
    waterTarget = refs.waterValue.parentElement.querySelector(".target");
  }

  if (waterTarget) {
    waterTarget.textContent = `/ ${targets.waterTarget}L`;
  }

  // Update weekly activity minutes
  const weeklyActivityEl = document.getElementById("weekly-activity");
  if (weeklyActivityEl) {
    const weeklyMins = getWeeklyActivityTotal();
    weeklyActivityEl.textContent = weeklyMins;
  }

  // Update calorie tracking display
  const calorieLabel = document.getElementById("calorie-label");
  const calorieValue = document.getElementById("calorie-value");
  const exerciseStats = getTodayExerciseStats();
  const foodCalories = getTodayFoodCalories();
  const netCalories = exerciseStats.totalCalories - foodCalories;

  if (calorieLabel) {
    if (userGoal === "loss") {
      calorieLabel.textContent = "Net Calorie Deficit";
      const targetNetDeficit = 500;
      const remaining = targetNetDeficit - netCalories;
      if (calorieValue) {
        let deltaClass = "tracking-delta-success";
        if (remaining > 0) {
          deltaClass = "tracking-delta-danger";
        }
        calorieValue.innerHTML = `
            <span class="tracking-delta ${deltaClass}">${Math.round(netCalories)}</span>
            <span class="tracking-total">/ ${targetNetDeficit} target</span> kcal
            <br><small class="tracking-subline">Burned ${exerciseStats.totalCalories} | Eaten ${foodCalories}</small>
          `;
      }
    } else if (userGoal === "gain") {
      calorieLabel.textContent = "Net Calorie Surplus";
      const targetSurplus = 300;
      const currentSurplus = foodCalories - exerciseStats.totalCalories;
      const gap = targetSurplus - currentSurplus;
      if (calorieValue) {
        let deltaClass = "tracking-delta-success";
        if (gap > 0) {
          deltaClass = "tracking-delta-info";
        }
        calorieValue.innerHTML = `
            <span class="tracking-delta ${deltaClass}">${Math.round(currentSurplus)}</span>
            <span class="tracking-total">/ ${targetSurplus} target</span> kcal
            <br><small class="tracking-subline">Burned ${exerciseStats.totalCalories} | Eaten ${foodCalories}</small>
          `;
      }
    } else {
      calorieLabel.textContent = "Net Calories";
      if (calorieValue) {
        let deltaClass = "tracking-delta-info";
        if (netCalories >= 0) {
          deltaClass = "tracking-delta-success";
        }
        calorieValue.innerHTML = `
          <span class="tracking-delta ${deltaClass}">${Math.round(netCalories)}</span>
          <span class="tracking-total">/ 0 target</span> kcal
          <br><small class="tracking-subline">Burned ${exerciseStats.totalCalories} | Eaten ${foodCalories}</small>
        `;
      }
    }
  }

  // Update goal badge in tracking card
  const goalBadge = document.getElementById("goal-badge");
  if (goalBadge) {
    goalBadge.textContent = targets.label;
    goalBadge.style.backgroundColor = targets.color + "20";
    goalBadge.style.color = targets.color;
    goalBadge.style.borderColor = targets.color;
  }

  // Hide all goal tracking info first
  const weightLossInfo = document.getElementById("weight-loss-info");
  const maintenanceInfo = document.getElementById("maintenance-info");
  const muscleGainInfo = document.getElementById("muscle-gain-info");

  if (weightLossInfo) weightLossInfo.style.display = "none";
  if (maintenanceInfo) maintenanceInfo.style.display = "none";
  if (muscleGainInfo) muscleGainInfo.style.display = "none";

  // Show relevant goal tracking info
  if (userGoal === "loss") {
    if (weightLossInfo) {
      weightLossInfo.style.display = "block";
      const lastWeight = getLastWeightEntry();
      const lastWeightEl = document.getElementById("last-weight-loss");
      if (lastWeightEl) {
        if (lastWeight) {
          let bodyFatText = "";
          if (lastWeight.bodyFat) {
            bodyFatText = ` (${lastWeight.bodyFat}% BF)`;
          }
          lastWeightEl.textContent = `Last weight: ${lastWeight.weight}kg${bodyFatText}`;
        } else {
          lastWeightEl.textContent = "No weight logged yet - Start tracking today!";
        }
      }
    }
  } else if (userGoal === "maintenance") {
    if (maintenanceInfo) {
      maintenanceInfo.style.display = "block";
      const avgWeight = getAverageWeightLastWeek();
      const stabilityEl = document.getElementById("weight-stability");
      if (stabilityEl) {
        if (avgWeight) {
          stabilityEl.textContent = `Weekly avg: ${avgWeight}kg - Monitor for stability ±2kg`;
        } else {
          stabilityEl.textContent = "Log weights 2-3 times weekly";
        }
      }
    }
  } else if (userGoal === "gain") {
    if (muscleGainInfo) {
      muscleGainInfo.style.display = "block";
      const lastWeight = getLastWeightEntry();
      const muscleProgressEl = document.getElementById("muscle-progress");
      if (muscleProgressEl) {
        if (lastWeight) {
          muscleProgressEl.textContent = `Last: ${lastWeight.weight}kg - Track weekly gains`;
        } else {
          muscleProgressEl.textContent = "Log weight weekly to track muscle gains";
        }
      }
    }
  }
}

