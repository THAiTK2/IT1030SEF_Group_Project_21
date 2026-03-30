/** 
1) App state and constants
Purpose: Keep all app-level values in one place.
Inputs: none (initial setup).
Outputs: global objects used by the rest of the file.
Side effects: none.
*/
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
  openWorkoutKey: "",
  openWorkoutVideoUrl: "",
  openWorkoutTitle: "",
};

const STORAGE_KEYS = {
  DAILY_WATER: "fitnessAppWater",
  DAILY_EXERCISE: "fitnessAppExercise",
  DAILY_FOOD: "fitnessAppFood",
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

// Demo data for initial UI and simple fallback values.
// This object is used across Home, Workouts, Metrics, and Profile.
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
        "image/yoga.png",
      videoEmbedUrl: "https://www.youtube.com/embed/o_73FeXw3ZI",
    },
    cardio: {
      title: "Running",
      subtitle: "Advanced • Cardio",
      duration: "32 min",
      image:
        "image/running.jpeg",
      videoEmbedUrl: "https://www.youtube.com/embed/PHXb_VAVpgY",
    },
    strength: {
      title: "Strength Training",
      subtitle: "Advanced • Strength",
      duration: "45 min",
      image:
        "image/Strength.png",
      videoEmbedUrl: "https://www.youtube.com/embed/kdLdwp5R9nQ",
    },
  },
  allWorkoutList: [
    {
      key: "all",
      title: "Morning Mobility Flow",
      subtitle: "Intermediate • Yoga",
      duration: "15 min",
      image: "image/yoga.png",
      videoEmbedUrl: "https://www.youtube.com/embed/o_73FeXw3ZI",
    },
    {
      key: "cardio",
      title: "Running",
      subtitle: "Advanced • Cardio",
      duration: "32 min",
      image: "image/running.jpeg",
      videoEmbedUrl: "https://www.youtube.com/embed/PHXb_VAVpgY",
    },
    {
      key: "strength",
      title: "Strength Training",
      subtitle: "Advanced • Strength",
      duration: "45 min",
      image: "image/Strength.png",
      videoEmbedUrl: "https://www.youtube.com/embed/kdLdwp5R9nQ",
    },
  ],
};



const coreScreens = ["onboarding", "login", "home", "workouts", "metrics", "profile"];
const PROFILE_STORAGE_KEY = "fitnessProfileV1";

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
  waterValue: document.getElementById("water-value"),
  homeWelcomeName: document.getElementById("home-welcome-name"),
  workoutList: document.getElementById("workout-list"),
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

