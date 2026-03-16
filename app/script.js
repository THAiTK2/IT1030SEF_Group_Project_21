// ================================
// 1) App state and constants
// Purpose: Keep all app-level values in one place.
// Inputs: none (initial setup).
// Outputs: global objects used by the rest of the file.
// Side effects: none.
// ================================
  const appState = {
    currentScreen: "onboarding",
    currentTab: "home",
    isQuickActionsOpen: false,
    isProfileEditing: false,
    isPasswordVisible: false,
    toastTimer: null,
    currentWorkoutFilter: "all",
    currentMetricsRange: "week",
    calorieChart: null,
    metricsChartInstance: null,
    currentMetric: "calories",
    goals: {},
    selectedDate: new Date().toISOString().split('T')[0],
    isWorkoutVideoOpen: false,
    themeCheckTimer: null,
    themeWatcherInitialized: false,
  };

  const STORAGE_KEYS = {
    DAILY_WATER: "fitnessAppWater",
    DAILY_EXERCISE: "fitnessAppExercise",
    WEIGHT_DATA: "fitnessAppWeight",
    GOALS: "fitnessAppGoals",
  };

  const CALORIE_BURN_RATES = {
    running: 10,
    walking: 5,
    cycling: 9,
    swimming: 12,
    HIIT: 14,
    yoga: 3,
    gym: 8,
    sports: 11,
  };

  const METRIC_CONFIG = {
    calories: {
      label: "Calories Burned",
      unit: "kcal",
      color: "#ef4444",
      getter: (data) => {
        if (data && typeof data.totalCalories === "number") {
          return data.totalCalories;
        }
        return 0;
      },
    },
    weight: {
      label: "Weight",
      unit: "kg",
      color: "#3b82f6",
      getter: (data) => {
        if (data && typeof data.weight === "number") {
          return data.weight;
        }
        return null;
      },
    },
    activity: {
      label: "Activity Minutes",
      unit: "min",
      color: "#8b5cf6",
      getter: (data) => {
        if (data && typeof data.totalMins === "number") {
          return data.totalMins;
        }
        return 0;
      },
    },
    bodyFat: {
      label: "Body Fat %",
      unit: "%",
      color: "#f97316",
      getter: (data) => {
        if (data && typeof data.bodyFat === "number") {
          return data.bodyFat;
        }
        return null;
      },
    },
  };

  const demoData = {
    goal: 10000,
    steps: 8245,
    waterLiters: 1.8,
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
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCB96crVE7AFULLtcIM0tt6_MgwBfaPsbQFMGDI5sE3EYQDd1whySoEOiXXrxP78gdKD-OJi03SRkCigmsUZwSQsXigQU8wUirhXfg_ESwkMULtlDdvhqMv77nMUArgISSwO5l5Wqm1rzHhfzhxe7HA1QfiJ9g0IEnJpJgSWIafHj6uVQqODePPoJ5J73G4kKy60AkzwSYUIDY7458w-ahSP0M4ks1gaFWplG7zoyBpk8BTJRyLWADF2xtKA9Cf7X5ZedNcHfjIF40",
        videoEmbedUrl:
          "https://www.youtube.com/embed/o_73FeXw3ZI",
      },
      cardio: {
        title: "Running",
        subtitle: "Advanced • Cardio",
        duration: "32 min",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCB96crVE7AFULLtcIM0tt6_MgwBfaPsbQFMGDI5sE3EYQDd1whySoEOiXXrxP78gdKD-OJi03SRkCigmsUZwSQsXigQU8wUirhXfg_ESwkMULtlDdvhqMv77nMUArgISSwO5l5Wqm1rzHhfzhxe7HA1QfiJ9g0IEnJpJgSWIafHj6uVQqODePPoJ5J73G4kKy60AkzwSYUIDY7458w-ahSP0M4ks1gaFWplG7zoyBpk8BTJRyLWADF2xtKA9Cf7X5ZedNcHfjIF40",
        videoEmbedUrl:
          "https://www.youtube.com/embed/PHXb_VAVpgY",
      },
      strength: {
        title: "Strength Training",
        subtitle: "Advanced • Strength",
        duration: "45 min",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCWu5IjotFueEgOMzznobnZJ1Bv6QlBqfTIJtHfTAIZ_YlohlaGDH56frdr8pyWoKoNh1dZdfrvWJLs9G8Umm4tcLbiulYFC1I3qj-EI7JUsBF4IwP-6dogaZFiz5BmiIClGPc51aaxdyw1KXZkkbNcBt0CN_s6L0LSCQRPgceX5ZvIm9nOyOL4PnwSJqxN1S2sI2Jnf4h4lgXfXFsydpAQW4jE6JaYmfCe-4aXH3KNoi-b1ZjprIOQ1l35eQSQo8nsbRqWMD3IlRM",
        videoEmbedUrl:
          "https://www.youtube.com/embed/kdLdwp5R9nQ",
      },
    },
  };

  const coreScreens = ["onboarding", "login", "home", "workouts", "metrics", "profile"];
  const PROFILE_STORAGE_KEY = "fitnessProfileV1";
  const THEME_OVERRIDE_STORAGE_KEY = "appThemeManualOverrideV1";
  const LEGACY_THEME_STORAGE_KEY = "appTheme";
  const THEME_CHECK_INTERVAL_MS = 60 * 1000;

  // ================================
  // 2) DOM references
  // Purpose: Cache HTML elements once, then reuse them.
  // Inputs: existing DOM ids/classes.
  // Outputs: refs object.
  // Side effects: none.
  // ================================
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
    workoutVideoTitle: document.getElementById("workout-video-title"),
    workoutVideoTrigger: document.getElementById("workout-video-trigger"),
    workoutVideoPanel: document.getElementById("workout-video-panel"),
    workoutVideoIframe: document.getElementById("workout-video-iframe"),
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

  // Format number with comma separators (e.g. 12000 -> 12,000)
  function formatNumber(value) {
    return value.toLocaleString("en-US");
  }

  // ================================
  // 3) Local storage helpers
  // Purpose: Read/write user data from browser storage.
  // Inputs: keys + function parameters.
  // Outputs: plain JS objects/values.
  // Side effects: updates localStorage.
  // ================================
  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  function getWaterData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_WATER);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function saveWaterData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_WATER, JSON.stringify(data));
    } catch {
      showToast("Unable to save water data.");
    }
  }

  function getExerciseData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_EXERCISE);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function saveExerciseData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_EXERCISE, JSON.stringify(data));
    } catch {
      showToast("Unable to save exercise data.");
    }
  }

  function addWaterIntake(amountMl) {
    const today = getTodayDate();
    const data = getWaterData();
    const todayData = data[today] || { entries: [], total: 0 };
    
    todayData.entries.push({
      amount: amountMl,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
    todayData.total += amountMl;
    
    data[today] = todayData;
    saveWaterData(data);
    return amountMl; // return in ml
  }

  function addExercise(type, durationMins, intensity, time) {
    const today = getTodayDate();
    const data = getExerciseData();
    const todayData = data[today] || { entries: [], totalMins: 0, totalCalories: 0 };
    
    const baseCalories = CALORIE_BURN_RATES[type] || 5;
    const intensityMultiplier = { low: 0.8, medium: 1, high: 1.2 }[intensity] || 1;
    const caloriesBurned = Math.round(baseCalories * durationMins * intensityMultiplier);
    
    todayData.entries.push({
      type,
      duration: durationMins,
      intensity,
      calories: caloriesBurned,
      time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
    todayData.totalMins += durationMins;
    todayData.totalCalories += caloriesBurned;
    
    data[today] = todayData;
    saveExerciseData(data);
    return { calories: caloriesBurned, totalCalories: todayData.totalCalories };
  }

  function getTodayWater() {
    const today = getTodayDate();
    const data = getWaterData();
    const todayData = data[today];

    if (todayData && typeof todayData.total === "number") {
      return todayData.total;
    }

    return 0;
  }

  function getTodayExerciseStats() {
    const today = getTodayDate();
    const data = getExerciseData();
    const todayData = data[today];

    let totalMins = 0;
    let totalCalories = 0;

    if (todayData && typeof todayData.totalMins === "number") {
      totalMins = todayData.totalMins;
    }

    if (todayData && typeof todayData.totalCalories === "number") {
      totalCalories = todayData.totalCalories;
    }

    return {
      totalMins: totalMins,
      totalCalories: totalCalories,
    };
  }

  function getChartData(period) {
    const exerciseData = getExerciseData();
    const today = new Date();
    const dataPoints = [];
    const labels = [];

    let daysBack = period === "week" ? 7 : 30;

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const data = exerciseData[dateStr];
      if (data && typeof data.totalCalories === "number") {
        dataPoints.push(data.totalCalories);
      } else {
        dataPoints.push(0);
      }
      
      if (period === "week") {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }

    return { labels, dataPoints };
  }

  function getWeightData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_DATA);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function saveWeightData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHT_DATA, JSON.stringify(data));
    } catch {
      showToast("Unable to save weight data.");
    }
  }

  function addWeightEntry(weight, bodyFat, biceps, date) {
    const data = getWeightData();
    const dateStr = date || getTodayDate();
    
    data[dateStr] = {
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      biceps: biceps ? parseFloat(biceps) : null,
      timestamp: new Date().toISOString(),
    };
    
    saveWeightData(data);
    return data[dateStr];
  }

  function getLastWeightEntry() {
    const data = getWeightData();
    const dates = Object.keys(data).sort().reverse();
    return dates.length > 0 ? data[dates[0]] : null;
  }

  function getWeeklyActivityTotal() {
    const exerciseData = getExerciseData();
    const today = new Date();
    let totalMins = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const data = exerciseData[dateStr];
      if (data && typeof data.totalMins === "number") {
        totalMins += data.totalMins;
      }
    }

    return totalMins;
  }

  function getAverageWeightLastWeek() {
    const data = getWeightData();
    const today = new Date();
    let sum = 0;
    let count = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (data[dateStr]) {
        sum += data[dateStr].weight;
        count++;
      }
    }

    return count > 0 ? (sum / count).toFixed(1) : null;
  }

  function loadGoals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      appState.goals = data ? JSON.parse(data) : {};
    } catch {
      appState.goals = {};
    }
  }

  function saveGoals() {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(appState.goals));
    } catch {
      showToast("Unable to save goals.");
    }
  }

  function setGoal(metric, value) {
    appState.goals[metric] = parseFloat(value);
    saveGoals();
    return appState.goals[metric];
  }

  function getGoal(metric) {
    return appState.goals[metric] || null;
  }

  function getChartDataByMetric(metric, period, selectedDate = null) {
    const endDate = selectedDate ? new Date(selectedDate) : new Date();
    let daysBack = 30;
    if (period === "day") {
      daysBack = 1;
    } else if (period === "week") {
      daysBack = 7;
    }

    const dataPoints = [];
    const labels = [];

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      let value = 0;

      if (metric === "calories") {
        const exerciseData = getExerciseData();
        const dayData = exerciseData[dateStr];
        if (dayData && typeof dayData.totalCalories === "number") {
          value = dayData.totalCalories;
        } else {
          value = 0;
        }
      } else if (metric === "weight") {
        const weightData = getWeightData();
        const dayData = weightData[dateStr];
        if (dayData && typeof dayData.weight === "number") {
          value = dayData.weight;
        } else {
          value = null;
        }
      } else if (metric === "activity") {
        const exerciseData = getExerciseData();
        const dayData = exerciseData[dateStr];
        if (dayData && typeof dayData.totalMins === "number") {
          value = dayData.totalMins;
        } else {
          value = 0;
        }
      } else if (metric === "bodyFat") {
        const weightData = getWeightData();
        const dayData = weightData[dateStr];
        if (dayData && typeof dayData.bodyFat === "number") {
          value = dayData.bodyFat;
        } else {
          value = null;
        }
      }

      dataPoints.push(value);

      if (period === "day") {
        labels.push("Today");
      } else if (period === "week") {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }

    return { labels, dataPoints };
  }

  function calculateProgress(metric, period) {
    const selectedDate = period === "month" ? appState.selectedDate : null;
    const chartData = getChartDataByMetric(metric, period, selectedDate);
    const values = chartData.dataPoints.filter((value) => value !== null);
    
    if (values.length === 0) return null;

    const latest = values[values.length - 1];
    const previous = values[0];
    const change = latest - previous;

    return {
      latest,
      previous,
      change,
      percentChange: previous !== 0 ? ((change / previous) * 100).toFixed(1) : 0,
    };
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

  function getGoalTrackingTargets(goal) {
    // Return different tracking targets based on goal
    const targets = {
      loss: {
        label: "Weight Loss",
        waterTarget: 3.5, // More water for weight loss
        calorieDeficit: 500, // Try to burn 500 extra calories
        description: "Aim for calorie deficit",
        color: "#ef4444", // Red
      },
      maintenance: {
        label: "Maintenance",
        waterTarget: 3.0, // Standard water
        calorieDeficit: 0, // Maintain
        description: "Maintain current weight",
        color: "#3b82f6", // Blue
      },
      gain: {
        label: "Weight Gain",
        waterTarget: 3.0, // Standard water
        calorieDeficit: -300, // Need 300 extra calories (surplus)
        description: "Aim for calorie surplus",
        color: "#22c55e", // Green
      },
    };
    return targets[goal] || targets.maintenance;
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

  // Validate profile form values and convert to clean data.
  // Input: raw form object.
  // Output: { valid, data/message }.
  // Side effect: none.
  function normalizeProfileData(rawData) {
    const source = rawData || {};
    const safeAgeRaw = source.age;
    const safeSex = String(source.sex || "").trim().toLowerCase();
    const safeActivityLevel = String(source.activityLevel || "").trim().toLowerCase();
    const safeGoal = String(source.goal || "").trim().toLowerCase();

    const normalized = {
      name: String(source.name || "").trim(),
      heightCm: Number(source.heightCm),
      weightKg: Number(source.weightKg),
      sport: String(source.sport || "").trim(),
      hobby: String(source.hobby || "").trim(),
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

  // Render profile values to both Home and Profile screens.
  // Input: demoData.profileData.
  // Output: updated DOM text/inputs.
  // Side effect: refreshes BMI and Food target cards.
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
      name: refs.profileInputName ? refs.profileInputName.value : "",
      heightCm: refs.profileInputHeight ? refs.profileInputHeight.value : "",
      weightKg: refs.profileInputWeight ? refs.profileInputWeight.value : "",
      sport: refs.profileInputSport ? refs.profileInputSport.value : "",
      hobby: refs.profileInputHobby ? refs.profileInputHobby.value : "",
      age: refs.profileInputAge ? refs.profileInputAge.value : "",
      sex: refs.profileInputSex ? refs.profileInputSex.value : "",
      activityLevel: refs.profileInputActivity ? refs.profileInputActivity.value : "",
      goal: refs.profileInputGoal ? refs.profileInputGoal.value : "",
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
    refs.passwordInput.type = appState.isPasswordVisible ? "text" : "password";
    refs.passwordIcon.textContent = appState.isPasswordVisible ? "visibility_off" : "visibility";
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
    const progress = Math.min((demoData.steps / demoData.goal) * 100, 100);

    if (refs.stepsCurrentValue) {
      refs.stepsCurrentValue.textContent = formatNumber(demoData.steps);
    }

    if (refs.stepsProgressFill) {
      refs.stepsProgressFill.style.width = `${progress.toFixed(2)}%`;
    }

    if (refs.stepsPercentLabel) {
      refs.stepsPercentLabel.textContent = `${Math.round(progress)}%`;
    }

    if (refs.stepsRing) {
      refs.stepsRing.style.setProperty("--value", String(Math.round(progress)));
    }
    
    // Get real water data
    const waterMl = getTodayWater();
    const waterLiters = (waterMl / 1000).toFixed(2);
    if (refs.waterValue) refs.waterValue.textContent = waterLiters;
    
    // Get real exercise data
    const exerciseStats = getTodayExerciseStats();
    const todayCaloriesEl = document.getElementById("today-calories");
    const todayExerciseMinsEl = document.getElementById("today-exercise-mins");
    
    if (todayCaloriesEl) todayCaloriesEl.textContent = exerciseStats.totalCalories;
    if (todayExerciseMinsEl) todayExerciseMinsEl.textContent = exerciseStats.totalMins;

    // Update goal-specific tracking
    renderGoalSpecificTracking();
  }

  function renderGoalSpecificTracking() {
    const userGoal = demoData.profileData.goal || "maintenance";
    const targets = getGoalTrackingTargets(userGoal);
    
    // Update water target
    const waterTarget = document.querySelector(".target");
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
    
    if (calorieLabel) {
      if (userGoal === "loss") {
        calorieLabel.textContent = "Calorie Deficit";
        const caloriesNeeded = targets.calorieDeficit;
        const caloriesBurned = exerciseStats.totalCalories;
        const deficit = caloriesNeeded - caloriesBurned;
        if (calorieValue) {
          calorieValue.innerHTML = `
            <span class="tracking-delta ${deficit > 0 ? "tracking-delta-danger" : "tracking-delta-success"}">${Math.abs(deficit)}</span>
            <span class="tracking-total">/${caloriesNeeded}</span> kcal
          `;
        }
      } else if (userGoal === "gain") {
        calorieLabel.textContent = "Calorie Surplus Needed";
        const caloriesNeeded = Math.abs(targets.calorieDeficit);
        const caloriesBurned = exerciseStats.totalCalories;
        const remaining = caloriesNeeded - caloriesBurned;
        if (calorieValue) {
          calorieValue.innerHTML = `
            <span class="tracking-delta ${remaining > 0 ? "tracking-delta-info" : "tracking-delta-success"}">${Math.abs(remaining)}</span>
            <span class="tracking-total">/${caloriesNeeded}</span> kcal
          `;
        }
      } else {
        calorieLabel.textContent = "Calories Burned";
        if (calorieValue) {
          calorieValue.textContent = exerciseStats.totalCalories + " kcal";
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
          lastWeightEl.textContent = lastWeight 
            ? `Last weight: ${lastWeight.weight}kg${lastWeight.bodyFat ? ` (${lastWeight.bodyFat}% BF)` : ""}`
            : "No weight logged yet - Start tracking today!";
        }
      }
    } else if (userGoal === "maintenance") {
      if (maintenanceInfo) {
        maintenanceInfo.style.display = "block";
        const avgWeight = getAverageWeightLastWeek();
        const stabilityEl = document.getElementById("weight-stability");
        if (stabilityEl) {
          stabilityEl.textContent = avgWeight 
            ? `Weekly avg: ${avgWeight}kg - Monitor for stability ±2kg`
            : "Log weights 2-3 times weekly";
        }
      }
    } else if (userGoal === "gain") {
      if (muscleGainInfo) {
        muscleGainInfo.style.display = "block";
        const lastWeight = getLastWeightEntry();
        const muscleProgressEl = document.getElementById("muscle-progress");
        if (muscleProgressEl) {
          muscleProgressEl.textContent = lastWeight 
            ? `Last: ${lastWeight.weight}kg${lastWeight.biceps ? ` | Arms: ${lastWeight.biceps}cm` : ""} - Track measurements weekly`
            : "Log weight and measurements to track muscle gains";
        }
      }
    }
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

    if (refs.workoutVideoTitle) {
      refs.workoutVideoTitle.textContent = `${workout.title} Preview`;
    }
  }

  function openWorkoutVideo() {
    if (!refs.workoutVideoPanel || !refs.workoutVideoIframe || !refs.workoutVideoTrigger) {
      return;
    }

    const workout = demoData.workoutsByFilter[appState.currentWorkoutFilter];
    let videoEmbedUrl = "";
    if (workout && typeof workout.videoEmbedUrl === "string") {
      videoEmbedUrl = workout.videoEmbedUrl;
    }

    if (!videoEmbedUrl) {
      showToast("Video preview is unavailable for this workout.");
      return;
    }

    if (refs.workoutVideoIframe.src !== videoEmbedUrl) {
      refs.workoutVideoIframe.src = videoEmbedUrl;
    }

    refs.workoutVideoPanel.classList.remove("hidden");
    refs.workoutVideoTrigger.classList.add("active");
    refs.workoutVideoTrigger.setAttribute("aria-expanded", "true");
    appState.isWorkoutVideoOpen = true;
  }

  function closeWorkoutVideo() {
    if (!refs.workoutVideoPanel || !refs.workoutVideoIframe || !refs.workoutVideoTrigger) {
      return;
    }

    refs.workoutVideoPanel.classList.add("hidden");
    refs.workoutVideoTrigger.classList.remove("active");
    refs.workoutVideoTrigger.setAttribute("aria-expanded", "false");
    refs.workoutVideoIframe.src = "about:blank";
    appState.isWorkoutVideoOpen = false;
  }

  function toggleWorkoutVideo() {
    if (appState.isWorkoutVideoOpen) {
      closeWorkoutVideo();
      return;
    }

    openWorkoutVideo();
  }

  // Main metrics renderer by selected time range.
  // Input: "day" | "week" | "month".
  // Output: refreshed chart + summary.
  // Side effect: may show/hide month date picker.
  function renderMetricsByRange(rangeKey = appState.currentMetricsRange) {
    const selectedRange = ["day", "week", "month"].includes(rangeKey) ? rangeKey : "week";
    appState.currentMetricsRange = selectedRange;

    const datePickerInput = document.getElementById("month-date-picker");
    let dateControlGroup = null;
    if (datePickerInput) {
      dateControlGroup = datePickerInput.closest(".tracking-control-group");
    }

    if (selectedRange === "month") {
      if (dateControlGroup) dateControlGroup.style.display = "grid";

      const today = new Date().toISOString().split("T")[0];
      if (datePickerInput && !datePickerInput.value) {
        datePickerInput.value = today;
      }
      if (datePickerInput && datePickerInput.value) {
        appState.selectedDate = datePickerInput.value;
      } else {
        appState.selectedDate = today;
      }
    } else {
      if (dateControlGroup) dateControlGroup.style.display = "none";
    }

    renderMetricsChart(selectedRange);
    updateProgressSummary(selectedRange);
  }

  function renderMetricsCards() {
    renderMetricsByRange(appState.currentMetricsRange);
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

  function openModal(modalId) {
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (!modal) return;

    const showModal = () => {
      modal.classList.add("active");
    };

    if (appState.isQuickActionsOpen) {
      closeQuickActions();
      requestAnimationFrame(showModal);
      return;
    }

    showModal();
  }

  function closeModal(modalId) {
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (modal) {
      modal.classList.remove("active");
    }
  }

  function handleWaterFormSubmit(event) {
    event.preventDefault();
    const amountInput = document.getElementById("water-amount");
    const amount = parseInt(amountInput.value);
    
    if (!amount || amount <= 0) {
      showToast("Please enter a valid water amount (1-5000 ml)");
      return;
    }
    
    if (amount > 5000) {
      showToast("Maximum 5000 ml per entry");
      return;
    }
    
    try {
      addWaterIntake(amount);
      renderHomeStats();
      showToast(`Water logged: ${amount}ml ✓`);
      closeModal("water");
      // Reset form
      document.getElementById("water-form").reset();
    } catch (error) {
      showToast("Error logging water. Please try again.");
      console.error(error);
    }
  }

  function handleExerciseFormSubmit(event) {
    event.preventDefault();
    const type = document.getElementById("exercise-type").value;
    const duration = parseInt(document.getElementById("exercise-duration").value);
    const intensity = document.getElementById("exercise-intensity").value;
    
    if (!type) {
      showToast("Please select an exercise type");
      return;
    }
    
    if (!duration || duration <= 0 || duration > 480) {
      showToast("Please enter a valid duration (1-480 minutes)");
      return;
    }
    
    try {
      const result = addExercise(type, duration, intensity);
      renderHomeStats();
      showToast(`Exercise logged: ${result.calories} kcal burned ✓`);
      closeModal("exercise");
      // Reset form
      document.getElementById("exercise-form").reset();
      // Reset calorie estimate
      document.getElementById("exercise-info").style.display = "none";
    } catch (error) {
      showToast("Error logging exercise. Please try again.");
      console.error(error);
    }
  }

  function handleWeightFormSubmit(event) {
    event.preventDefault();
    const weight = document.getElementById("weight-value").value;
    const bodyFat = document.getElementById("body-fat").value;
    const biceps = document.getElementById("measurement-biceps").value;
    const date = document.getElementById("weight-time").value;
    
    if (!weight || parseFloat(weight) <= 0) {
      showToast("Please enter a valid weight");
      return;
    }
    
    if (parseFloat(weight) < 20 || parseFloat(weight) > 300) {
      showToast("Weight must be between 20-300 kg");
      return;
    }

    try {
      addWeightEntry(weight, bodyFat, biceps, date);
      renderGoalSpecificTracking();
      showToast(`Weight logged: ${weight}kg ✓`);
      closeModal("weight");
      document.getElementById("weight-form").reset();
    } catch (error) {
      showToast("Error logging weight. Please try again.");
      console.error(error);
    }
  }

  function updateCalorieEstimate() {
    const type = document.getElementById("exercise-type").value;
    const duration = parseInt(document.getElementById("exercise-duration").value) || 0;
    const intensity = document.getElementById("exercise-intensity").value;

    if (type && duration > 0) {
      const baseCalories = CALORIE_BURN_RATES[type] || 5;
      const intensityMultiplier = { low: 0.8, medium: 1, high: 1.2 }[intensity] || 1;
      const estimated = Math.round(baseCalories * duration * intensityMultiplier);
      
      const infoDiv = document.getElementById("exercise-info");
      const caloriesSpan = document.getElementById("estimated-calories");
      caloriesSpan.textContent = estimated;
      infoDiv.style.display = "block";
    }
  }

  // Draw line chart for selected metric and selected period.
  // Input: period ("day" | "week" | "month").
  // Output: Chart.js instance on #calorieChart.
  // Side effect: destroys previous chart instance to avoid overlap.
  function renderMetricsChart(period) {
    const metric = appState.currentMetric || "calories";
    const metricConfig = METRIC_CONFIG[metric];
    const appRoot = document.getElementById("app");
    let isDark = false;
    if (appRoot && appRoot.getAttribute("data-theme") === "dark") {
      isDark = true;
    }
    const isDayView = period === "day";
    
    // Pass selectedDate for month view, null for week view
    const selectedDate = period === "month" ? appState.selectedDate : null;
    const { labels, dataPoints } = getChartDataByMetric(metric, period, selectedDate);
    const goal = getGoal(metric);

    const canvas = document.getElementById("calorieChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (appState.metricsChartInstance) {
      appState.metricsChartInstance.destroy();
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: metricConfig.label,
          data: dataPoints,
          borderColor: metricConfig.color,
          backgroundColor: metricConfig.color + "10",
          tension: 0.6,
          borderWidth: 3,
          borderJoinStyle: "round",
          borderCapStyle: "round",
          fill: true,
          pointRadius: isDayView ? 4 : 2.5,
          pointHoverRadius: isDayView ? 6 : 5,
          pointBackgroundColor: metricConfig.color,
          pointBorderColor: isDark ? "#1e4d1e" : "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    };

    if (goal) {
      chartData.datasets.push({
        label: "Goal",
        data: Array(labels.length).fill(goal),
        borderColor: isDark ? "rgba(251, 191, 36, 0.75)" : "rgba(249, 115, 22, 0.7)",
        borderDash: [5, 5],
        borderWidth: 1.8,
        fill: false,
        pointRadius: 0,
        tension: 0,
      });
    }

    appState.metricsChartInstance = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: isDark ? "#cbd5e1" : "#64748b" },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: isDark ? "#cbd5e1" : "#64748b" },
            grid: {
              color: isDark ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.12)",
              drawBorder: false,
              tickLength: 4,
            },
          },
          x: {
            ticks: { color: isDark ? "#cbd5e1" : "#64748b" },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
        },
      },
    });
  }

  function updateGoalInputSection() {
    const metric = appState.currentMetric || "calories";
    const metricConfig = METRIC_CONFIG[metric];
    const goalLabel = document.getElementById("goal-input-label");
    const goalInput = document.getElementById("goal-input-value");
    const currentGoal = getGoal(metric);

    if (goalLabel) {
      goalLabel.innerHTML = `Set Your ${metricConfig.label} Goal <span class="goal-label-unit">(${metricConfig.unit})</span>`;
    }
    if (goalInput) {
      goalInput.placeholder = `Enter target ${metricConfig.unit}`;
      goalInput.value = currentGoal || "";
    }

    updateProgressSummary(appState.currentMetricsRange);
  }

  function updateProgressSummary(rangeKey = appState.currentMetricsRange) {
    const metric = appState.currentMetric || "calories";
    const metricConfig = METRIC_CONFIG[metric];
    const goal = getGoal(metric);
    const summary =
      document.getElementById("progress-summary-content") ||
      document.getElementById("progress-summary");

    if (!summary) return;

    const viewRange = ["day", "week", "month"].includes(rangeKey) ? rangeKey : "week";
    const progress = calculateProgress(metric, viewRange);

    if (!progress) {
      summary.innerHTML = `<p class="summary-empty">No data yet for ${metricConfig.label}</p>`;
      return;
    }

    const direction = metric === "weight" || metric === "bodyFat"
      ? progress.change <= 0 ? "↓ down" : "↑ up"
      : progress.change >= 0 ? "↑ up" : "↓ down";

    const rangeLabel = {
      day: "Today",
      week: "Last 7 days",
      month: "Last 30 days",
    }[viewRange];

    const detailText = viewRange === "day"
      ? `Today's change: ${Math.abs(progress.change).toFixed(1)} ${metricConfig.unit} (${direction})`
      : `${Math.abs(progress.percentChange)}% ${direction}`;

    const progressText = goal
      ? `<div class="summary-goal-box">
           <strong>${progress.latest} / ${goal}</strong> ${metricConfig.unit} 
           <br><small>${detailText}</small>
         </div>`
      : `<small class="summary-hint">${rangeLabel}: ${detailText}</small>`;

    summary.innerHTML = `
      <div class="summary-main">
        <strong>${progress.latest} ${metricConfig.unit}</strong>
        <small>${rangeLabel}</small>
      </div>
      ${progressText}
    `;
  }

  // Handle quick action buttons by action type.
  // Input: action name from data-quick.
  // Output: updates UI/data based on selected action.
  // Side effect: can show toast, navigate screen, and close quick sheet.
  function handleQuickAction(type) {
    // Quick workout: add demo steps and refresh Home data.
    if (type === "workout") {
      demoData.steps += 400;
      renderHomeStats();
      showToast("Quick action: workout added (+400 steps).");
    // Quick water: add demo water amount and refresh Home data.
    } else if (type === "water") {
      demoData.waterLiters = Number((demoData.waterLiters + 0.25).toFixed(2));
      renderHomeStats();
      showToast("Quick action: water added (+0.25L).");
    // Food: move to metrics and render daily calorie target from profile.
    } else if (type === "food") {
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
    // BMI: move to metrics and refresh BMI card (no toast by requirement).
    } else if (type === "bmi") {
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

    if (appState.isWorkoutVideoOpen) {
      closeWorkoutVideo();
    }

    renderWorkoutList();
  }

  function setMetricsRange(rangeKey) {
    const validRanges = ["day", "week", "month"];
    if (!validRanges.includes(rangeKey)) {
      return;
    }

    appState.currentMetricsRange = rangeKey;
    document.querySelectorAll('[data-action="toggle-metrics-range"]').forEach((button) => {
      button.classList.toggle("active", button.dataset.range === rangeKey);
    });

    renderMetricsByRange(rangeKey);
  }

  // ================================
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
        toggleWorkoutVideo();
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
  // 5) Theme logic (auto + manual)
  // Purpose: Auto theme by time (18:00-06:00 dark) with temporary manual override.
  // Inputs: local time + theme button clicks.
  // Outputs: effective theme on #app[data-theme].
  // Side effects: reads/writes localStorage + starts interval watcher.
  // ================================
  function isDarkTime(now = new Date()) {
    const hour = now.getHours();
    return hour >= 18 || hour < 6;
  }

  function getNextThemeBoundary(now = new Date()) {
    const boundary = new Date(now);
    boundary.setSeconds(0, 0);

    const hour = now.getHours();
    if (hour < 6) {
      boundary.setHours(6, 0, 0, 0);
      return boundary.getTime();
    }

    if (hour < 18) {
      boundary.setHours(18, 0, 0, 0);
      return boundary.getTime();
    }

    boundary.setDate(boundary.getDate() + 1);
    boundary.setHours(6, 0, 0, 0);
    return boundary.getTime();
  }

  function getAutoTheme(now = new Date()) {
    return isDarkTime(now) ? "dark" : "light";
  }

  function loadThemeOverride() {
    try {
      const raw = localStorage.getItem(THEME_OVERRIDE_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      const isValidTheme = parsed && (parsed.theme === "light" || parsed.theme === "dark");
      const isValidExpiry = parsed && Number.isFinite(parsed.expiresAt);
      if (!isValidTheme || !isValidExpiry) {
        localStorage.removeItem(THEME_OVERRIDE_STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch (_error) {
      localStorage.removeItem(THEME_OVERRIDE_STORAGE_KEY);
      return null;
    }
  }

  function clearExpiredOverride(now = new Date()) {
    const override = loadThemeOverride();
    if (!override) {
      return null;
    }

    if (now.getTime() >= override.expiresAt) {
      localStorage.removeItem(THEME_OVERRIDE_STORAGE_KEY);
      return null;
    }

    return override;
  }

  function saveThemeOverride(theme, expiresAt) {
    const payload = { theme, expiresAt };
    localStorage.setItem(THEME_OVERRIDE_STORAGE_KEY, JSON.stringify(payload));
  }

  function updateThemeSwitcherLabel(effectiveTheme) {
    const themeSwitcher = document.getElementById("theme-switcher");
    if (!themeSwitcher) {
      return;
    }

    if (effectiveTheme === "dark") {
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

  // Apply final theme: manual override (if not expired) OR automatic time rule.
  function applyThemeByRule(now = new Date()) {
    const manualOverride = clearExpiredOverride(now);
    const effectiveTheme = manualOverride ? manualOverride.theme : getAutoTheme(now);
    applyTheme(effectiveTheme);
    return effectiveTheme;
  }

  function setManualOverride(theme) {
    const now = new Date();
    const expiresAt = getNextThemeBoundary(now);
    saveThemeOverride(theme, expiresAt);
    applyTheme(theme);
  }

  function migrateLegacyThemeSetting() {
    const legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (legacyTheme !== "light" && legacyTheme !== "dark") {
      localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
      return;
    }

    const existingOverride = loadThemeOverride();
    if (!existingOverride) {
      const expiresAt = getNextThemeBoundary(new Date());
      saveThemeOverride(legacyTheme, expiresAt);
    }

    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  }

  function initThemeAutomation() {
    migrateLegacyThemeSetting();
    applyThemeByRule();

    if (appState.themeCheckTimer) {
      clearInterval(appState.themeCheckTimer);
    }

    appState.themeCheckTimer = setInterval(() => {
      applyThemeByRule();
    }, THEME_CHECK_INTERVAL_MS);

    if (!appState.themeWatcherInitialized) {
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          applyThemeByRule();
        }
      });
      appState.themeWatcherInitialized = true;
    }
  }

  function switchTheme() {
    const appRoot = document.getElementById("app");
    if (!appRoot) {
      return;
    }

    const currentTheme = appRoot.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setManualOverride(nextTheme);
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
    initThemeAutomation();
    
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
