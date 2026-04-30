import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import LoginCandidate from "./pages/LoginCandidate/LoginCandidate";
import LoginRecruiter from "./pages/LoginRecruiter/LoginRecruiter";
import RegisterCandidate from "./pages/RegisterCandidate/RegisterCandidate";
import RegisterRecruiter from "./pages/RegisterRecruiter/RegisterRecruiter";
import References from "./pages/References/References";
import CandidateSkill from "./pages/CandidateSkill/CandidateSkill";
import WorkExperiencePage from "./pages/WorkExperience/WorkExperience";
import PersonalInfo from "./pages/PersonalInfo/PersonalInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các trang dùng layout chung (có Header, Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/reference" element={<References />} />
        </Route>

        {/* Các trang đăng nhập – không dùng layout chung */}
        <Route path="/login" element={<LoginCandidate />} />
        <Route path="/register" element={<RegisterCandidate />} />
        <Route path="/recruiter/login" element={<LoginRecruiter />} />
        <Route path="/register/recruiter" element={<RegisterRecruiter />} />
        <Route path="/candidate-skill" element={<PersonalInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
