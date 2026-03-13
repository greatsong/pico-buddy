import { create } from 'zustand';

const useAppStore = create((set) => ({
  selectedSensor: null,
  shieldMode: true, // true = Grove Shield, false = 직접연결
  activeTab: 'wiring', // 'wiring' | 'code' | 'tips'
  highlightPins: [], // 채팅에서 언급된 핀 하이라이트
  wiringStep: 0, // 배선 가이드 단계 (0 = 전체 보기)

  setSelectedSensor: (sensor) => set({ selectedSensor: sensor, wiringStep: 0 }),
  setShieldMode: (mode) => set({ shieldMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setHighlightPins: (pins) => set({ highlightPins: pins }),
  setWiringStep: (step) => set({ wiringStep: step }),
}));

export default useAppStore;
