import useAppStore from './stores/appStore';
import SENSORS from './data/sensors';
import SensorCatalog from './components/SensorCatalog';
import ChatPanel from './components/chat/ChatPanel';
import PicoBoard from './components/board/PicoBoard';
import WiringGuide from './components/board/WiringGuide';
import AnnotatedCode from './components/code/AnnotatedCode';
import TipsPanel from './components/common/TipsPanel';

export default function App() {
  const { selectedSensor, setSelectedSensor, shieldMode, setShieldMode, activeTab, setActiveTab } = useAppStore();
  const sensor = selectedSensor ? SENSORS[selectedSensor] : null;
  const hasData = sensor?.shield; // 배선/코드 데이터가 있는 센서인지

  return (
    <div className="app-root">
      {/* 왼쪽: 센서 선택 + AI 채팅 */}
      <div className="left-panel">
        {/* 센서 카탈로그 */}
        <SensorCatalog
          selectedSensor={selectedSensor}
          onSelect={(id) => setSelectedSensor(selectedSensor === id ? null : id)}
        />
        {/* AI 채팅 */}
        <div className="chat-container">
          <ChatPanel />
        </div>
      </div>

      {/* 오른쪽: 시각 보드 */}
      <div className="right-panel">
        {/* 탭 바 */}
        <div className="tab-bar">
          {[
            ['wiring', '🔌 배선 가이드'],
            ['pinmap', '📍 핀맵'],
            ['code', '💻 코드'],
            ['tips', '⚠️ 주의사항'],
          ].map(([t, label]) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`tab-btn ${activeTab === t ? 'active' : ''}`}>
              {label}
            </button>
          ))}

          <div className="mode-toggle">
            <button onClick={() => setShieldMode(true)}
              className={`mode-btn ${shieldMode ? 'active-grove' : ''}`}>
              🛡️ Grove
            </button>
            <button onClick={() => setShieldMode(false)}
              className={`mode-btn ${!shieldMode ? 'active-direct' : ''}`}>
              🔌 직접
            </button>
          </div>
        </div>

        {/* 탭 내용 */}
        <div className="tab-content">
          {activeTab === 'wiring' && (
            hasData ? <WiringGuide /> : <NoDataGuide sensor={sensor} tab="wiring" />
          )}
          {activeTab === 'pinmap' && <PicoBoard />}
          {activeTab === 'code' && (
            hasData ? <AnnotatedCode /> : <NoDataGuide sensor={sensor} tab="code" />
          )}
          {activeTab === 'tips' && <TipsPanel />}
        </div>
      </div>
    </div>
  );
}

// 데이터가 아직 없는 센서의 안내 메시지
function NoDataGuide({ sensor, tab }) {
  if (!sensor) {
    return (
      <div className="no-data-guide">
        <div style={{ fontSize: 40, marginBottom: 12 }}>
          {tab === 'wiring' ? '🔌' : '💻'}
        </div>
        <div>센서를 선택하면</div>
        <div>{tab === 'wiring' ? '배선 가이드가' : '코드가'} 나타나요!</div>
      </div>
    );
  }

  return (
    <div className="no-data-guide">
      <div style={{ fontSize: 40, marginBottom: 12 }}>{sensor.icon}</div>
      <div style={{ fontSize: 15, fontWeight: 'bold', color: sensor.color, marginBottom: 8 }}>
        {sensor.name} ({sensor.model})
      </div>
      <div style={{ marginBottom: 16 }}>
        이 센서의 {tab === 'wiring' ? '배선 데이터' : '예제 코드'}는 준비 중이에요!
      </div>
      <div style={{
        padding: '12px 16px', borderRadius: 8,
        background: '#0d1a0d', border: '1px solid #00ff8833',
        maxWidth: 280,
      }}>
        <div style={{ color: '#00ff88', fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>
          💡 AI 튜터에게 물어보세요!
        </div>
        <div style={{ fontSize: 11, color: '#aaa', lineHeight: 1.6 }}>
          왼쪽 채팅에서 아래처럼 질문하면 안내해드려요:
        </div>
        <div style={{
          marginTop: 8, padding: '6px 10px', borderRadius: 6,
          background: '#003322', border: '1px solid #00ff8833',
          fontSize: 11, color: '#88ffaa',
        }}>
          "{sensor.name} {tab === 'wiring' ? '어떻게 연결해?' : '코드 알려줘'}"
        </div>
      </div>
    </div>
  );
}
