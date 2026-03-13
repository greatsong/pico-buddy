import { create } from 'zustand';

// localStorage에서 진도 불러오기
function loadProgress() {
  try {
    const data = localStorage.getItem('visual-pico-progress');
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function saveProgress(state) {
  try {
    localStorage.setItem('visual-pico-progress', JSON.stringify({
      lastSensor: state.lastSensor,
      lastStep: state.lastStep,
      completedSensors: state.completedSensors,
      completedChallenges: state.completedChallenges,
      learnedTerms: state.learnedTerms,
      isFirstVisit: state.isFirstVisit,
      lastVisit: state.lastVisit,
    }));
  } catch {}
}

const defaults = {
  lastSensor: null,
  lastStep: null,
  completedSensors: [],
  completedChallenges: [],
  learnedTerms: [],
  isFirstVisit: true,
  lastVisit: null,
};

const saved = loadProgress() || defaults;

const useProgressStore = create((set, get) => ({
  ...saved,

  markSensorComplete: (sensorId) => {
    const s = get();
    if (!s.completedSensors.includes(sensorId)) {
      set({ completedSensors: [...s.completedSensors, sensorId] });
      saveProgress(get());
    }
  },

  markChallengeComplete: (challengeId) => {
    const s = get();
    if (!s.completedChallenges.includes(challengeId)) {
      set({ completedChallenges: [...s.completedChallenges, challengeId] });
      saveProgress(get());
    }
  },

  learnTerm: (term) => {
    const s = get();
    if (!s.learnedTerms.includes(term)) {
      set({ learnedTerms: [...s.learnedTerms, term] });
      saveProgress(get());
    }
  },

  isTermLearned: (term) => get().learnedTerms.includes(term),

  updateContext: (sensor, step) => {
    set({ lastSensor: sensor, lastStep: step, lastVisit: new Date().toISOString() });
    saveProgress(get());
  },

  completeFirstVisit: () => {
    set({ isFirstVisit: false, lastVisit: new Date().toISOString() });
    saveProgress(get());
  },

  resetProgress: () => {
    set(defaults);
    localStorage.removeItem('visual-pico-progress');
  },
}));

export default useProgressStore;
