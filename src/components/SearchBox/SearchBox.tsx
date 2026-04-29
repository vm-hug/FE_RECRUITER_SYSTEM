import "./SearchBox.scss";

const SearchBox = () => {
  return (
    <div className="searchbox">
      <div className="searchbox__keyword">
        <span className="material-symbols-outlined searchbox__icon">
          search
        </span>
        <input
          type="text"
          className="searchbox__input"
          placeholder="Tìm kiếm việc làm, vị trí, công ty..."
        />
      </div>
      <div className="searchbox__separator" />
      <div className="searchbox__location">
        <span className="material-symbols-outlined searchbox__icon">
          location_on
        </span>
        <select className="searchbox__select" defaultValue="">
          <option value="" disabled>
            Chọn địa điểm
          </option>
          <option value="hanoi">Hà Nội</option>
          <option value="hcm">Hồ Chí Minh</option>
          <option value="danang">Đà Nẵng</option>
        </select>
        <span className="material-symbols-outlined searchbox__arrow">
          expand_more
        </span>
      </div>
      <button className="searchbox__button">Tìm kiếm</button>
    </div>
  );
};

export default SearchBox;
