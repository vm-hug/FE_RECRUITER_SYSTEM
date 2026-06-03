import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import LoginCandidate from "./pages/LoginCandidate/LoginCandidate";
import LoginRecruiter from "./pages/LoginRecruiter/LoginRecruiter";
import RegisterCandidate from "./pages/RegisterCandidate/RegisterCandidate";
import RegisterRecruiter from "./pages/RegisterRecruiter/RegisterRecruiter";
import CandidateProfile from "./pages/CandidateProfile/CandidateProfile";
import HeaderOnlyLayout from "./layouts/HeaderOnlyLayout";
import RecuiterProfile from "./pages/Recruiter/RecuiterProfile/RecuiterProfile";
import Job from "./pages/Recruiter/Job/Job";
import JobDetail from "./pages/Recruiter/JobDetail/JobDetail";
import ChatRoom from "./pages/Chat/ChatRoom";
import RecruiterInbox from "./pages/Recruiter/RecruiterInbox/RecruiterInbox";
import ArticlesPage from "./pages/ArticlesPage/ArticlesPage";
import ArticleDetailPage from "./pages/ArticlesPage/ArticlesDetail/ArticleDetailPage";
import DashboardPage from "./pages/Recruiter/Dashboard/DashboardPage";
import DashboardLayout from "./layouts/recruiter/DashboardLayout";
import ApplicationManagerPage from "./pages/Recruiter/ApplicationManager/ApplicationManagerPage";
import JobManagerPage from "./pages/Recruiter/JobManager/JobManagerPage";
import ProfessionPage from "./pages/Recruiter/Profession/ProfessionPage";
import SettingsPage from "./pages/Recruiter/Setting/SettingsPage";
import AdminLayout from "./layouts/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AuthorPage from "./pages/Admin/Author/AuthorPage";
import ArticleManagerPage from "./pages/Admin/Article/ArticleManagerPage";
import CandidateManagerPage from "./pages/Admin/ManagerCandidate/CandidateManagerPage";
import RecruiterManagerPage from "./pages/Admin/ManageRecruiter/RecruiterManagerPage";
import CompanyManagerPage from "./pages/Admin/ManagerCompany/CompanyManagerPage";
import LoginAdmin from "./pages/Admin/LoginAdmin/LoginAdmin";
import AICVScoringPage from "./pages/CV_Score/AICVScoringPage";
import AdminSettingsPage from "./pages/Admin/Setting/AdminSettingsPage";
import CandidateCompanyPage from "./pages/CompanyCandidate/CandidateCompanyPage";
import CompanyDetailPage from "./pages/CompanyCandidate/Detail/CompanyDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các trang dùng layout chung (có Header, Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ai-cv-score" element={<AICVScoringPage />} />
          <Route path="/article-page" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/job" element={<Job />} />
          <Route path="/job/:slug" element={<JobDetail />} />
          <Route path="/companies" element={<CandidateCompanyPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
        </Route>

        {/* DASHBOARD OF RECRUITER */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard-recruiter" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationManagerPage />} />
          <Route path="/recruiter-info" element={<RecuiterProfile />} />
          <Route path="/recruiter/inbox" element={<RecruiterInbox />} />
          <Route path="/manager-job" element={<JobManagerPage />} />
          <Route path="/profession" element={<ProfessionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* DASHBOARD OF ADMIN */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard-admin" element={<AdminDashboard />} />
          <Route path="/admin/authors" element={<AuthorPage />} />
          <Route path="/admin/articles" element={<ArticleManagerPage />} />
          <Route path="/admin/candidates" element={<CandidateManagerPage />} />
          <Route path="/admin/companies" element={<CompanyManagerPage />} />
          <Route path="/admin/recruiters" element={<RecruiterManagerPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Các trang chỉ sử dùng Header */}
        <Route element={<HeaderOnlyLayout />}>
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/chat/:conversationId" element={<ChatRoom />} />
        </Route>

        {/* Các trang đăng nhập – không dùng layout chung */}
        <Route path="/login" element={<LoginCandidate />} />
        <Route path="/register" element={<RegisterCandidate />} />
        <Route path="/recruiter/login" element={<LoginRecruiter />} />
        <Route path="/register/recruiter" element={<RegisterRecruiter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
