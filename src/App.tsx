import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import LoginCandidate from "./pages/LoginCandidate/LoginCandidate";
import LoginRecruiter from "./pages/LoginRecruiter/LoginRecruiter";
import RegisterCandidate from "./pages/RegisterCandidate/RegisterCandidate";
import RegisterRecruiter from "./pages/RegisterRecruiter/RegisterRecruiter";
import CandidateProfile from "./pages/CandidateProfile/CandidateProfile";
import HeaderOnlyLayout from "./layouts/HeaderOnlyLayout";
import RecruiterInfo from "./pages/recruiter/RecruiterInfo/RecruiterInfo";
import RecuiterProfile from "./pages/recruiter/RecuiterProfile/RecuiterProfile";

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
        </Route>

        {/* Các trang đăng nhập – không dùng layout chung */}
        <Route path="/login" element={<LoginCandidate />} />
        <Route path="/register" element={<RegisterCandidate />} />
        <Route path="/recruiter/login" element={<LoginRecruiter />} />
        <Route path="/register/recruiter" element={<RegisterRecruiter />} />
        <Route path="/recruiter-info" element={<RecuiterProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
