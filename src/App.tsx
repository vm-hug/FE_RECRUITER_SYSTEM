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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các trang dùng layout chung (có Header, Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Các trang chỉ sử dùng Header */}
        <Route element={<HeaderOnlyLayout />}>
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/recruiter-info" element={<RecuiterProfile />} />
          <Route path="/chat/:conversationId" element={<ChatRoom />} />
          <Route path="/recruiter/inbox" element={<RecruiterInbox />} />
        </Route>

        {/* Các trang đăng nhập – không dùng layout chung */}
        <Route path="/login" element={<LoginCandidate />} />
        <Route path="/register" element={<RegisterCandidate />} />
        <Route path="/recruiter/login" element={<LoginRecruiter />} />
        <Route path="/register/recruiter" element={<RegisterRecruiter />} />
        <Route path="/job" element={<Job />} />
        <Route path="/job/:slug" element={<JobDetail />} />

        <Route path="/article-page" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
