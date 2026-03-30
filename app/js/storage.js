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
    if (data) {
      return JSON.parse(data);
    }
    return {};
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
    if (data) {
      return JSON.parse(data);
    }
    return {};
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

function getFoodData() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_FOOD);
    if (data) {
      return JSON.parse(data);
    }
    return {};
  } catch {
    return {};
  }
}

function saveFoodData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_FOOD, JSON.stringify(data));
  } catch {
    showToast("Unable to save food data.");
  }
}

function addFoodIntake(breakfast, lunch, dinner) {
  const today = getTodayDate();
  const data = getFoodData();

  let safeBreakfast = 0;
  if (Number.isFinite(breakfast)) {
    safeBreakfast = breakfast;
  }

  let safeLunch = 0;
  if (Number.isFinite(lunch)) {
    safeLunch = lunch;
  }

  let safeDinner = 0;
  if (Number.isFinite(dinner)) {
    safeDinner = dinner;
  }
  const total = safeBreakfast + safeLunch + safeDinner;

  data[today] = {
    breakfast: safeBreakfast,
    lunch: safeLunch,
    dinner: safeDinner,
    total: total,
    updatedAt: new Date().toISOString(),
  };

  saveFoodData(data);
  return data[today];
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

function getTodayFoodCalories() {
  const today = getTodayDate();
  const data = getFoodData();
  const todayData = data[today];

  if (todayData && typeof todayData.total === "number") {
    return todayData.total;
  }

  return 0;
}

function getWeightData() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_DATA);
    if (data) {
      return JSON.parse(data);
    }
    return {};
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

function addWeightEntry(weight, bodyFat, date) {
  const data = getWeightData();
  const dateStr = date || getTodayDate();

  data[dateStr] = {
    weight: parseFloat(weight),
    bodyFat: null,
    timestamp: new Date().toISOString(),
  };

  if (bodyFat) {
    data[dateStr].bodyFat = parseFloat(bodyFat);
  }

  saveWeightData(data);
  return data[dateStr];
}

function getLastWeightEntry() {
  const data = getWeightData();
  const dates = Object.keys(data).sort().reverse();
  if (dates.length > 0) {
    return data[dates[0]];
  }
  return null;
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

  if (count > 0) {
    return (sum / count).toFixed(1);
  }
  return null;
}

function loadGoals() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (data) {
      appState.goals = JSON.parse(data);
    } else {
      appState.goals = {};
    }
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
  let endDate = new Date();
  if (selectedDate) {
    endDate = new Date(selectedDate);
  }
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
  let selectedDate = null;
  if (period === "month") {
    selectedDate = appState.selectedDate;
  }
  const chartData = getChartDataByMetric(metric, period, selectedDate);
  const values = chartData.dataPoints.filter((value) => value !== null);

  if (values.length === 0) return null;

  const latest = values[values.length - 1];
  const previous = values[0];
  const change = latest - previous;
  let percentChange = 0;
  if (previous !== 0) {
    percentChange = ((change / previous) * 100).toFixed(1);
  }

  return {
    latest,
    previous,
    change,
    percentChange: percentChange,
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
  if (Object.prototype.hasOwnProperty.call(multipliers, level)) {
    return multipliers[level];
  }
  return null;
}

function getActivityLabel(level) {
  const labels = {
    sedentary: "Sedentary",
    light: "Lightly Active",
    moderate: "Moderately Active",
    very: "Very Active",
    extra: "Extra Active",
  };
  if (Object.prototype.hasOwnProperty.call(labels, level)) {
    return labels[level];
  }
  return "--";
}

function getGoalLabel(goal) {
  const labels = {
    maintenance: "Maintenance",
    loss: "Weight Loss",
    gain: "Weight Gain",
  };
  if (Object.prototype.hasOwnProperty.call(labels, goal)) {
    return labels[goal];
  }
  return "--";
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
