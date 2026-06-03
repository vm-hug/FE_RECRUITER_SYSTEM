import React from "react";
import "./PopularCategories.scss";

const categories = [
  {
    id: 1,
    title: "Khởi nghiệp",
    count: "300 việc làm",
    icon: "rocket_launch",
    colorClass: "green",
  },
  {
    id: 2,
    title: "Xây dựng",
    count: "550 việc làm",
    icon: "handyman",
    colorClass: "yellow",
  },
  {
    id: 3,
    title: "Y tế",
    count: "420 việc làm",
    icon: "medical_services",
    colorClass: "red",
  },
  {
    id: 4,
    title: "Ngoại ngữ",
    count: "280 việc làm",
    icon: "language",
    colorClass: "purple",
  },
  {
    id: 5,
    title: "Giáo dục",
    count: "480 việc làm",
    icon: "menu_book",
    colorClass: "blue",
  },
  {
    id: 6,
    title: "Dịch vụ khách hàng",
    count: "630 việc làm",
    icon: "support_agent",
    colorClass: "orange",
  },
];

const PopularCategories: React.FC = () => {
  return (
    <section className="popular-categories">
      <div className="container">
        <h2 className="section-title">Ngành nghề phổ biến</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div className="category-card" key={cat.id}>
              <div className={`icon-box ${cat.colorClass}`}>
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <div className="category-info">
                <h3>{cat.title}</h3>
                <p>
                  <span>{cat.count.split(" ")[0]}</span> việc làm
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
