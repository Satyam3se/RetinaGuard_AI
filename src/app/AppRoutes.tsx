import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { HowItWorksPage } from '../pages/HowItWorksPage';
import { ModelPerformancePage } from '../pages/ModelPerformancePage';
import { DatasetTrainingPage } from '../pages/DatasetTrainingPage';
import { ProjectPresentationPage } from '../pages/ProjectPresentationPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Authenticated Pages
import { DashboardPage } from '../pages/DashboardPage';
import { NewScreeningPage } from '../pages/NewScreeningPage';
import { QualityAssessmentPage } from '../pages/QualityAssessmentPage';
import { ResultPage } from '../pages/ResultPage';
import { ExplanationPage } from '../pages/ExplanationPage';
import { ReportPage } from '../pages/ReportPage';
import { HistoryPage } from '../pages/HistoryPage';
import { ReportsListPage } from '../pages/ReportsListPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SimulationPage } from '../pages/SimulationPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/presentation" element={<ProjectPresentationPage />} />
      <Route path="/project-deck" element={<ProjectPresentationPage />} />
      <Route path="/train" element={<DatasetTrainingPage />} />
      <Route path="/model-training" element={<DatasetTrainingPage />} />
      <Route path="/model-performance" element={<ModelPerformancePage />} />

      {/* Protected clinical routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/screening/new"
        element={
          <ProtectedRoute>
            <NewScreeningPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/screening/:id/quality"
        element={
          <ProtectedRoute>
            <QualityAssessmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/screening/:id/result"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/screening/:id/explanation"
        element={
          <ProtectedRoute>
            <ExplanationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/screening/:id/report"
        element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/simulation"
        element={
          <ProtectedRoute>
            <SimulationPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
