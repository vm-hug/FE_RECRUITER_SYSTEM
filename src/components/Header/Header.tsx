import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Thêm useNavigate để xử lý đăng xuất
import "./Header.scss";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<Boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
              className="header__link header__link--active"
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined">work</span>
              Ngành nghề / Địa điểm
            </Link>
            <Link to="/job" className="header__link" onClick={closeMenu}>
              <span className="material-symbols-outlined">corporate_fare</span>
              Công ty
            </Link>
            <Link to="#" className="header__link" onClick={closeMenu}>
              <span className="material-symbols-outlined">menu_book</span>
              Cẩm nang việc làm
            </Link>
            <Link to="#" className="header__link" onClick={closeMenu}>
              <span className="material-symbols-outlined">description</span>
              Mẫu CV xin việc
            </Link>

            {/* Actions trong mobile menu */}
            <div className="header__actions--mobile">
              {isLoggedIn ? (
                <Link to="/profile" className="header__user-link">
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
