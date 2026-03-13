import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import useAppStore from '../../stores/appStore';
import useChatStore from '../../stores/chatStore';
import useProgressStore from '../../stores/progressStore';
import { callClaudeStream } from '../../lib/api';
import { buildSystemPrompt } from '../../lib/contextBuilder';
import { generateChatMarkdown, downloadMarkdown } from '../../lib/chatLogger';
import { diagnoseError } from '../../data/errorPatterns';
import SENSORS from '../../data/sensors';
import COMMON_MISTAKES from '../../data/commonMistakes';
import CHALLENGES from '../../data/challenges';
import GLOSSARY, { GLOSSARY_PATTERNS } from '../../data/glossary';
import GlossaryTooltip from './GlossaryTooltip';
import MistakeWarning from './MistakeWarning';
import MiniChallenge from './MiniChallenge';
import ErrorDiagnosis from './ErrorDiagnosis';
import SuggestedActions from './SuggestedActions';
import ImageUpload from './ImageUpload';

// AI 튜터 채팅 패널 — 맥락 인식 + 용어 설명 + 에러 진단
export default function ChatPanel() {
  const { selectedSensor, shieldMode } = useAppStore();
  const { messages, isLoading, addMessage, updateLastMessage, setLoading } = useChatStore();
  const { learnedTerms, lastSensor, completedSensors, completedChallenges, learnTerm, updateContext } = useProgressStore();
  const [input, setInput] = useState('');
  const [showMistakes, setShowMistakes] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const chatEndRef = useRef(null);
  const prevSensorRef = useRef(null);

  // 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 센서 선택 시 자동 안내 메시지
  useEffect(() => {
    if (selectedSensor && selectedSensor !== prevSensorRef.current) {
      prevSensorRef.current = selectedSensor;
      const sensor = SENSORS[selectedSensor];
      if (!sensor) return;
      const mode = shieldMode ? 'Grove Shield' : '직접연결';
      const modeData = shieldMode ? sensor.shield : sensor.direct;

      if (modeData) {
        addMessage({
          role: 'assistant',
          text: `**${sensor.icon} ${sensor.name}** (${sensor.model})을 선택했어요!\n\n**연결 방식:** ${mode}\n\n**배선 정보:**\n${modeData.pins.map(p => `- ${p.label}선 → 센서 **${p.sensor}** → Pico **${p.picoName}** (${p.pico}번 핀)`).join('\n')}\n\n${modeData.warning ? `⚠️ **주의:** ${modeData.warning}\n\n` : ''}오른쪽 **배선 가이드** 탭에서 단계별로 따라해보세요!`,
        });
      } else {
        addMessage({
          role: 'assistant',
          text: `**${sensor.icon} ${sensor.name}** (${sensor.model})을 선택했어요!\n\n이 센서는 **${sensor.protocol}** 통신을 사용해요.${sensor.address ? ` I2C 주소는 **${sensor.address}**입니다.` : ''}\n\n배선과 코드는 저에게 질문해주세요! 함께 알아볼게요. 😊`,
        });
      }

      updateContext(selectedSensor, 'sensor_selected');
      setShowMistakes(selectedSensor);
    }
  }, [selectedSensor]);

  // URL 감지
  const detectURL = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput('');
    addMessage({ role: 'user', text: userText });
    setLoading(true);

    // URL 감지 → 웹페이지 분석
    const urls = detectURL(userText);
    if (urls && urls.length > 0) {
      try {
        addMessage({ role: 'assistant', text: `🔗 링크를 분석하고 있어요... 잠시만 기다려주세요!` });
        const res = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urls[0] }),
        });
        const data = await res.json();
        if (data.analysis) {
          addMessage({ role: 'assistant', text: data.analysis });
          setLoading(false);
          return;
        }
      } catch {}
    }

    // 에러 메시지 자동 감지
    const errorDiag = diagnoseError(userText);
    if (errorDiag) {
      addMessage({
        role: 'assistant',
        text: `${errorDiag.emoji} **${errorDiag.cause}**\n\n${errorDiag.explain}\n\n**해결 방법:**\n${errorDiag.solutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${errorDiag.tab === 'wiring' ? '💡 오른쪽 **배선 가이드**에서 연결을 다시 확인해보세요!' : '💡 **코드 탭**에서 코드를 확인해보세요!'}`,
      });
      setLoading(false);
      return;
    }

    // Claude API 스트리밍 호출
    try {
      const systemPrompt = buildSystemPrompt({
        selectedSensor, shieldMode, learnedTerms, lastSensor, completedSensors,
      });

      const apiMessages = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.text }));
      apiMessages.push({ role: 'user', content: userText });

      // 빈 메시지 추가 → 스트리밍으로 채워감
      addMessage({ role: 'assistant', text: '' });

      const reply = await callClaudeStream(apiMessages, systemPrompt, (chunk) => {
        updateLastMessage(chunk);
      });

      // 최종 텍스트로 확정
      updateLastMessage(reply);

      // 새 용어 감지 → 학습 기록에 추가
      GLOSSARY_PATTERNS.forEach(term => {
        if (reply.includes(term) || userText.includes(term)) {
          learnTerm(term);
        }
      });
    } catch (e) {
      addMessage({
        role: 'assistant',
        text: '❌ AI 응답을 받지 못했습니다. 서버가 실행 중인지 확인해주세요.\n\n`node server/index.js` 명령으로 서버를 시작하세요.',
      });
    }
    setLoading(false);
  };

  // 채팅 기록 저장
  const saveChatLog = () => {
    const md = generateChatMarkdown(messages, { selectedSensor, shieldMode, learnedTerms });
    downloadMarkdown(md);
  };

  // 추천 질문 클릭
  const handleSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#0d0d1a', borderRight: '1px solid #1a1a2e',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid #1a1a2e',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 'bold', color: '#00ff88' }}>
            🤖 Pico Buddy
          </div>
          <div style={{ fontSize: 9, color: '#555' }}>Raspberry Pi Pico 2 WH</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={saveChatLog}
            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #333', background: 'transparent', color: '#888', fontSize: 10, cursor: 'pointer' }}
            title="학습 기록 저장">
            📝 기록 저장
          </button>
        </div>
      </div>

      {/* 채팅 메시지 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '92%',
          }}>
            <div style={{
              padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              background: msg.role === 'user' ? '#003322' : '#0d1a0d',
              border: `1px solid ${msg.role === 'user' ? '#00ff8833' : '#1a2a1a'}`,
              fontSize: 12, lineHeight: 1.7, color: '#ddd',
            }}>
              <GlossaryTooltip>
                <ReactMarkdown
                  components={{
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-');
                      if (isBlock) {
                        return (
                          <pre style={{ background: '#0a0a14', border: '1px solid #1a2a1a', borderRadius: 6, padding: 10, overflowX: 'auto', margin: '6px 0' }}>
                            <code style={{ fontSize: 11, color: '#aaffaa' }}>{children}</code>
                          </pre>
                        );
                      }
                      return <code style={{ background: '#1a2a1a', padding: '1px 4px', borderRadius: 3, fontSize: 11, color: '#aaffaa' }}>{children}</code>;
                    },
                    p: ({ children }) => <div style={{ marginBottom: 6 }}>{children}</div>,
                    ul: ({ children }) => <ul style={{ paddingLeft: 16, margin: '4px 0' }}>{children}</ul>,
                    li: ({ children }) => <li style={{ marginBottom: 2 }}>{children}</li>,
                    strong: ({ children }) => <strong style={{ color: '#00ff88' }}>{children}</strong>,
                  }}
                >{msg.text}</ReactMarkdown>
              </GlossaryTooltip>
            </div>
          </div>
        ))}

        {/* 자주 하는 실수 경고 */}
        {showMistakes && COMMON_MISTAKES[showMistakes] && (
          <MistakeWarning
            sensorId={showMistakes}
            mistakes={COMMON_MISTAKES[showMistakes]}
            onDismiss={() => setShowMistakes(null)}
          />
        )}

        {/* 로딩 */}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start', padding: '10px 14px',
            background: '#0d1a0d', borderRadius: 14, fontSize: 12, color: '#555',
          }}>
            ⏳ 생각하는 중...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 추천 질문 */}
      <SuggestedActions
        selectedSensor={selectedSensor}
        onSelect={handleSuggestion}
      />

      {/* 입력창 */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid #1a1a2e',
        display: 'flex', gap: 8,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="질문 입력 또는 에러 메시지 붙여넣기..."
          rows={2}
          style={{
            flex: 1, background: '#0a0a14', border: '1px solid #1a2a1a',
            borderRadius: 8, padding: '8px 10px', color: '#ddd', fontSize: 12,
            resize: 'none', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <ImageUpload
          isLoading={isLoading}
          onAnalyze={async ({ base64, mediaType }) => {
            addMessage({ role: 'user', text: '📷 배선 사진을 보내서 확인 요청' });
            setLoading(true);
            try {
              const sensor = selectedSensor ? SENSORS[selectedSensor] : null;
              const sensorContext = sensor
                ? `현재 센서: ${sensor.name}, 모드: ${shieldMode ? 'Grove Shield' : '직접연결'}`
                : '';
              const res = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64, mediaType, sensorContext }),
              });
              const data = await res.json();
              addMessage({ role: 'assistant', text: data.analysis || '사진을 분석할 수 없습니다.' });
            } catch {
              addMessage({ role: 'assistant', text: '❌ 사진 분석 오류. 서버를 확인해주세요.' });
            }
            setLoading(false);
          }}
        />
        <button onClick={sendMessage} disabled={isLoading}
          style={{
            background: '#00ff88', border: 'none', borderRadius: 8,
            padding: '0 14px', cursor: isLoading ? 'not-allowed' : 'pointer',
            color: '#000', fontWeight: 'bold', fontSize: 16,
            opacity: isLoading ? 0.5 : 1,
          }}>
          ↑
        </button>
      </div>
    </div>
  );
}
