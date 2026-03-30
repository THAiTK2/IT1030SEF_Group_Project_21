function renderMetricsByRange(rangeKey = appState.currentMetricsRange) {
  let selectedRange = "week";
  if (["day", "week", "month"].includes(rangeKey)) {
    selectedRange = rangeKey;
  }
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

  let sexAdjustment = -161;
  if (sex === "male") {
    sexAdjustment = 5;
  }
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
    addWeightEntry(weight, bodyFat, date);
    renderGoalSpecificTracking();
    showToast(`Weight logged: ${weight}kg ✓`);
    closeModal("weight");
    document.getElementById("weight-form").reset();
  } catch (error) {
    showToast("Error logging weight. Please try again.");
    console.error(error);
  }
}

function handleFoodFormSubmit(event) {
  event.preventDefault();

  const breakfastInput = document.getElementById("food-breakfast");
  const lunchInput = document.getElementById("food-lunch");
  const dinnerInput = document.getElementById("food-dinner");

  let breakfastValue = 0;
  if (breakfastInput && breakfastInput.value !== "") {
    breakfastValue = Number(breakfastInput.value);
  }

  let lunchValue = 0;
  if (lunchInput && lunchInput.value !== "") {
    lunchValue = Number(lunchInput.value);
  }

  let dinnerValue = 0;
  if (dinnerInput && dinnerInput.value !== "") {
    dinnerValue = Number(dinnerInput.value);
  }

  const allValues = [breakfastValue, lunchValue, dinnerValue];
  const hasInvalidValue = allValues.some((value) => !Number.isFinite(value) || value < 0);
  if (hasInvalidValue) {
    showToast("Please enter valid calories (0 or above).");
    return;
  }

  const record = addFoodIntake(
    Math.round(breakfastValue),
    Math.round(lunchValue),
    Math.round(dinnerValue),
  );

  renderHomeStats();
  showToast(`Food saved: ${record.total} kcal today ✓`);
  closeModal("food");

  const foodForm = document.getElementById("food-form");
  if (foodForm) {
    foodForm.reset();
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
  let isDayView = false;
  if (period === "day") {
    isDayView = true;
  }

  // Pass selectedDate for month view, null for week view
  let selectedDate = null;
  if (period === "month") {
    selectedDate = appState.selectedDate;
  }
  const { labels, dataPoints } = getChartDataByMetric(metric, period, selectedDate);
  const goal = getGoal(metric);

  const canvas = document.getElementById("calorieChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (appState.metricsChartInstance) {
    appState.metricsChartInstance.destroy();
  }

  let pointRadius = 2.5;
  let pointHoverRadius = 5;
  if (isDayView) {
    pointRadius = 4;
    pointHoverRadius = 6;
  }

  let pointBorderColor = "#ffffff";
  if (isDark) {
    pointBorderColor = "#1e4d1e";
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
        pointRadius: pointRadius,
        pointHoverRadius: pointHoverRadius,
        pointBackgroundColor: metricConfig.color,
        pointBorderColor: pointBorderColor,
        pointBorderWidth: 2,
      },
    ],
  };

  if (goal) {
    let goalLineColor = "rgba(249, 115, 22, 0.7)";
    if (isDark) {
      goalLineColor = "rgba(251, 191, 36, 0.75)";
    }

    chartData.datasets.push({
      label: "Goal",
      data: Array(labels.length).fill(goal),
      borderColor: goalLineColor,
      borderDash: [5, 5],
      borderWidth: 1.8,
      fill: false,
      pointRadius: 0,
      tension: 0,
    });
  }

  let axisTextColor = "#64748b";
  let yGridColor = "rgba(148,163,184,0.12)";
  if (isDark) {
    axisTextColor = "#cbd5e1";
    yGridColor = "rgba(148,163,184,0.18)";
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
          labels: { color: axisTextColor },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: axisTextColor },
          grid: {
            color: yGridColor,
            drawBorder: false,
            tickLength: 4,
          },
        },
        x: {
          ticks: { color: axisTextColor },
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
  const summary = document.getElementById("progress-summary-content");

  if (!summary) return;

  let viewRange = "week";
  if (["day", "week", "month"].includes(rangeKey)) {
    viewRange = rangeKey;
  }
  const progress = calculateProgress(metric, viewRange);

  if (!progress) {
    summary.innerHTML = `<p class="summary-empty">No data yet for ${metricConfig.label}</p>`;
    return;
  }

  let direction = "";
  if (metric === "weight" || metric === "bodyFat") {
    if (progress.change <= 0) {
      direction = "↓ down";
    } else {
      direction = "↑ up";
    }
  } else {
    if (progress.change >= 0) {
      direction = "↑ up";
    } else {
      direction = "↓ down";
    }
  }

  let rangeLabel = "Last 7 days";
  if (viewRange === "day") {
    rangeLabel = "Today";
  } else if (viewRange === "month") {
    rangeLabel = "Last 30 days";
  }

  let detailText = `${Math.abs(progress.percentChange)}% ${direction}`;
  if (viewRange === "day") {
    detailText = `Today's change: ${Math.abs(progress.change).toFixed(1)} ${metricConfig.unit} (${direction})`;
  }

  let progressText = `<small class="summary-hint">${rangeLabel}: ${detailText}</small>`;
  if (goal) {
    progressText = `<div class="summary-goal-box">
           <strong>${progress.latest} / ${goal}</strong> ${metricConfig.unit} 
           <br><small>${detailText}</small>
         </div>`;
  }

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
    openModalFromQuickActions("food");
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

  appState.isWorkoutVideoOpen = false;
  appState.openWorkoutKey = "";
  appState.openWorkoutVideoUrl = "";
  appState.openWorkoutTitle = "";

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
