import { useState, useRef, useEffect } from 'react';
import SENSORS, { CATEGORIES, PROTOCOLS, SENSOR_ORDER } from '../data/sensors';

// 32종 센서/액추에이터 카탈로그 — 카테고리 필터 + 검색
export default function SensorCatalog({ selectedSensor, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  // 패널 열릴 때 검색창 포커스
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // 필터링된 센서 목록
  const filtered = SENSOR_ORDER.filter(id => {
    const s = SENSORS[id];
    if (!s) return false;
    if (categoryFilter && s.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.model.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.protocol.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // 카테고리별 그룹핑 (필터 없을 때)
  const grouped = !categoryFilter && !search
    ? Object.keys(CATEGORIES).map(cat => ({
        category: cat,
        sensors: filtered.filter(id => SENSORS[id].category === cat),
      })).filter(g => g.sensors.length > 0)
    : [{ category: null, sensors: filtered }];

  const current = selectedSensor ? SENSORS[selectedSensor] : null;
  const hasData = (id) => !!SENSORS[id]?.shield;

  const handleSelect = (id) => {
    onSelect(id);
    setIsOpen(false);
    setSearch('');
    setCategoryFilter(null);
  };

  return (
    <div ref={panelRef} className="sensor-catalog">
      {/* 컴팩트 헤더 */}
      <button
        className="catalog-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {current ? (
          <div className="catalog-header-inner">
            <span className="catalog-icon">{current.icon}</span>
            <div className="catalog-info">
              <span className="catalog-name">{current.name}</span>
              <span className="catalog-model">{current.model}</span>
            </div>
            <span className={`catalog-protocol ${current.protocol === 'I2C' ? 'p-i2c' : current.protocol === '아날로그' ? 'p-adc' : 'p-dio'}`}>
              {PROTOCOLS[current.protocol]?.label || current.protocol}
            </span>
            <span className="catalog-toggle">{isOpen ? '▲' : '▼'}</span>
          </div>
        ) : (
          <div className="catalog-header-inner">
            <span className="catalog-icon">🔧</span>
            <span className="catalog-placeholder">센서/액추에이터 선택</span>
            <span className="catalog-count">{SENSOR_ORDER.length}종</span>
            <span className="catalog-toggle">▼</span>
          </div>
        )}
      </button>

      {/* 카탈로그 패널 */}
      {isOpen && (
        <div className="catalog-panel">
          {/* 검색 */}
          <div className="catalog-search">
            <input
              ref={searchRef}
              type="text"
              placeholder="센서 이름, 모델명, 프로토콜로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* 카테고리 칩 */}
          <div className="catalog-chips">
            <button
              className={`chip ${!categoryFilter ? 'active' : ''}`}
              onClick={() => setCategoryFilter(null)}
            >
              전체 ({SENSOR_ORDER.length})
            </button>
            {Object.entries(CATEGORIES).map(([cat, { icon, color }]) => {
              const count = SENSOR_ORDER.filter(id => SENSORS[id]?.category === cat).length;
              return (
                <button
                  key={cat}
                  className={`chip ${categoryFilter === cat ? 'active' : ''}`}
                  style={{
                    borderColor: categoryFilter === cat ? color : color + '44',
                    color: categoryFilter === cat ? color : '#888',
                    background: categoryFilter === cat ? color + '15' : 'transparent',
                  }}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                >
                  {icon} {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* 센서 목록 */}
          <div className="catalog-list">
            {grouped.map(({ category, sensors }) => (
              <div key={category || 'all'}>
                {category && (
                  <div className="catalog-category-header" style={{ color: CATEGORIES[category]?.color }}>
                    {CATEGORIES[category]?.icon} {category}
                  </div>
                )}
                <div className="catalog-grid">
                  {sensors.map(id => {
                    const s = SENSORS[id];
                    const isSelected = selectedSensor === id;
                    const ready = hasData(id);
                    return (
                      <button
                        key={id}
                        className={`catalog-card ${isSelected ? 'selected' : ''}`}
                        style={{
                          borderColor: isSelected ? s.color : '#1a1a2e',
                          background: isSelected ? s.color + '15' : '#0a0a14',
                        }}
                        onClick={() => handleSelect(id)}
                      >
                        <div className="card-top">
                          <span className="card-icon">{s.icon}</span>
                          <span
                            className="card-protocol"
                            style={{ color: PROTOCOLS[s.protocol]?.color || '#888' }}
                          >
                            {PROTOCOLS[s.protocol]?.label || s.protocol}
                          </span>
                        </div>
                        <div className="card-name" style={{ color: isSelected ? s.color : '#ddd' }}>
                          {s.name}
                        </div>
                        <div className="card-model">{s.model}</div>
                        <div className="card-desc">{s.description}</div>
                        <div className="card-bottom">
                          <span className="card-diff">
                            {'●'.repeat(s.difficulty)}{'○'.repeat(3 - s.difficulty)}
                          </span>
                          {s.lessons?.length > 0 && (
                            <span className="card-lessons">
                              {s.lessons.map(l => `${l}차시`).join(' ')}
                            </span>
                          )}
                          {ready && <span className="card-ready">데이터</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="catalog-empty">
                검색 결과가 없어요. 다른 키워드로 검색해보세요!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
