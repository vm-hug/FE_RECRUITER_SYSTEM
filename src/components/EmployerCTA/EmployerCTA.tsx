import React from "react";
import "./EmployerCTA.scss";

const EmployerCTA: React.FC = () => {
  return (
    <section className="employer-cta">
      <div className="container cta-wrapper">
        <div className="cta-content">
          <h2>Tìm kiếm ứng viên tài năng cho doanh nghiệp của bạn</h2>
          <p>
            Tiếp cận với hàng nghìn hồ sơ ứng viên chất lượng. Đăng tin tuyển
            dụng dễ dàng và nhận được phản hồi nhanh chóng từ các ứng viên phù
            hợp.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">Đăng ký doanh nghiệp</button>
            <button className="btn-outline">Đăng nhập</button>
          </div>
        </div>
        <div className="cta-illustration">
          {/* Thay thế src bằng hình ảnh thật của bạn */}
          <img
            src="https://res.cloudinary.com/dzwuvr52e/image/upload/v1780333320/van-hoa-doanh-nghiep_t39ict.webp"
            alt="Tuyển dụng"
          />
        </div>
      </div>
    </section>
  );
};

export default EmployerCTA;
