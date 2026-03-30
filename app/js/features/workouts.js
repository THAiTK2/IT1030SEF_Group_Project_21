function renderWorkoutList() {
  if (!refs.workoutList) {
    return;
  }

  let workoutsToShow = [];
  if (appState.currentWorkoutFilter === "all") {
    workoutsToShow = demoData.allWorkoutList;
  } else {
    const singleWorkout = demoData.workoutsByFilter[appState.currentWorkoutFilter];
    if (singleWorkout) {
      const workoutWithKey = {
        key: appState.currentWorkoutFilter,
        title: singleWorkout.title,
        subtitle: singleWorkout.subtitle,
        duration: singleWorkout.duration,
        image: singleWorkout.image,
        videoEmbedUrl: singleWorkout.videoEmbedUrl,
      };
      workoutsToShow = [workoutWithKey];
    }
  }

  let html = "";
  workoutsToShow.forEach(function (workout) {
    html += `
      <button
        type="button"
        class="card mini-workout workout-video-trigger"
        data-action="toggle-workout-video"
        data-workout-key="${workout.key}"
        data-video-url="${workout.videoEmbedUrl}"
        data-video-title="${workout.title}"
        aria-expanded="false"
        aria-controls="workout-video-panel">
        <img src="${workout.image}" alt="${workout.title}" />
        <div>
          <h4>${workout.title}</h4>
          <p>${workout.subtitle}</p>
          <strong class="green">${workout.duration}</strong>
        </div>
      </button>
    `;

    if (appState.isWorkoutVideoOpen && appState.openWorkoutKey === workout.key) {
      html += `
        <div id="workout-video-panel" class="card workout-video-panel workout-inline-panel">
          <div class="workout-video-header">
            <h4 id="workout-video-title">${appState.openWorkoutTitle} Preview</h4>
            <button
              type="button"
              class="icon-btn small-icon"
              data-action="close-workout-video"
              aria-label="Close workout video preview">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="workout-video-frame">
            <iframe
              id="workout-video-iframe"
              title="Workout video preview"
              src="${appState.openWorkoutVideoUrl}"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen></iframe>
          </div>
        </div>
      `;
    }
  });

  refs.workoutList.innerHTML = html;

  const workoutButtons = refs.workoutList.querySelectorAll('[data-action="toggle-workout-video"]');
  workoutButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      toggleWorkoutVideo(button);
    });

    button.classList.remove("active");
    button.setAttribute("aria-expanded", "false");
    if (appState.isWorkoutVideoOpen && button.dataset.workoutKey === appState.openWorkoutKey) {
      button.classList.add("active");
      button.setAttribute("aria-expanded", "true");
    }
  });

  const closeVideoButtons = refs.workoutList.querySelectorAll('[data-action="close-workout-video"]');
  closeVideoButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      closeWorkoutVideo();
    });
  });
}

function openWorkoutVideo(triggerButton) {
  if (!triggerButton) {
    return;
  }

  let workoutKey = "";
  if (triggerButton.dataset.workoutKey) {
    workoutKey = triggerButton.dataset.workoutKey;
  }

  let videoEmbedUrl = "";
  if (triggerButton.dataset.videoUrl && typeof triggerButton.dataset.videoUrl === "string") {
    videoEmbedUrl = triggerButton.dataset.videoUrl;
  }

  if (!videoEmbedUrl) {
    showToast("Video preview is unavailable for this workout.");
    return;
  }

  let videoTitle = "";
  if (triggerButton.dataset.videoTitle) {
    videoTitle = triggerButton.dataset.videoTitle;
  }

  appState.openWorkoutKey = workoutKey;
  appState.openWorkoutVideoUrl = videoEmbedUrl;
  appState.openWorkoutTitle = videoTitle;
  appState.isWorkoutVideoOpen = true;
  renderWorkoutList();
}

function closeWorkoutVideo() {
  appState.openWorkoutKey = "";
  appState.openWorkoutVideoUrl = "";
  appState.openWorkoutTitle = "";
  appState.isWorkoutVideoOpen = false;
  renderWorkoutList();
}

function toggleWorkoutVideo(triggerButton) {
  if (!triggerButton) {
    return;
  }

  let clickedWorkoutKey = "";
  if (triggerButton.dataset.workoutKey) {
    clickedWorkoutKey = triggerButton.dataset.workoutKey;
  }

  if (appState.isWorkoutVideoOpen && clickedWorkoutKey === appState.openWorkoutKey) {
    closeWorkoutVideo();
    return;
  }

  openWorkoutVideo(triggerButton);
}

// Main metrics renderer by selected time range.
// Input: "day" | "week" | "month".
// Output: refreshed chart + summary.
// Side effect: may show/hide month date picker.
