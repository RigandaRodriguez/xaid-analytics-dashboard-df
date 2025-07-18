
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Reports from '@/pages/Reports';
import Logging from '@/pages/Logging';
import StudyReport from '@/components/StudyReport';
import NotFound from '@/pages/NotFound';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LoggingProvider } from '@/contexts/LoggingContext';

function App() {
  return (
    <LanguageProvider>
      <LoggingProvider>
        <ReportsProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/logging" element={<Logging />} />
                <Route path="/study/:uid" element={<StudyReport />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ReportsProvider>
      </LoggingProvider>
    </LanguageProvider>
  );
}

export default App;
