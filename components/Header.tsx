
import React from 'react';
import { Subject } from '../types';

interface HeaderProps {
  subject: Subject;
}

const Header: React.FC<HeaderProps> = ({ subject }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 no-print">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
          <i className={`fas ${subject === 'Toán' ? 'fa-calculator' : subject === 'Tiếng Việt' ? 'fa-pen-fancy' : 'fa-graduation-cap'} text-xl`}></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">Trợ lý Ra đề {subject} 5</h1>
          <p className="text-xs text-slate-500 font-medium">Chuẩn Thông tư 27 & Kết nối tri thức</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-indigo-600 transition-colors">Hướng dẫn</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Thư viện đề</a>
        <button 
          onClick={() => window.print()} 
          className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
        >
          <i className="fas fa-print mr-2"></i> In đề thi
        </button>
      </div>
    </header>
  );
};

export default Header;
