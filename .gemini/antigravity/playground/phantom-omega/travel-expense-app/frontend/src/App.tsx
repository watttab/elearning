import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PermissionForm from './components/PermissionForm';
import ReimbursementForm from './components/ReimbursementForm';
import { FileText } from 'lucide-react';

function App() {
  console.log('App rendering');
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center gap-3">
                  <div className="bg-[#1e3a8a] p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-[#1e3a8a] leading-tight">ระบบขออนุญาตไปราชการ</h1>
                    <p className="text-xs text-[#5d4037]">และขอเบิกค่าใช้จ่ายในการเดินทาง</p>
                  </div>
                </div>
                <div className="hidden sm:ml-10 sm:flex sm:space-x-8 h-full">
                  <Link to="/" className="border-[#d4af37] text-[#1e3a8a] inline-flex items-center px-1 pt-1 border-b-4 text-sm font-semibold h-full hover:bg-slate-50 transition-colors">
                    ขออนุญาตไปราชการ
                  </Link>
                  <Link to="/claims" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-[#5d4037] inline-flex items-center px-1 pt-1 border-b-4 text-sm font-medium h-full transition-colors">
                    เบิกค่าใช้จ่าย
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<PermissionForm />} />
              <Route path="/claims" element={<ReimbursementForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
