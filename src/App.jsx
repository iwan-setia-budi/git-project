import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import PrivateRoute from "@/components/PrivateRoute";

import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import AppShell from "./components/layout/AppShell";

// Family Dashboard & Finance
import FamilyDashboard from "./pages/FamilyDashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import AddTransaction from "./pages/finance/AddTransaction";
import TransactionHistory from "./pages/finance/TransactionHistory";
import FinanceReport from "./pages/finance/FinanceReport";
import SavingsTracker from "./pages/finance/SavingsTracker";

// Reminders
import ReminderList from "./pages/reminder/ReminderList";
import AddReminder from "./pages/reminder/AddReminder";
import ReminderCalendar from "./pages/reminder/ReminderCalendar";

// Schedule
import ScheduleCalendar from "./pages/schedule/ScheduleCalendar";
import AddSchedule from "./pages/schedule/AddSchedule";
import FamilyAgenda from "./pages/schedule/FamilyAgenda";

// Drive
import FileManager from "./pages/drive/FileManager";
import UploadFile from "./pages/drive/UploadFile";
import FileDetail from "./pages/drive/FileDetail";

// Family & Settings
import FamilyProfile from "./pages/FamilyProfile";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected routes wrapped with PrivateRoute */}
          <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
            <Route path="/dashboard" element={<FamilyDashboard />} />
            
            {/* Finance Routes */}
            <Route path="/finance" element={<FinanceDashboard />} />
            <Route path="/finance/add-transaction" element={<AddTransaction />} />
            <Route path="/finance/history" element={<TransactionHistory />} />
            <Route path="/finance/report" element={<FinanceReport />} />
            <Route path="/finance/savings" element={<SavingsTracker />} />
            
            {/* Reminder Routes */}
            <Route path="/reminder" element={<ReminderList />} />
            <Route path="/reminder/add" element={<AddReminder />} />
            <Route path="/reminder/calendar" element={<ReminderCalendar />} />
            
            {/* Schedule Routes */}
            <Route path="/schedule" element={<ScheduleCalendar />} />
            <Route path="/schedule/add" element={<AddSchedule />} />
            <Route path="/schedule/agenda" element={<FamilyAgenda />} />
            
            {/* Drive Routes */}
            <Route path="/drive" element={<FileManager />} />
            <Route path="/drive/upload" element={<UploadFile />} />
            <Route path="/drive/detail/:folderId/:fileId" element={<FileDetail />} />
            
            {/* Family & Settings */}
            <Route path="/family-profile" element={<FamilyProfile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}