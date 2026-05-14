import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type {
  ArticleResponse,
  ArticleSearchParams,
} from "../../types/articles/articles.type";
import { Search, ChevronDown } from "lucide-react";
import "./ArticlesPage.scss";
import { articleService } from "../../services/articles/articlesServices.service";
import { getImageUrl } from "../../helper/loadImage.util";

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [featuredArticle, setFeaturedArticle] =
    useState<ArticleResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true); // Trạng thái kiểm tra còn bài để load không

  // Khởi tạo size là 7 (1 bài nổi bật + 6 bài grid)
  const [searchParams, setSearchParams] = useState<ArticleSearchParams>({
    page: 0,
    size: 7,
    status: "PUBLISHED",
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Chỉ hiện loading xoay xoay khi tải trang đầu tiên hoặc khi search
        if (searchParams.page === 0) setLoading(true);

        const response = await articleService.search(searchParams);
        const dataList =
          (response as any).content || (response as any).data || response;

        if (searchParams.page === 0) {
          // Lần đầu tải (Page 0) hoặc khi có search mới
          if (dataList && dataList.length > 0) {
            setFeaturedArticle(dataList[0]);
            setArticles(dataList.slice(1));
          } else {
            // Không tìm thấy bài nào
            setFeaturedArticle(null);
            setArticles([]);
          }
        } else {
          // Khi nhấn "Xem thêm" (Page > 0), cộng dồn vào danh sách hiện tại
          if (dataList && dataList.length > 0) {
            setArticles((prevArticles) => [...prevArticles, ...dataList]);
          }
        }

        // Nếu số lượng trả về ít hơn size yêu cầu -> Đã hết bài, ẩn nút Xem thêm
        setHasMore(dataList.length === searchParams.size);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  // --- Xử lý sự kiện Tìm kiếm ---
  const executeSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      keyword: keyword.trim() !== "" ? keyword : undefined,
      page: 0, // Quan trọng: Reset về page 0 khi search
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  // --- Xử lý sự kiện Xem thêm ---
  const handleLoadMore = () => {
    setSearchParams((prev) => ({
      ...prev,
      page: (prev.page ?? 0) + 1, // Tăng page lên 1
    }));
  };

  return (
    <div className="articles-page">
      {/* Header & Search */}
      <div className="ap-header">
        <h1>Cẩm nang tìm việc</h1>
        <p>
          Khám phá những kiến thức và kỹ năng cần thiết cho sự nghiệp của bạn
        </p>

        <div className="ap-search-bar">
          <div className="search-input">
            <Search
              size={20}
              color="#999"
              style={{ cursor: "pointer" }}
              onClick={executeSearch}
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="category-select">
            <span>Tất cả bài viết</span>
            <ChevronDown size={20} color="#999" />
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="loading"
          style={{ textAlign: "center", padding: "50px" }}
        >
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="ap-content">
          {/* Fallback khi không có dữ liệu */}
          {!featuredArticle && articles.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "50px", color: "#666" }}
            >
              Không tìm thấy bài viết nào phù hợp.
            </div>
          )}

          {/* Featured Article */}
          {featuredArticle && (
            <Link
              to={`/articles/${featuredArticle.slug}`}
              className="featured-article"
            >
              <div className="fa-image">
                <img
                  src={getImageUrl(featuredArticle.thumbnailUrl)}
                  alt={featuredArticle.title}
                />
              </div>
              <div className="fa-info">
                <span className="category-tag">
                  {featuredArticle.categoryName}
                </span>
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.description}</p>
                <div className="author-info">
                  {featuredArticle.authorAvatar ? (
                    <img
                      src={getImageUrl(featuredArticle.authorAvatar)}
                      alt={featuredArticle.authorName}
                    />
                  ) : (
                    <div
                      className="author-avatar-sm"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#6b46c1",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {featuredArticle.authorName.charAt(0)}
                    </div>
                  )}
                  <div className="author-text">
                    <span className="name">{featuredArticle.authorName}</span>
                    <span className="date">
                      {formatDate(featuredArticle.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Recent Articles Grid */}
          {articles.length > 0 && (
            <>
              <h3 className="section-title">Bài viết mới nhất</h3>
              <div className="articles-grid">
                {articles.map((article) => (
                  <Link
                    to={`/articles/${article.slug}`}
                    key={article.id}
                    className="article-card"
                  >
                    <div className="ac-image">
                      <span className="category-badge">
                        {article.categoryName}
                      </span>
                      <img
                        src={getImageUrl(article.thumbnailUrl)}
                        alt={article.title}
                      />
                    </div>
                    <div className="ac-content">
                      <h4>{article.title}</h4>
                      <p>{article.description}</p>
                      <div className="author-info">
                        {article.authorAvatar ? (
                          <img
                            src={getImageUrl(article.authorAvatar)}
                            alt={article.authorName}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="author-avatar-sm"
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: "50%",
                              background: "#6b46c1",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {article.authorName.charAt(0)}
                          </div>
                        )}
                        <div className="author-text">
                          <span className="name">{article.authorName}</span>
                          <span className="date">
                            {formatDate(article.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Nút Xem thêm chỉ hiện khi biến hasMore = true */}
          {hasMore && featuredArticle && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              Xem thêm bài viết
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
