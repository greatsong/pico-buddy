import SENSORS from '../../data/sensors';
import CHALLENGES from '../../data/challenges';

// 맥락 기반 추천 질문/행동
export default function SuggestedActions({ selectedSensor, onSelect }) {
  let suggestions = [];

  if (!selectedSensor) {
    suggestions = [
      { text: 'LED 깜빡이기부터 시작하고 싶어요', emoji: '💡' },
      { text: 'Pico 2 WH가 뭔가요?', emoji: '🤔' },
      { text: 'Thonny 설치 방법 알려주세요', emoji: '💻' },
    ];
  } else {
    const sensor = SENSORS[selectedSensor];
    const challenges = CHALLENGES[selectedSensor];

    suggestions = [
      { text: `${sensor.name} 배선 방법 알려줘`, emoji: '🔌' },
      { text: `${sensor.name} 코드 설명해줘`, emoji: '💻' },
      { text: `${sensor.name}으로 할 수 있는 재밌는 것?`, emoji: '🎯' },
    ];

    if (challenges && challenges.length > 0) {
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      suggestions[2] = { text: randomChallenge.question, emoji: randomChallenge.emoji };
    }
  }

  return (
    <div style={{
      padding: '6px 12px', display: 'flex', gap: 6, flexWrap: 'wrap',
      borderTop: '1px solid #1a1a2e',
    }}>
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSelect(s.text)}
          style={{
            padding: '4px 10px', borderRadius: 14,
            background: '#0d1a0d', border: '1px solid #1a2a1a',
            color: '#888', fontSize: 10, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#00ff8844'; e.target.style.color = '#00ff88'; }}
          onMouseLeave={e => { e.target.style.borderColor = '#1a2a1a'; e.target.style.color = '#888'; }}>
          {s.emoji} {s.text}
        </button>
      ))}
    </div>
  );
}
