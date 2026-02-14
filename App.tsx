
import React, { useState } from 'react';
import { SUBJECT_TOPICS } from './constants';
import { DifficultyLevel, TestConfig, MathTest, MatrixRow } from './types';
import { generateTestMatrix, generateQuestionsFromMatrix } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TestDisplay from './components/TestDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import { exportMatrixToExcel } from './services/exportService';

const App: React.FC = () => {
  const [config, setConfig] = useState<TestConfig>({
    title: 'ĐỀ KIỂM TRA ĐỊNH KỲ CUỐI HỌC KÌ II',
    subject: 'Toán',
    duration: 40,
    grade: 5,
    semester: 'Cuối kì 2',
    topics: [],
    levelDistribution: {
      [DifficultyLevel.LEVEL_1]: 40,
      [DifficultyLevel.LEVEL_2]: 30,
      [DifficultyLevel.LEVEL_3]: 20,
      [DifficultyLevel.LEVEL_4]: 10,
    },
    totalPoints: 10,
    questionCount: 10,
    testCount: 1, 
  });

  const [currentMatrix, setCurrentMatrix] = useState<MatrixRow[] | null>(null);
  const [tests, setTests] = useState<MathTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatError = (err: any) => {
    const msg = err?.message || String(err);
    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
      return "Hệ thống AI của Google đang bận hoặc hết hạn mức miễn phí (Quota). Vui lòng đợi khoảng 1-2 phút rồi bấm 'Tạo lại'.";
    }
    if (msg.includes("500") || msg.includes("503")) {
      return "Máy chủ AI đang gặp sự cố tạm thời. Vui lòng thử lại sau giây lát.";
    }
    return "Đã xảy ra lỗi: " + msg;
  };

  const handleGenerateMatrix = async () => {
    setIsLoading(true);
    setLoadingMsg(`Đang lập ma trận đặc tả môn ${config.subject}...`);
    setError(null);
    setTests([]);
    try {
      const matrix = await generateTestMatrix(config);
      setCurrentMatrix(matrix);
    } catch (err) {
      console.error(err);
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!currentMatrix) return;
    setIsLoading(true);
    setError(null);
    
    const allTests: MathTest[] = [];
    try {
      for (let i = 0; i < config.testCount; i++) {
        setLoadingMsg(`Đang soạn bộ đề môn ${config.subject} số ${i + 1}/${config.testCount}...`);
        
        // Thêm khoảng nghỉ nhỏ giữa các bộ đề để tránh bị block quota
        if (i > 0) await new Promise(resolve => setTimeout(resolve, 3000));

        const questions = await generateQuestionsFromMatrix(currentMatrix, config, i);
        allTests.push({
          id: Math.random().toString(36).substring(7),
          versionName: `Bộ đề số ${i + 1}`,
          config,
          questions,
          matrix: currentMatrix,
          createdAt: new Date().toISOString()
        });
      }
      setTests(allTests);
    } catch (err) {
      console.error(err);
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar config={config} setConfig={setConfig} onGenerate={handleGenerateMatrix} isLoading={isLoading} />

      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <Header subject={config.subject} />
        
        <main className="p-4 md:p-8 flex-1">
          {error && (
            <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-xl shadow-sm animate-in slide-in-from-top-2">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-xl mr-3 text-red-600"></i>
                <div>
                  <h3 className="font-bold">Thông báo từ hệ thống AI</h3>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-red-100 rounded-full transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {!currentMatrix && tests.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 mb-6">
                <i className="fas fa-graduation-cap text-5xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Trợ lý Đa môn học Lớp 5</h3>
              <p className="max-w-md px-6 text-slate-500">
                Hệ thống hỗ trợ soạn đề các môn: Toán, Tiếng Việt, Khoa học, Sử - Địa... theo chương trình Kết nối tri thức và Thông tư 27.
              </p>
            </div>
          )}

          {currentMatrix && tests.length === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Ma trận đề {config.subject} - {config.semester}</h2>
                  <p className="text-indigo-100 opacity-90">Dữ liệu đã sẵn sàng để tạo câu hỏi chi tiết.</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button onClick={() => exportMatrixToExcel(currentMatrix, config)} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center space-x-2 text-sm">
                    <i className="fas fa-file-excel"></i>
                    <span>Xuất Excel</span>
                  </button>
                  <button onClick={handleGenerateQuestions} className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition-all flex items-center space-x-2 text-sm">
                    <i className="fas fa-pen-nib"></i>
                    <span>Bắt đầu soạn đề</span>
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200">
                <MatrixTable matrix={currentMatrix} config={config} />
              </div>
            </div>
          )}

          {tests.length > 0 && <TestDisplay tests={tests} />}
        </main>
      </div>
      {isLoading && <LoadingOverlay customMessage={loadingMsg} />}
    </div>
  );
};

