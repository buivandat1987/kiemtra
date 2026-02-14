
import React, { useEffect } from 'react';
import { SUBJECT_TOPICS } from '../constants';
import { DifficultyLevel, TestConfig, Subject } from '../types';

interface SidebarProps {
  config: TestConfig;
  setConfig: React.Dispatch<React.SetStateAction<TestConfig>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onGenerate, isLoading }) => {
  const isHK1 = config.semester.includes('1');
  const availableTopics = isHK1 
    ? SUBJECT_TOPICS[config.subject].hk1 
    : SUBJECT_TOPICS[config.subject].hk2;

  // Reset topics khi đổi môn học hoặc học kỳ
  useEffect(() => {
    setConfig(prev => ({ ...prev, topics: [] }));
  }, [config.subject, config.semester]);

  const toggleTopic = (topic: string) => {
    const newTopics = config.topics.includes(topic)
      ? config.topics.filter(t => t !== topic)
      : [...config.topics, topic];
    setConfig({ ...config, topics: newTopics });
  };

  const handleLevelChange = (level: DifficultyLevel, value: string) => {
    const numValue = parseInt(value) || 0;
    setConfig({
      ...config,
      levelDistribution: {
        ...config.levelDistribution,
        [level]: numValue
      }
    });
  };

  const totalPercent = (Object.values(config.levelDistribution) as number[]).reduce((a, b) => a + b, 0);

  return (
    <aside className="w-full md:w-80 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 p-6 no-print shadow-sm">
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <i className="fas fa-cog mr-2"></i> Cấu hình chung
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Chọn Môn học</label>
              <select 
                className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-900"
                value={config.subject}
                onChange={(e) => setConfig({...config, subject: e.target.value as Subject})}
              >
                {Object.keys(SUBJECT_TOPICS).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Chọn Học kỳ</label>
              <select 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                value={config.semester}
                onChange={(e) => setConfig({...config, semester: e.target.value as any})}
              >
                <optgroup label="Học kì 1">
                  <option value="Giữa kì 1">Giữa kì 1</option>
                  <option value="Cuối kì 1">Cuối kì 1</option>
                </optgroup>
                <optgroup label="Học kì 2">
                  <option value="Giữa kì 2">Giữa kì 2</option>
                  <option value="Cuối kì 2">Cuối kì 2</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tiêu đề đề thi</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={config.title}
                onChange={(e) => setConfig({...config, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Số câu hỏi</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center"
                  value={config.questionCount}
                  onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Số bộ đề</label>
                <input 
                  type="number" 
                  min="1" max="5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-emerald-700"
                  value={config.testCount}
                  onChange={(e) => setConfig({...config, testCount: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <i className="fas fa-book mr-2"></i> Mạch kiến thức
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
              {config.topics.length} đã chọn
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            {availableTopics.map((topic) => (
              <label key={topic} className="flex items-start space-x-3 cursor-pointer group p-1 rounded hover:bg-white transition-all">
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600"
                  checked={config.topics.includes(topic)}
                  onChange={() => toggleTopic(topic)}
                />
                <span className={`text-xs transition-colors leading-tight ${config.topics.includes(topic) ? 'text-indigo-700 font-bold' : 'text-slate-600 group-hover:text-indigo-500'}`}>
                  {topic}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Mức độ theo TT27</h3>
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {Object.values(DifficultyLevel).map((level) => (
              <div key={level}>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-700">{level}</label>
                  <span className="text-[10px] font-bold text-indigo-600">{config.levelDistribution[level]}%</span>
                </div>
                <input 
                  type="range" 
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  min="0" max="100" step="5"
                  value={config.levelDistribution[level]}
                  onChange={(e) => handleLevelChange(level, e.target.value)}
                />
              </div>
            ))}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 italic">Tổng: {totalPercent}%</span>
              {totalPercent !== 100 && <span className="text-[10px] text-red-500 font-bold">Phải là 100%</span>}
            </div>
          </div>
        </section>

        <button 
          onClick={onGenerate}
          disabled={isLoading || config.topics.length === 0 || totalPercent !== 100}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2
            ${isLoading || config.topics.length === 0 || totalPercent !== 100 ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
        >
          {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>}
          <span>{isLoading ? 'Đang tạo...' : 'Tạo ma trận & Đề'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
