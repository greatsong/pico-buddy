import { useState } from 'react';
import useProgressStore from '../../stores/progressStore';

// 센서별 미니 챌린지 카드
export default function MiniChallenge({ challenge, sensorColor, onComplete }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { markChallengeComplete } = useProgressStore();

  if (!challenge) return null;

  const typeLabel = {
    predict: '🤔 예측해보기',
    experiment: '🔬 실험해보기',
    mission: '🎯 미션',
  }[challenge.type] || '🎯 도전';

  const handleComplete = () => {
    setCompleted(true);
    markChallengeComplete(challenge.id);
    onComplete?.(challenge);
  };

  return (
    <div style={{
      alignSelf: 'flex-start', maxWidth: '95%',
      background: '#0d0d2a', border: `1px solid ${sensorColor}44`,
      borderRadius: 12, padding: '14px 16px', margin: '4px 0',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 8,
          background: sensorColor + '22', border: `1px solid ${sensorColor}`,
          color: sensorColor,
        }}>{typeLabel}</span>
        <span style={{ fontSize: 10, color: '#555' }}>미니 챌린지</span>
      </div>

      {/* 질문 */}
      <div style={{ fontSize: 12, color: '#ddd', lineHeight: 1.7, marginBottom: 10 }}>
        {challenge.emoji} {challenge.question}
      </div>

      {/* 후속 질문 (예측/실험) */}
      {challenge.followUp && !completed && (
        <button onClick={handleComplete}
          style={{
            padding: '6px 14px', borderRadius: 6,
            background: sensorColor + '22', border: `1px solid ${sensorColor}`,
            color: sensorColor, fontSize: 11, cursor: 'pointer',
            marginBottom: 6,
          }}>
          확인하기! →
        </button>
      )}

      {/* 힌트 (미션) */}
      {challenge.hint && !showHint && !completed && (
        <button onClick={() => setShowHint(true)}
          style={{
            padding: '4px 12px', borderRadius: 6,
            background: 'transparent', border: '1px solid #555',
            color: '#888', fontSize: 10, cursor: 'pointer', marginRight: 6,
          }}>
          💡 힌트 보기
        </button>
      )}

      {showHint && !showSolution && (
        <div style={{
          padding: '8px 10px', borderRadius: 6,
          background: '#1a1a0a', border: '1px solid #ffaa0044',
          fontSize: 11, color: '#ffaa00', marginBottom: 6,
        }}>
          💡 {challenge.hint}
        </div>
      )}

      {/* 정답 보기 */}
      {challenge.solution && !showSolution && !completed && (
        <button onClick={() => { setShowSolution(true); handleComplete(); }}
          style={{
            padding: '4px 12px', borderRadius: 6,
            background: 'transparent', border: '1px solid #555',
            color: '#888', fontSize: 10, cursor: 'pointer',
          }}>
          🔓 정답 보기
        </button>
      )}

      {showSolution && (
        <div style={{
          padding: '8px 10px', borderRadius: 6,
          background: '#0a2a0a', border: '1px solid #00ff8844',
          fontSize: 11, color: '#00ff88', marginTop: 6,
        }}>
          ✅ {challenge.solution}
        </div>
      )}

      {/* 완료 후 후속 */}
      {completed && challenge.followUp && (
        <div style={{
          padding: '8px 10px', borderRadius: 6,
          background: '#0a2a0a', border: '1px solid #00ff8844',
          fontSize: 11, color: '#aaffaa', marginTop: 6, lineHeight: 1.6,
        }}>
          {challenge.followUp}
        </div>
      )}

      {completed && (
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#00ff88' }}>
          🎉 잘했어요!
        </div>
      )}
    </div>
  );
}
