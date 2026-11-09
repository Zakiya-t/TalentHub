import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DemoBanner } from './components/layout/DemoBanner';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// All 12 Pages
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { ExploreJobsPage } from './pages/ExploreJobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { InterviewCenterPage } from './pages/InterviewCenterPage';
import { OffersInsightsPage } from './pages/OffersInsightsPage';
import { RecruiterWorkspacePage } from './pages/RecruiterWorkspacePage';
import { CoordinatorConsolePage } from './pages/CoordinatorConsolePage';

const AppLayout: React.FC = () => {
  const location = useLocation();

  // Public standalone pages without sidebar
  const isPublicPage = 
    location.pathname === '/' || 
    location.pathname === '/signin' || 
    location.pathname === '/register';

  return (
    <div className="app-container">
      {/* Interactive Evaluation Banner at very top */}
      <DemoBanner />

      {/* Main Header */}
      <Header />

      {/* Main Workspace / Viewport */}
      {isPublicPage ? (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      ) : (
        <div className="workspace-layout">
          {/* Responsive Collapsible Sidebar */}
          <Sidebar />

          {/* Main Dashboard Content */}
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<StudentDashboardPage />} />
              <Route path="/profile" element={<StudentProfilePage />} />
              <Route path="/jobs" element={<ExploreJobsPage />} />
              <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
              <Route path="/applications" element={<MyApplicationsPage />} />
              <Route path="/interviews" element={<InterviewCenterPage />} />
              <Route path="/offers" element={<OffersInsightsPage />} />
              <Route path="/recruiter" element={<RecruiterWorkspacePage />} />
              <Route path="/coordinator" element={<CoordinatorConsolePage />} />
            </Routes>
          </main>
        </div>
      )}

      {/* Global Editorial Footer */}
      <Footer />

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
