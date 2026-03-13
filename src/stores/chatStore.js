import { create } from 'zustand';

const WELCOME_MSG = {
  role: 'assistant',
  text: `안녕하세요! 👋 저는 **Pico 학습 도우미**예요.

Raspberry Pi Pico 2 WH가 처음이시라면 제가 하나씩 알려드릴게요!

**할 수 있는 것들:**
- 🔌 센서를 선택하면 배선 방법을 단계별로 안내
- 💻 코드의 각 줄이 무슨 뜻인지 설명
- ❌ 에러 메시지를 붙여넣으면 원인과 해결법 진단
- 🎯 재밌는 미니 챌린지로 실력 키우기
- 📝 학습 기록을 파일로 저장

**먼저 왼쪽에서 센서를 골라볼까요?** LED부터 시작하면 가장 쉬워요!`,
};

const useChatStore = create((set, get) => ({
  messages: [WELCOME_MSG],
  isLoading: false,

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  // 스트리밍: 마지막 메시지 텍스트 업데이트
  updateLastMessage: (text) => set((s) => {
    const msgs = [...s.messages];
    if (msgs.length > 0) {
      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], text };
    }
    return { messages: msgs };
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearChat: () => set({ messages: [WELCOME_MSG] }),

  // 채팅 히스토리를 Claude API 형식으로 변환
  getApiMessages: () => {
    return get().messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role,
        content: m.text,
      }));
  },
}));

export default useChatStore;
