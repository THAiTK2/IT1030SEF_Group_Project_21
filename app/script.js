(() => {
  const appState = {
    currentScreen: "onboarding",
    currentTab: "home",
    isQuickActionsOpen: false,
    isProfileEditing: false,
    isPasswordVisible: false,
    toastTimer: null,
    currentWorkoutFilter: "all",
    currentMetricsRange: "week",
    calorieSeriesIndex: 0,
  };

  const demoData = {
    goal: 10000,
    steps: 8245,
    waterLiters: 1.8,
    calorieBalanceSeries: [-340, -280, -210, -390],
    calorieMixSeries: [62, 58, 66, 52],
    profileData: {
      name: "Alex Rivera",
      heightCm: 175,
      weightKg: 68,
      sport: "Running",
      hobby: "Hiking",
      age: null,
      sex: "",
      activityLevel: "",
      goal: "",
    },
    workoutsByFilter: {
      all: {
        title: "Morning Mobility Flow",
        subtitle: "Intermediate • Yoga",
        duration: "15 min",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD87BpFRsR47WgS7q1t4QHytvgUnEVk-OChPwHtMIIgA28kPHFO0tF2NWrXBhxdKeUpqcgLqEqgGLBn8-hLKexftTR4hkf112ntIZaC0AofG9PHWZCPd-8zKwRIkpdubvSiOREIOkGpJGdCsSxeI8dXpPAqMCbE2WygF6FvcxSvvqZVn6VhaqlA9An6Pf_4KpAKSX0fZFc3iIjz4XjLrX-VwUbk_Iz5q0H_XmHw83dzHOzURfmOLi3s_-oMmvQiDORhZUOroG0oeuE",
      },
      cardio: {
        title: "Tempo Run Builder",
        subtitle: "Advanced • Cardio",
        duration: "32 min",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCB96crVE7AFULLtcIM0tt6_MgwBfaPsbQFMGDI5sE3EYQDd1whySoEOiXXrxP78gdKD-OJi03SRkCigmsUZwSQsXigQU8wUirhXfg_ESwkMULtlDdvhqMv77nMUArgISSwO5l5Wqm1rzHhfzhxe7HA1QfiJ9g0IEnJpJgSWIafHj6uVQqODePPoJ5J73G4kKy60AkzwSYUIDY7458w-ahSP0M4ks1gaFWplG7zoyBpk8BTJRyLWADF2xtKA9Cf7X5ZedNcHfjIF40",
      },
      strength: {
        title: "Upper Body Power",
        subtitle: "Advanced • Strength",
        duration: "45 min",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCWu5IjotFueEgOMzznobnZJ1Bv6QlBqfTIJtHfTAIZ_YlohlaGDH56frdr8pyWoKoNh1dZdfrvWJLs9G8Umm4tcLbiulYFC1I3qj-EI7JUsBF4IwP-6dogaZFiz5BmiIClGPc51aaxdyw1KXZkkbNcBt0CN_s6L0LSCQRPgceX5ZvIm9nOyOL4PnwSJqxN1S2sI2Jnf4h4lgXfXFsydpAQW4jE6JaYmfCe-4aXH3KNoi-b1ZjprIOQ1l35eQSQo8nsbRqWMD3IlRM",
      },
    },
    metricsByRange: {
      day: {
        calorieBalance: -280,
        calorieMix: 58,
      },
      week: {
        calorieBalance: -340,
        calorieMix: 62,
      },
      month: {
        calorieBalance: -210,
        calorieMix: 66,
      },
    },
  };

  const coreScreens = ["onboarding", "login", "home", "workouts", "metrics", "profile"];
  const PROFILE_STORAGE_KEY = "fitnessProfileV1";

  const refs = {
    screens: Array.from(document.querySelectorAll("section.screen")),
    bottomNav: document.getElementById("bottom-nav"),
    quickActionsOverlay: document.querySelector('[data-screen="quick-actions-overlay"]'),
    passwordInput: document.getElementById("password-input"),
    passwordIcon: document.getElementById("password-icon"),
    loginForm: document.getElementById("login-form"),
    toast: document.getElementById("app-toast"),
    stepsRing: document.getElementById("steps-ring"),
    stepsPercentLabel: document.getElementById("steps-percent-label"),
    stepsCurrentValue: document.getElementById("steps-current-value"),
    stepsProgressFill: document.getElementById("steps-progress-fill"),
    waterValue: document.getElementById("water-value"),
    homeWelcomeName: document.getElementById("home-welcome-name"),
    workoutCardImage: document.getElementById("workout-card-image"),
    workoutCardTitle: document.getElementById("workout-card-title"),
    workoutCardSubtitle: document.getElementById("workout-card-subtitle"),
    workoutCardDuration: document.getElementById("workout-card-duration"),
    calorieBalanceValue: document.getElementById("calorie-balance-value"),
    greenMixFill: document.getElementById("green-mix-fill"),
    orangeMixFill: document.getElementById("orange-mix-fill"),
    bmiValue: document.getElementById("bmi-value"),
    bmiCategory: document.getElementById("bmi-category"),
    bmiPointer: document.getElementById("bmi-pointer"),
    bmiZoneUnderweight: document.getElementById("bmi-zone-underweight"),
    bmiZoneNormal: document.getElementById("bmi-zone-normal"),
    bmiZoneOverweight: document.getElementById("bmi-zone-overweight"),
    bmiZoneObese: document.getElementById("bmi-zone-obese"),
    foodTargetValue: document.getElementById("food-target-value"),
    foodBmrValue: document.getElementById("food-bmr-value"),
    foodTdeeValue: document.getElementById("food-tdee-value"),
    foodGoalChip: document.getElementById("food-goal-chip"),
    foodAimLoss: document.getElementById("food-aim-loss"),
    foodAimMaintenance: document.getElementById("food-aim-maintenance"),
    foodAimGain: document.getElementById("food-aim-gain"),
    profileNameTitle: document.getElementById("profile-name-title"),
    profileDetailsView: document.getElementById("profile-details-view"),
    profileNameValue: document.getElementById("profile-name-value"),
    profileHeightValue: document.getElementById("profile-height-value"),
    profileWeightValue: document.getElementById("profile-weight-value"),
    profileSportValue: document.getElementById("profile-sport-value"),
    profileHobbyValue: document.getElementById("profile-hobby-value"),
    profileAgeValue: document.getElementById("profile-age-value"),
    profileSexValue: document.getElementById("profile-sex-value"),
    profileActivityValue: document.getElementById("profile-activity-value"),
    profileGoalValue: document.getElementById("profile-goal-value"),
    profileEditForm: document.getElementById("profile-edit-form"),
    profileEditTrigger: document.getElementById("profile-edit-trigger"),
    profileInputName: document.getElementById("profile-input-name"),
    profileInputHeight: document.getElementById("profile-input-height"),
    profileInputWeight: document.getElementById("profile-input-weight"),
    profileInputSport: document.getElementById("profile-input-sport"),
    profileInputHobby: document.getElementById("profile-input-hobby"),
    profileInputAge: document.getElementById("profile-input-age"),
    profileInputSex: document.getElementById("profile-input-sex"),
    profileInputActivity: document.getElementById("profile-input-activity"),
    profileInputGoal: document.getElementById("profile-input-goal"),
  };

  function formatNumber(value) {
    return value.toLocaleString("en-US");
  }

  function getActivityMultiplier(level) {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9,
    };
    return multipliers[level] ?? null;
  }

  function getActivityLabel(level) {
    const labels = {
      sedentary: "Sedentary",
      light: "Lightly Active",
      moderate: "Moderately Active",
      very: "Very Active",
      extra: "Extra Active",
    };
    return labels[level] ?? "--";
  }

  function getGoalLabel(goal) {
    const labels = {
      maintenance: "Maintenance",
      loss: "Weight Loss",
      gain: "Weight Gain",
    };
    return labels[goal] ?? "--";
  }

  function showToast(message) {
    if (!refs.toast) {
      return;
    }

    refs.toast.textContent = message;
    refs.toast.classList.add("show");

    if (appState.toastTimer) {
      clearTimeout(appState.toastTimer);
    }

    appState.toastTimer = setTimeout(() => {
      refs.toast.classList.remove("show");
    }, 1800);
  }

  function handleStubAction(message) {
    const fallback = "Feature coming soon.";
    showToast(message || fallback);
  }

  function normalizeProfileData(rawData) {
    const safeAgeRaw = rawData?.age;
    const safeSex = String(rawData?.sex ?? "")
      .trim()
      .toLowerCase();
    const safeActivityLevel = String(rawData?.activityLevel ?? "")
      .trim()
      .toLowerCase();
    const safeGoal = String(rawData?.goal ?? "")
      .trim()
      .toLowerCase();

    const normalized = {
      name: String(rawData?.name ?? "").trim(),
      heightCm: Number(rawData?.heightCm),
      weightKg: Number(rawData?.weightKg),
      sport: String(rawData?.sport ?? "").trim(),
      hobby: String(rawData?.hobby ?? "").trim(),
      age: null,
      sex: safeSex,
      activityLevel: safeActivityLevel,
      goal: safeGoal,
    };

    if (!normalized.name) {
      return { valid: false, message: "Name cannot be empty." };
    }

    if (!Number.isFinite(normalized.heightCm) || normalized.heightCm < 80 || normalized.heightCm > 250) {
      return { valid: false, message: "Height must be between 80 and 250 cm." };
    }

    if (!Number.isFinite(normalized.weightKg) || normalized.weightKg < 20 || normalized.weightKg > 300) {
      return { valid: false, message: "Weight must be between 20 and 300 kg." };
    }

    if (!normalized.sport) {
      return { valid: false, message: "Sport cannot be empty." };
    }

    if (!normalized.hobby) {
      return { valid: false, message: "Hobby cannot be empty." };
    }

    if (safeAgeRaw !== "" && safeAgeRaw !== null && safeAgeRaw !== undefined) {
      const parsedAge = Number(safeAgeRaw);
      if (!Number.isFinite(parsedAge) || parsedAge < 10 || parsedAge > 100) {
        return { valid: false, message: "Age must be between 10 and 100." };
      }
      normalized.age = Math.round(parsedAge);
    }

    const validSexValues = ["", "male", "female"];
    if (!validSexValues.includes(normalized.sex)) {
      return { valid: false, message: "Sex must be Male or Female." };
    }

    const validActivityValues = ["", "sedentary", "light", "moderate", "very", "extra"];
    if (!validActivityValues.includes(normalized.activityLevel)) {
      return { valid: false, message: "Activity level is invalid." };
    }

    const validGoalValues = ["", "maintenance", "loss", "gain"];
    if (!validGoalValues.includes(normalized.goal)) {
      return { valid: false, message: "Goal is invalid." };
    }

    normalized.heightCm = Math.round(normalized.heightCm);
    normalized.weightKg = Number(normalized.weightKg.toFixed(1));
    return { valid: true, data: normalized };
  }

  function loadProfileData() {
    try {
      const savedData = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!savedData) {
        return;
      }

      const parsed = JSON.parse(savedData);
      const validation = normalizeProfileData(parsed);
      if (validation.valid) {
        demoData.profileData = validation.data;
      }
    } catch (_error) {
      return;
    }
  }

  function saveProfileData() {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(demoData.profileData));
    } catch (_error) {
      showToast("Unable to save profile on this device.");
    }
  }

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
      refs.profileAgeValue.textContent = Number.isFinite(profile.age) ? String(profile.age) : "--";
    }

    if (refs.profileSexValue) {
      refs.profileSexValue.textContent = profile.sex ? profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1) : "--";
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
      refs.profileInputAge.value = Number.isFinite(profile.age) ? String(profile.age) : "";
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
      refs.profileEditTrigger.textContent = isEditing ? "Editing..." : "Edit Profile";
    }

    if (isEditing) {
      renderProfileData();
    }
  }

  function handleSaveProfile() {
    const profileFormData = {
      name: refs.profileInputName?.value,
      heightCm: refs.profileInputHeight?.value,
      weightKg: refs.profileInputWeight?.value,
      sport: refs.profileInputSport?.value,
      hobby: refs.profileInputHobby?.value,
      age: refs.profileInputAge?.value,
      sex: refs.profileInputSex?.value,
      activityLevel: refs.profileInputActivity?.value,
      goal: refs.profileInputGoal?.value,
    };

    const validation = normalizeProfileData(profileFormData);
    if (!validation.valid) {
      showToast(validation.message);
      return;
    }

    demoData.profileData = validation.data;
    saveProfileData();
    renderProfileData();
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
    refs.passwordInput.type = appState.isPasswordVisible ? "text" : "password";
    refs.passwordIcon.textContent = appState.isPasswordVisible ? "visibility_off" : "visibility";
  }

  function openQuickActions() {
    const allowedScreens = ["home", "workouts", "metrics", "profile"];
    if (!allowedScreens.includes(appState.currentScreen)) {
      showToast("Quick Actions are available after login.");
      return;
    }

    appState.isQuickActionsOpen = true;
    refs.quickActionsOverlay.classList.remove("hidden");
    refs.quickActionsOverlay.classList.add("active");
  }

  function closeQuickActions() {
    appState.isQuickActionsOpen = false;
    refs.quickActionsOverlay.classList.add("hidden");
    refs.quickActionsOverlay.classList.remove("active");
  }

  function renderHomeStats() {
    const progress = Math.min((demoData.steps / demoData.goal) * 100, 100);

    refs.stepsCurrentValue.textContent = formatNumber(demoData.steps);
    refs.stepsProgressFill.style.width = `${progress.toFixed(2)}%`;
    refs.stepsPercentLabel.textContent = `${Math.round(progress)}%`;
    refs.stepsRing.style.setProperty("--value", String(Math.round(progress)));
    refs.waterValue.textContent = demoData.waterLiters.toFixed(2);
  }

  function renderWorkoutList() {
    const workout = demoData.workoutsByFilter[appState.currentWorkoutFilter];
    if (!workout) {
      return;
    }

    refs.workoutCardImage.src = workout.image;
    refs.workoutCardTitle.textContent = workout.title;
    refs.workoutCardSubtitle.textContent = workout.subtitle;
    refs.workoutCardDuration.textContent = workout.duration;
  }

  function renderMetricsCards() {
    const metrics = demoData.metricsByRange[appState.currentMetricsRange];
    if (!metrics) {
      return;
    }

    refs.calorieBalanceValue.textContent = String(metrics.calorieBalance);
    refs.greenMixFill.style.width = `${metrics.calorieMix}%`;
    refs.orangeMixFill.style.width = `${100 - metrics.calorieMix}%`;
  }

  function calculateBmi(weightKg, heightCm) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Number(bmi.toFixed(1));
  }

  function calculateBmr(profileData) {
    const { weightKg, heightCm, age, sex } = profileData;
    if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || !Number.isFinite(age)) {
      return null;
    }

    if (sex !== "male" && sex !== "female") {
      return null;
    }

    const sexAdjustment = sex === "male" ? 5 : -161;
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + sexAdjustment;
  }

  function calculateTdee(bmr, multiplier) {
    if (!Number.isFinite(bmr) || !Number.isFinite(multiplier)) {
      return null;
    }

    return bmr * multiplier;
  }

  function calculateTargetCalories(tdee, goal) {
    if (!Number.isFinite(tdee)) {
      return null;
    }

    const adjustmentMap = {
      maintenance: 0,
      loss: -500,
      gain: 300,
    };

    if (adjustmentMap[goal] === undefined) {
      return null;
    }

    return tdee + adjustmentMap[goal];
  }

  function getMissingFoodFields(profileData) {
    const missing = [];

    if (!Number.isFinite(profileData.heightCm)) {
      missing.push("Height");
    }

    if (!Number.isFinite(profileData.weightKg)) {
      missing.push("Weight");
    }

    if (!Number.isFinite(profileData.age)) {
      missing.push("Age");
    }

    if (!profileData.sex) {
      missing.push("Sex");
    }

    if (!profileData.activityLevel) {
      missing.push("Activity");
    }

    if (!profileData.goal) {
      missing.push("Goal");
    }

    return missing;
  }

  function getFoodTargetResult(profileData) {
    const missingFields = getMissingFoodFields(profileData);
    if (missingFields.length > 0) {
      return null;
    }

    const bmr = calculateBmr(profileData);
    const multiplier = getActivityMultiplier(profileData.activityLevel);
    const tdee = calculateTdee(bmr, multiplier);
    const target = calculateTargetCalories(tdee, profileData.goal);

    if (!Number.isFinite(bmr) || !Number.isFinite(tdee) || !Number.isFinite(target)) {
      return null;
    }

    return {
      goal: profileData.goal,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(target),
      lossTarget: Math.round(calculateTargetCalories(tdee, "loss")),
      maintenanceTarget: Math.round(calculateTargetCalories(tdee, "maintenance")),
      gainTarget: Math.round(calculateTargetCalories(tdee, "gain")),
    };
  }

  function renderFoodTargetCard(result) {
    if (
      !refs.foodTargetValue ||
      !refs.foodBmrValue ||
      !refs.foodTdeeValue ||
      !refs.foodGoalChip ||
      !refs.foodAimLoss ||
      !refs.foodAimMaintenance ||
      !refs.foodAimGain
    ) {
      return;
    }

    const segments = {
      loss: refs.foodAimLoss,
      maintenance: refs.foodAimMaintenance,
      gain: refs.foodAimGain,
    };

    refs.foodAimLoss.classList.remove("active");
    refs.foodAimMaintenance.classList.remove("active");
    refs.foodAimGain.classList.remove("active");

    if (!result) {
      refs.foodTargetValue.textContent = "--";
      refs.foodBmrValue.textContent = "--";
      refs.foodTdeeValue.textContent = "--";
      refs.foodGoalChip.textContent = "Complete Profile";
      refs.foodGoalChip.classList.remove("loss", "maintenance", "gain");
      refs.foodGoalChip.classList.add("empty");
      refs.foodAimLoss.textContent = "Loss";
      refs.foodAimMaintenance.textContent = "Maintain";
      refs.foodAimGain.textContent = "Gain";
      return;
    }

    refs.foodTargetValue.textContent = formatNumber(result.target);
    refs.foodBmrValue.textContent = formatNumber(result.bmr);
    refs.foodTdeeValue.textContent = formatNumber(result.tdee);
    refs.foodGoalChip.textContent = getGoalLabel(result.goal);
    refs.foodGoalChip.classList.remove("empty", "loss", "maintenance", "gain");
    refs.foodGoalChip.classList.add(result.goal);

    refs.foodAimLoss.textContent = `${formatNumber(result.lossTarget)} kcal`;
    refs.foodAimMaintenance.textContent = `${formatNumber(result.maintenanceTarget)} kcal`;
    refs.foodAimGain.textContent = `${formatNumber(result.gainTarget)} kcal`;

    if (segments[result.goal]) {
      segments[result.goal].classList.add("active");
    }
  }

  function getBmiCategory(bmi) {
    if (bmi < 18.5) {
      return { label: "Underweight", colorClass: "bmi-underweight" };
    }

    if (bmi < 25) {
      return { label: "Normal", colorClass: "bmi-normal" };
    }

    if (bmi < 30) {
      return { label: "Overweight", colorClass: "bmi-overweight" };
    }

    return { label: "Obese", colorClass: "bmi-obese" };
  }

  function renderBmiCard() {
    if (!refs.bmiValue || !refs.bmiCategory || !refs.bmiPointer) {
      return;
    }

    const bmi = calculateBmi(demoData.profileData.weightKg, demoData.profileData.heightCm);
    const category = getBmiCategory(bmi);
    const clampedBmi = Math.min(40, Math.max(10, bmi));
    const pointerPercent = ((clampedBmi - 10) / 30) * 100;

    refs.bmiValue.textContent = bmi.toFixed(1);
    refs.bmiCategory.textContent = category.label;
    refs.bmiCategory.classList.remove("bmi-underweight", "bmi-normal", "bmi-overweight", "bmi-obese");
    refs.bmiCategory.classList.add(category.colorClass);
    refs.bmiPointer.style.left = `${pointerPercent}%`;
    refs.bmiPointer.classList.remove("bmi-underweight", "bmi-normal", "bmi-overweight", "bmi-obese");
    refs.bmiPointer.classList.add(category.colorClass);

    const zoneMap = {
      "bmi-underweight": refs.bmiZoneUnderweight,
      "bmi-normal": refs.bmiZoneNormal,
      "bmi-overweight": refs.bmiZoneOverweight,
      "bmi-obese": refs.bmiZoneObese,
    };

    Object.values(zoneMap).forEach((zone) => {
      if (zone) {
        zone.classList.remove("active");
      }
    });

    const activeZone = zoneMap[category.colorClass];
    if (activeZone) {
      activeZone.classList.add("active");
    }
  }

  function handleLogWorkout() {
    demoData.steps += 300;
    renderHomeStats();
    showToast("Workout logged (+300 steps).");
  }

  function handleTrackWater() {
    demoData.waterLiters = Number((demoData.waterLiters + 0.25).toFixed(2));
    renderHomeStats();
    showToast("Water tracked (+0.25L).");
  }

  function handleQuickAction(type) {
    if (type === "workout") {
      demoData.steps += 400;
      renderHomeStats();
      showToast("Quick action: workout added (+400 steps).");
    }

    if (type === "water") {
      demoData.waterLiters = Number((demoData.waterLiters + 0.25).toFixed(2));
      renderHomeStats();
      showToast("Quick action: water added (+0.25L).");
    }

    if (type === "food") {
      showScreen("metrics");
      const missingFields = getMissingFoodFields(demoData.profileData);
      if (missingFields.length > 0) {
        renderFoodTargetCard(null);
        showToast(`Please complete ${missingFields.join("/")} in Profile.`);
      } else {
        const result = getFoodTargetResult(demoData.profileData);
        renderFoodTargetCard(result);
      }
      closeQuickActions();
      return;
    }

    if (type === "bmi") {
      showScreen("metrics");
      renderBmiCard();
    }

    closeQuickActions();
  }

  function setWorkoutFilter(filterKey) {
    if (!demoData.workoutsByFilter[filterKey]) {
      return;
    }

    appState.currentWorkoutFilter = filterKey;
    document.querySelectorAll('[data-action="toggle-workout-filter"]').forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === filterKey);
    });

    renderWorkoutList();
  }

  function setMetricsRange(rangeKey) {
    if (!demoData.metricsByRange[rangeKey]) {
      return;
    }

    appState.currentMetricsRange = rangeKey;
    document.querySelectorAll('[data-action="toggle-metrics-range"]').forEach((button) => {
      button.classList.toggle("active", button.dataset.range === rangeKey);
    });

    renderMetricsCards();
  }

  function handleRecalculateCalories() {
    appState.calorieSeriesIndex = (appState.calorieSeriesIndex + 1) % demoData.calorieBalanceSeries.length;

    const metrics = demoData.metricsByRange[appState.currentMetricsRange];
    metrics.calorieBalance = demoData.calorieBalanceSeries[appState.calorieSeriesIndex];
    metrics.calorieMix = demoData.calorieMixSeries[appState.calorieSeriesIndex];

    renderMetricsCards();
    showToast("Calorie calculator refreshed.");
  }

  function bindEvents() {
    document.querySelectorAll("[data-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.target;
        showScreen(target);
      });
    });

    document.querySelectorAll("[data-tab]").forEach((tabButton) => {
      tabButton.addEventListener("click", () => {
        showScreen(tabButton.dataset.tab);
      });
    });

    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "toggle-password") {
          togglePasswordVisibility();
          return;
        }

        if (action === "open-quick-actions") {
          openQuickActions();
          return;
        }

        if (action === "close-quick-actions") {
          closeQuickActions();
          return;
        }

        if (action === "show-toast") {
          handleStubAction(button.dataset.toast);
          return;
        }

        if (action === "log-workout") {
          handleLogWorkout();
          return;
        }

        if (action === "track-water") {
          handleTrackWater();
          return;
        }

        if (action === "quick-action") {
          handleQuickAction(button.dataset.quick);
          return;
        }

        if (action === "toggle-workout-filter") {
          setWorkoutFilter(button.dataset.filter);
          return;
        }

        if (action === "toggle-metrics-range") {
          setMetricsRange(button.dataset.range);
          return;
        }

        if (action === "toggle-profile-edit") {
          toggleProfileEdit(!appState.isProfileEditing);
          return;
        }

        if (action === "save-profile") {
          handleSaveProfile();
          return;
        }

        if (action === "cancel-profile-edit") {
          handleCancelProfileEdit();
          return;
        }

        if (action === "recalculate-calories") {
          handleRecalculateCalories();
        }
      });
    });

    document.querySelectorAll('a[href="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        handleStubAction(link.dataset.toast);
      });
    });

    if (refs.loginForm) {
      refs.loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        showScreen("home");
        showToast(`Welcome back, ${demoData.profileData.name}!`);
      });
    }
  }

  function initApp() {
    bindEvents();
    closeQuickActions();
    loadProfileData();
    renderHomeStats();
    renderWorkoutList();
    renderMetricsCards();
    renderProfileData();
    renderBmiCard();
    renderFoodTargetCard(getFoodTargetResult(demoData.profileData));
    toggleProfileEdit(false);
    showScreen(appState.currentScreen);
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();
