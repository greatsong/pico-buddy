import { useRef } from 'react';

// 사진 촬영/업로드 → AI 분석 (모바일 카메라 지원)
export default function ImageUpload({ onAnalyze, isLoading }) {
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지를 base64로 변환
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      const mediaType = file.type || 'image/jpeg';
      onAnalyze?.({ base64, mediaType });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={isLoading}
        title="사진으로 배선 확인하기"
        style={{
          background: 'transparent', border: '1px solid #333',
          borderRadius: 8, padding: '6px 10px',
          color: '#888', fontSize: 14, cursor: 'pointer',
        }}>
        📷
      </button>
    </>
  );
}
