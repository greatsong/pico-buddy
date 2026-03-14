import { useState, useCallback } from 'react';
import GLOSSARY, { GLOSSARY_PATTERNS } from '../../data/glossary';
import useProgressStore from '../../stores/progressStore';

// 용어 자동 설명 — children 텍스트에서 용어를 찾아 툴팁 표시
export default function GlossaryTooltip({ children }) {
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const { isTermLearned } = useProgressStore();

  // 마우스가 올라간 요소의 텍스트에서 용어를 찾는 이벤트 위임
  const handleMouseMove = useCallback((e) => {
    const target = e.target;
    const text = target.textContent || '';
    if (!text) {
      setHoveredTerm(null);
      return;
    }

    // GLOSSARY_PATTERNS는 긴 용어부터 정렬되어 있음
    for (const term of GLOSSARY_PATTERNS) {
      if (text.includes(term)) {
        setHoveredTerm(term);
        return;
      }
    }
    setHoveredTerm(null);
  }, []);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredTerm(null)}
    >
      {children}

      {/* 툴팁 */}
      {hoveredTerm && GLOSSARY[hoveredTerm] && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          maxWidth: 300, padding: '10px 14px', borderRadius: 10,
          background: '#1a1a3a', border: '1px solid #3a3a5a',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          zIndex: 100, fontSize: 11, color: '#ddd', lineHeight: 1.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span>{GLOSSARY[hoveredTerm].emoji}</span>
            <span style={{ fontWeight: 'bold', color: '#00ff88' }}>
              {GLOSSARY[hoveredTerm].term}
            </span>
            <span style={{ color: '#888' }}>= {GLOSSARY[hoveredTerm].simple}</span>
          </div>
          <div style={{ color: '#aaa' }}>{GLOSSARY[hoveredTerm].explain}</div>
        </div>
      )}
    </div>
  );
}
