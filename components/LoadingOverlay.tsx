
import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  customMessage?: string;
}

const DEFAULT_MESSAGES = [
  "Đang nghiên cứu chương trình Toán 5...",
  "Đang phân bổ câu hỏi theo Thông tư 27...",
  "Đang thiết kế các tình huống thực tế cho bài toán...",
  "Đang lập ma trận đặc tả đề thi...",
  "Chuẩn bị hoàn tất dữ liệu..."
];

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ customMessage }) => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
           <i className="fas fa-brain text-3xl animate-pulse"></i>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Hệ thống đang xử lý</h2>
      <p className="text-indigo-600 font-semibold text-lg max-w-lg">
        {customMessage || DEFAULT_MESSAGES[msgIdx]}
      </p>
      
      {!customMessage && (
        <p className="text-slate-400 text-sm mt-4 animate-pulse">
          {DEFAULT_MESSAGES[(msgIdx + 1) % DEFAULT_MESSAGES.length]}
        </p>
      )}
      
      <div className="mt-12 w-full max-w-xs px-4">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiến trình AI</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Gemini 3 Flash</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 animate-[loading_10s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