export const MatrixTable: React.FC<{ matrix: MatrixRow[], config: TestConfig }> = ({ matrix, config }) => {
  const totals = matrix.reduce((acc, row) => ({
    l1_pts: acc.l1_pts + row.l1_mcq_pts + row.l1_cr_pts,
    l2_pts: acc.l2_pts + row.l2_mcq_pts + row.l2_cr_pts,
    l3_pts: acc.l3_pts + row.l3_mcq_pts + row.l3_cr_pts,
    l4_pts: acc.l4_pts + row.l4_mcq_pts + row.l4_cr_pts,
  }), { l1_pts: 0, l2_pts: 0, l3_pts: 0, l4_pts: 0 });

  return (
    <div className="overflow-x-auto">
      <h2 className="text-center font-bold text-lg mb-4 text-slate-800 uppercase">MA TRẬN ĐỀ KIỂM TRA MÔN {config.subject}</h2>
      <table className="w-full border-collapse border border-slate-300 text-[11px] text-center">
        <thead>
          <tr className="bg-slate-50">
            <th rowSpan={2} className="border border-slate-300 p-2 w-48">Mạch kiến thức</th>
            <th rowSpan={2} className="border border-slate-300 p-2 w-20">Số câu/điểm</th>
            <th colSpan={2} className="border border-slate-300 p-2">Mức 1</th>
            <th colSpan={2} className="border border-slate-300 p-2">Mức 2</th>
            <th colSpan={2} className="border border-slate-300 p-2">Mức 3</th>
            <th colSpan={2} className="border border-slate-300 p-2">Mức 4</th>
            <th className="border border-slate-300 p-2 bg-indigo-50 font-bold">TỔNG</th>
          </tr>
          <tr className="bg-slate-50">
            <th>TN</th><th>TL</th><th>TN</th><th>TL</th><th>TN</th><th>TL</th><th>TN</th><th>TL</th><th className="bg-indigo-50">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <React.Fragment key={i}>
              <tr>
                <td rowSpan={2} className="border border-slate-300 p-2 text-left font-medium">{row.topic}</td>
                <td className="border border-slate-300 p-1 bg-slate-50/50 italic">Số câu</td>
                <td className="border border-slate-300">{row.l1_mcq || ''}</td><td className="border border-slate-300">{row.l1_cr || ''}</td>
                <td className="border border-slate-300">{row.l2_mcq || ''}</td><td className="border border-slate-300">{row.l2_cr || ''}</td>
                <td className="border border-slate-300">{row.l3_mcq || ''}</td><td className="border border-slate-300">{row.l3_cr || ''}</td>
                <td className="border border-slate-300">{row.l4_mcq || ''}</td><td className="border border-slate-300">{row.l4_cr || ''}</td>
                <td className="border border-slate-300 bg-indigo-50/10 font-bold">{row.l1_mcq+row.l2_mcq+row.l3_mcq+row.l4_mcq+row.l1_cr+row.l2_cr+row.l3_cr+row.l4_cr}</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="border border-slate-300 p-1 italic">Số điểm</td>
                <td className="border border-slate-300">{row.l1_mcq_pts || ''}</td><td className="border border-slate-300">{row.l1_cr_pts || ''}</td>
                <td className="border border-slate-300">{row.l2_mcq_pts || ''}</td><td className="border border-slate-300">{row.l2_cr_pts || ''}</td>
                <td className="border border-slate-300">{row.l3_mcq_pts || ''}</td><td className="border border-slate-300">{row.l3_cr_pts || ''}</td>
                <td className="border border-slate-300">{row.l4_mcq_pts || ''}</td><td className="border border-slate-300">{row.l4_cr_pts || ''}</td>
                <td className="border border-slate-300 font-bold text-indigo-600 bg-indigo-50/20">{row.l1_mcq_pts + row.l1_cr_pts + row.l2_mcq_pts + row.l2_cr_pts + row.l3_mcq_pts + row.l3_cr_pts + row.l4_mcq_pts + row.l4_cr_pts}đ</td>
              </tr>
            </React.Fragment>
          ))}
          <tr className="bg-slate-100 font-bold">
            <td className="border border-slate-300 p-2">TỔNG CỘNG</td>
            <td className="border border-slate-300">Điểm</td>
            <td colSpan={2} className="border border-slate-300">{totals.l1_pts}đ</td>
            <td colSpan={2} className="border border-slate-300">{totals.l2_pts}đ</td>
            <td colSpan={2} className="border border-slate-300">{totals.l3_pts}đ</td>
            <td colSpan={2} className="border border-slate-300">{totals.l4_pts}đ</td>
            <td className="border border-slate-300 bg-indigo-600 text-white">{totals.l1_pts + totals.l2_pts + totals.l3_pts + totals.l4_pts}đ</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
