import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Thêm useLocation
import "./Header.scss";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false); // Đổi Boolean thành boolean
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Khởi tạo useLocation để lấy path hiện tại
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded: any = jwtDecode(token);
        setUserEmail(decoded.sub);
      } catch (error) {
        console.error("Token không hợp lệ");
      }
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="header">
        <div className="header__container">
          {/* Brand – sát trái */}
          <Link to="/" className="header__brand">
            CareerRise
          </Link>

          {/* Navigation – desktop */}
          <nav
            className={`header__nav ${mobileMenuOpen ? "header__nav--open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              to="/"
              className={`header__link ${location.pathname === "/" ? "header__link--active" : ""}`}
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined">work</span>
              Trang chủ
            </Link>
            <Link
              to="/companies"
              className={`header__link ${location.pathname === "/companies" ? "header__link--active" : ""}`}
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined">corporate_fare</span>
              Công ty
            </Link>
            <Link
              to="/job"
              className={`header__link ${location.pathname === "/job" ? "header__link--active" : ""}`}
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined">corporate_fare</span>
              Việc làm
            </Link>
            <Link
              to="/article-page"
              className={`header__link ${location.pathname === "/article-page" ? "header__link--active" : ""}`}
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined">menu_book</span>
              Cẩm nang Việc làm
            </Link>
            <Link
              to="/ai-cv-score"
              className={`header__link ${location.pathname === "/ai-cv-score" ? "header__link--active" : ""}`}
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined">description</span>
              Chấm điểm CV
            </Link>

            {/* Actions trong mobile menu */}
            <div className="header__actions--mobile">
              {isLoggedIn ? (
                <Link
                  to="/profile"
                  className="header__user-link"
                  onClick={closeMenu}
                >
                  <span className="header__user-greeting">
                    Xin chào, {userEmail}!
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="header__login"
                    onClick={closeMenu}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="header__login"
                    onClick={closeMenu}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
              <Link
                to="/recruiter/login"
                className="header__employer-btn"
                onClick={closeMenu}
              >
                Nhà Tuyển Dụng
              </Link>
            </div>
          </nav>

          {/* Actions – desktop */}
          <div className="header__actions">
            {isLoggedIn ? (
              <Link to="/profile" className="header__user-link">
                <span className="header__user-greeting">
                  <span className="gradient-text">Xin chào</span>, {userEmail}!
                </span>
              </Link>
            ) : (
              <Link to="/login" className="header__login">
                Đăng ký / Đăng Nhập
              </Link>
            )}

            <Link to="/recruiter/login" className="header__employer-btn">
              Nhà Tuyển Dụng
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="header__menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Overlay */}
        {mobileMenuOpen && (
          <div className="header__overlay" onClick={closeMenu} />
        )}
      </header>
    </>
  );
};

export default Header;
