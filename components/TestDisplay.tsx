
import React, { useState } from 'react';
import { MathTest, QuestionType } from '../types';
import { exportTestToWord, exportMatrixToExcel, exportAnswersToWord, exportMatrixToWord } from '../services/exportService';

interface TestDisplayProps {
  tests: MathTest[];
}

const TestDisplay: React.FC<TestDisplayProps> = ({ tests }) => {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'test' | 'matrix' | 'answers'>('test');

  const test = tests[currentTestIndex];
  const isTiengViet = test.config.subject === 'Tiếng Việt';
  
  const mcqs = test.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE);
  const crs = test.questions.filter(q => q.type === QuestionType.CONSTRUCTIVE_RESPONSE);

  const handleExport = () => {
    if (activeTab === 'test') {
      exportTestToWord(test);
    } else if (activeTab === 'answers') {
      exportAnswersToWord(test);
    } else if (activeTab === 'matrix') {
      exportMatrixToExcel(test.matrix, test.config);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          {tests.length > 1 && (
            <div className="flex bg-indigo-50 p-1 rounded-xl border border-indigo-100">
              {tests.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentTestIndex(idx)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentTestIndex === idx ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-600 hover:bg-white'}`}
                >
                  {t.versionName}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-1 space-x-1 p-1 bg-slate-200/50 rounded-xl">
            <button onClick={() => setActiveTab('test')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'test' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}>Đề thi</button>
            <button onClick={() => setActiveTab('matrix')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'matrix' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}>Ma trận</button>
            <button onClick={() => setActiveTab('answers')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'answers' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}>Đáp án</button>
          </div>
        </div>

        <div className="flex space-x-2">
           {activeTab === 'matrix' && (
             <button onClick={() => exportMatrixToWord(test.matrix, test.config)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-md">
                <i className="fas fa-file-word"></i><span>Xuất Word</span>
             </button>
           )}
           <button onClick={handleExport} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center space-x-2 shadow-md">
              <i className={activeTab === 'matrix' ? 'fas fa-file-excel' : 'fas fa-file-word'}></i>
              <span>{activeTab === 'matrix' ? 'Xuất Excel' : 'Tải file Word'}</span>
            </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-12 min-h-[900px] font-serif text-[#1a1a1a]">
        {activeTab === 'test' && (
          <div className="max-w-4xl mx-auto">
            {/* Real header layout */}
            <div className="grid grid-cols-12 border-2 border-black mb-0">
              <div className="col-span-5 border-r-2 border-black p-4 space-y-2 text-sm">
                <p className="font-bold">Trường: ...........................................</p>
                <p className="font-bold">Họ và tên: .......................................</p>
                <p className="font-bold">Lớp: .................................................</p>
              </div>
              <div className="col-span-7 p-4 text-center uppercase">
                <h1 className="font-bold text-base leading-tight">{test.config.title}</h1>
                <p className="font-bold text-sm">Năm học 2024 - 2025</p>
                <p className="font-bold text-sm">Môn: {test.config.subject}</p>
                <p className="italic text-xs lowercase mt-1">(Thời gian làm bài: {test.config.duration} phút)</p>
              </div>
            </div>

            {/* Score table */}
            <div className="grid grid-cols-12 border-x-2 border-b-2 border-black mb-10">
              <div className="col-span-3 border-r-2 border-black">
                <p className="text-center font-bold border-b-2 border-black py-1 text-sm">Điểm</p>
                <div className="h-24"></div>
              </div>
              <div className="col-span-9">
                <p className="text-center font-bold border-b-2 border-black py-1 text-sm">Lời phê của thầy cô giáo</p>
                <div className="p-3 space-y-3">
                  <p className="border-b border-black border-dotted h-4 w-full"></p>
                  <p className="border-b border-black border-dotted h-4 w-full"></p>
                </div>
              </div>
            </div>

            {isTiengViet ? (
              <div className="space-y-6">
                 <h2 className="font-bold text-base uppercase">A. KIỂM TRA ĐỌC (10 điểm)</h2>
                 <p className="ml-4 italic text-sm">I. Đọc thành tiếng (3 điểm): (Giáo viên cho học sinh bốc thăm bài đọc)</p>
                 <p className="ml-4 italic text-sm">II. Đọc hiểu kiến thức Tiếng Việt (7 điểm):</p>
                 <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center italic text-slate-500 my-6">
                    [Hệ thống sẽ tự động chèn ngữ liệu văn bản phù hợp với chủ điểm tại đây]
                 </div>
                 {test.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).map((q, idx) => (
                    <div key={q.id} className="mb-4">
                       <p className="mb-2"><span className="font-bold">Câu {idx+1}:</span> {q.content} ({q.points}đ)</p>
                       <div className="grid grid-cols-2 gap-2 pl-6">
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx}><span className="font-bold">{String.fromCharCode(65+oIdx)}.</span> {opt}</div>
                          ))}
                       </div>
                    </div>
                 ))}
                 <h2 className="font-bold text-base uppercase mt-10">B. KIỂM TRA VIẾT (10 điểm)</h2>
                 {test.questions.filter(q => q.type === QuestionType.CONSTRUCTIVE_RESPONSE && q.content.toLowerCase().includes('viết')).map((q, idx) => (
                    <div key={q.id} className="mb-4">
                       <p className="italic mb-6">{q.content}</p>
                       <div className="text-center font-bold mb-4">BÀI LÀM</div>
                       <div className="space-y-6">
                          {[...Array(15)].map((_, i) => <div key={i} className="border-b border-slate-200 border-dotted h-6"></div>)}
                       </div>
                    </div>
                 ))}
              </div>
            ) : (
              <div className="space-y-8">
                 <section>
                    <h3 className="font-bold text-base mb-4 uppercase">I. PHẦN TRẮC NGHIỆM</h3>
                    {mcqs.map((q, idx) => (
                      <div key={q.id} className="mb-6">
                        <p className="mb-2 leading-relaxed"><span className="font-bold">Câu {idx + 1}:</span> {q.content} ({q.points}đ)</p>
                        <div className="grid grid-cols-2 gap-4 pl-6">
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="text-sm">
                              <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                 </section>
                 <section>
                    <h3 className="font-bold text-base mb-4 uppercase">II. PHẦN TỰ LUẬN</h3>
                    {crs.map((q, idx) => (
                      <div key={q.id} className="mb-10">
                        <p className="mb-4 leading-relaxed"><span className="font-bold">Câu {mcqs.length + idx + 1}:</span> {q.content} ({q.points}đ)</p>
                        <div className="space-y-6 pl-6">
                          {[...Array(4)].map((_, i) => <div key={i} className="border-b border-slate-200 border-dotted h-6"></div>)}
                        </div>
                      </div>
                    ))}
                 </section>
              </div>
            )}
            <div className="mt-20 text-center italic text-sm text-slate-400">--- HẾT ---</div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="matrix-sheet overflow-x-auto text-xs">
            <h2 className="text-center font-bold text-xl mb-6 uppercase">Ma trận đề thi chuẩn TT27</h2>
            <table className="w-full border-collapse border border-black text-center">
              <thead>
                <tr className="bg-slate-50">
                  <th rowSpan={2} className="border border-black p-2">Mạch kiến thức</th>
                  <th rowSpan={2} className="border border-black p-2">Số câu/điểm</th>
                  <th colSpan={2} className="border border-black p-2">Mức 1</th>
                  <th colSpan={2} className="border border-black p-2">Mức 2</th>
                  <th colSpan={2} className="border border-black p-2">Mức 3</th>
                  <th colSpan={2} className="border border-black p-2">Mức 4</th>
                  <th colSpan={3} className="border border-black p-2">TỔNG</th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="border border-black p-1">TN</th><th className="border border-black p-1">TL</th>
                  <th className="border border-black p-1">TN</th><th className="border border-black p-1">TL</th>
                  <th className="border border-black p-1">TN</th><th className="border border-black p-1">TL</th>
                  <th className="border border-black p-1">TN</th><th className="border border-black p-1">TL</th>
                  <th className="border border-black p-1">TN</th><th className="border border-black p-1">TL</th><th className="border border-black p-1">Cộng</th>
                </tr>
              </thead>
              <tbody>
                {test.matrix.map((row, i) => (
                  <React.Fragment key={i}>
                    <tr>
                      <td rowSpan={2} className="border border-black p-2 text-left">{row.topic}</td>
                      <td className="border border-black p-1 italic bg-slate-50">Số câu</td>
                      <td className="border border-black">{row.l1_mcq || '-'}</td><td className="border border-black">{row.l1_cr || '-'}</td>
                      <td className="border border-black">{row.l2_mcq || '-'}</td><td className="border border-black">{row.l2_cr || '-'}</td>
                      <td className="border border-black">{row.l3_mcq || '-'}</td><td className="border border-black">{row.l3_cr || '-'}</td>
                      <td className="border border-black">{row.l4_mcq || '-'}</td><td className="border border-black">{row.l4_cr || '-'}</td>
                      <td className="border border-black font-bold">{(row.l1_mcq+row.l2_mcq+row.l3_mcq+row.l4_mcq) || '-'}</td>
                      <td className="border border-black font-bold">{(row.l1_cr+row.l2_cr+row.l3_cr+row.l4_cr) || '-'}</td>
                      <td className="border border-black font-bold">{(row.l1_mcq+row.l1_cr+row.l2_mcq+row.l2_cr+row.l3_mcq+row.l3_cr+row.l4_mcq+row.l4_cr) || '-'}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 italic bg-slate-50">Số điểm</td>
                      <td className="border border-black">{row.l1_mcq_pts || '-'}</td><td className="border border-black">{row.l1_cr_pts || '-'}</td>
                      <td className="border border-black">{row.l2_mcq_pts || '-'}</td><td className="border border-black">{row.l2_cr_pts || '-'}</td>
                      <td className="border border-black">{row.l3_mcq_pts || '-'}</td><td className="border border-black">{row.l3_cr_pts || '-'}</td>
                      <td className="border border-black">{row.l4_mcq_pts || '-'}</td><td className="border border-black">{row.l4_cr_pts || '-'}</td>
                      <td colSpan={3} className="border border-black font-bold bg-slate-100 text-indigo-700">{(row.l1_mcq_pts+row.l1_cr_pts+row.l2_mcq_pts+row.l2_cr_pts+row.l3_mcq_pts+row.l3_cr_pts+row.l4_mcq_pts+row.l4_cr_pts)}đ</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'answers' && (
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-center font-bold text-xl mb-6 uppercase">Hướng dẫn chấm & Đáp án</h2>
            {test.questions.map((q, idx) => (
              <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0">
                <p className="font-bold mb-2">Câu {idx + 1}: <span className="text-emerald-700">{q.answer}</span></p>
                {q.explanation && <p className="text-sm italic text-slate-500 bg-slate-50 p-4 rounded-xl">Ghi chú: {q.explanation}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDisplay;
