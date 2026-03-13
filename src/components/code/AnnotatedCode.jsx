import { useState } from 'react';
import useAppStore from '../../stores/appStore';
import SENSORS from '../../data/sensors';

// 줄별 설명이 달린 코드 뷰어
export default function AnnotatedCode() {
  const selectedSensor = useAppStore(s => s.selectedSensor);
  const shieldMode = useAppStore(s => s.shieldMode);
  const [expandedLine, setExpandedLine] = useState(null);
  const [showAllAnnotations, setShowAllAnnotations] = useState(false);
  const [copied, setCopied] = useState(false);

  const sensorBase = selectedSensor ? SENSORS[selectedSensor] : null;
  const modeData = sensorBase ? (shieldMode ? sensorBase.shield : sensorBase.direct) : null;

  if (!sensorBase || !modeData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💻</div>
        <div style={{ fontSize: 14 }}>센서를 선택하면</div>
        <div style={{ fontSize: 14 }}>줄별 설명이 달린 코드가 나타나요!</div>
      </div>
    );
  }

  const codeLines = modeData.code.split('\n');
  const annotations = modeData.annotations || [];

  const getAnnotation = (lineNum) => annotations.find(a => a.line === lineNum);

  const copyCode = () => {
    navigator.clipboard.writeText(modeData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflow: 'auto' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{sensorBase.icon}</span>
          <span style={{ fontSize: 13, color: sensorBase.color, fontWeight: 'bold' }}>{sensorBase.name}</span>
          <span style={{ fontSize: 11, color: '#555' }}>MicroPython</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setShowAllAnnotations(!showAllAnnotations)}
            style={{
              padding: '4px 10px', borderRadius: 6,
              background: showAllAnnotations ? '#00ff8822' : 'transparent',
              border: `1px solid ${showAllAnnotations ? '#00ff88' : '#333'}`,
              color: showAllAnnotations ? '#00ff88' : '#888',
              fontSize: 10, cursor: 'pointer',
            }}>
            {showAllAnnotations ? '📖 설명 켜짐' : '📖 전체 설명'}
          </button>
          <button onClick={copyCode}
            style={{
              padding: '4px 10px', borderRadius: 6,
              background: copied ? '#00ff88' : 'transparent',
              border: `1px solid ${copied ? '#00ff88' : '#333'}`,
              color: copied ? '#000' : '#888',
              fontSize: 10, cursor: 'pointer',
            }}>
            {copied ? '✓ 복사됨!' : '📋 복사'}
          </button>
        </div>
      </div>

      {/* 코드 + 주석 */}
      <div style={{
        background: '#0a0a14', border: '1px solid #1a1a2e',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {codeLines.map((line, i) => {
          const lineNum = i + 1;
          const annotation = getAnnotation(lineNum);
          const isExpanded = expandedLine === lineNum || (showAllAnnotations && annotation);
          const hasAnnotation = !!annotation;

          return (
            <div key={i}>
              {/* 코드 줄 */}
              <div
                onClick={() => hasAnnotation && setExpandedLine(isExpanded ? null : lineNum)}
                style={{
                  display: 'flex', alignItems: 'flex-start',
                  padding: '3px 12px', cursor: hasAnnotation ? 'pointer' : 'default',
                  background: isExpanded ? '#0d1a2e' : 'transparent',
                  borderLeft: hasAnnotation ? '3px solid #00ff8844' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (hasAnnotation) e.currentTarget.style.background = '#0d1a2e'; }}
                onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* 줄 번호 */}
                <span style={{
                  width: 28, textAlign: 'right', marginRight: 12,
                  fontSize: 10, color: hasAnnotation ? '#00ff8888' : '#333',
                  fontFamily: 'monospace', userSelect: 'none', flexShrink: 0,
                  paddingTop: 2,
                }}>
                  {hasAnnotation ? '💬' : lineNum}
                </span>
                {/* 코드 */}
                <code style={{
                  fontSize: 12, color: '#aaffaa', fontFamily: "'JetBrains Mono', monospace",
                  whiteSpace: 'pre', lineHeight: 1.8,
                }}>
                  {highlightSyntax(line)}
                </code>
              </div>

              {/* 주석 */}
              {isExpanded && annotation && (
                <div style={{
                  padding: '8px 12px 8px 48px',
                  background: '#0a1a2a', borderBottom: '1px solid #1a2a3a',
                  fontSize: 11, color: '#88bbff', lineHeight: 1.6,
                }}>
                  💡 {annotation.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 주의사항 */}
      {modeData.warning && (
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          background: '#2a1a00', border: '1px solid #ff880044',
          fontSize: 11, color: '#ffaa44',
        }}>
          ⚠️ {modeData.warning}
        </div>
      )}

      <div style={{
        padding: '8px 12px', borderRadius: 6,
        background: '#0a1a0a', border: '1px solid #00ff8822',
        fontSize: 10, color: '#00cc66',
      }}>
        💡 Thonny에 코드를 붙여넣고, 초록색 ▶ 버튼을 눌러 실행하세요!
      </div>
    </div>
  );
}

// 간단한 Python 구문 하이라이트
function highlightSyntax(line) {
  if (line.trim().startsWith('#')) {
    return <span style={{ color: '#556655' }}>{line}</span>;
  }
  return line;
}
