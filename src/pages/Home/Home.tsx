import SearchBox from "../../components/SearchBox/SearchBox";
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

const Home = () => {
  return (
    <>
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

      {/* Trending Skills Marquee */}
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
    </>
  );
};

export default Home;
