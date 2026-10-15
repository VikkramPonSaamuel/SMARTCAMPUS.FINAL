import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CampusProvider } from './context/CampusContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ClassroomsPage } from './pages/ClassroomsPage';
import { CanteenPage } from './pages/CanteenPage';
import { EnergyPage } from './pages/EnergyPage';
import { SecurityPage } from './pages/SecurityPage';
import { ParkingPage } from './pages/ParkingPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <CampusProvider>
      <BrowserRouter>
        <Routes>
          {/* Futuristic Scroll-Driven Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Smart Campus OS Dashboard & Digital Twin Suite */}
          <Route
            path="/*"
            element={
              <AppShell>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/digital-twin" element={<DigitalTwinPage />} />
                  <Route path="/classrooms" element={<ClassroomsPage />} />
                  <Route path="/canteen" element={<CanteenPage />} />
                  <Route path="/energy" element={<EnergyPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/parking" element={<ParkingPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AppShell>
            }
          />
        </Routes>
      </BrowserRouter>
    </CampusProvider>
  );
};

export default App;

