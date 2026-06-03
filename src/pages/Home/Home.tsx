import React from "react";
import SearchBox from "../../components/SearchBox/SearchBox";
import PopularCategories from "../../components/PopularCategories/PopularCategories";
import FeaturedJobs from "../../components/FeaturedJobs/FeaturedJobs";
import TopCompanies from "../../components/TopCompanies/TopCompanies";
import EmployerCTA from "../../components/EmployerCTA/EmployerCTA";
import "./Home.scss";

const trendingSkills = [
  "Java",
  "ReactJS",
  ".NET",
  "Tester",
  "PHP",
  "Business Analyst",
  "NodeJS",
  "Manager",
  "NextJS",
  "Python",
];

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Tìm việc làm mơ ước của bạn</h1>
          <p className="hero__subtitle">
            Hơn 10.000 việc làm đang chờ bạn khám phá và ứng tuyển.
          </p>
          <SearchBox />
        </div>
      </section>

      {/* Trending Skills */}
      <section className="trending">
        <h1 className="trending__heading">Xu hướng tuyển dụng nổi bật</h1>
        <div className="marquee">
          <div className="marquee__track">
            {[...trendingSkills, ...trendingSkills].map((skill, i) => (
              <a href="#" key={`${skill}-${i}`} className="marquee__chip">
                {skill}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Các Component Thêm Mới */}
      <PopularCategories />
      <FeaturedJobs />
      <TopCompanies />
      <EmployerCTA />
    </div>
  );
};

export default Home;
