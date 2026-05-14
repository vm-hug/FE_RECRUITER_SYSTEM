import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import "./ArticleDetailPage.scss";
import type { ArticleResponse } from "../../../types/articles/articles.type";
import { articleService } from "../../../services/articles/articlesServices.service";
import { getImageUrl } from "../../../helper/loadImage.util";

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await articleService.getBySlug(slug);
        setArticle(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  if (loading) return <div className="loading-page">Đang tải...</div>;
  if (!article)
    return <div className="error-page">Không tìm thấy bài viết</div>;

  return (
    <div className="article-detail-page">
      <div className="ad-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Quay lại danh sách bài viết
        </button>

        {/* Header */}
        <div className="ad-header">
          <span className="category-tag">{article.categoryName}</span>
          <h1 className="title">{article.title}</h1>

          <div className="meta-info">
            <div className="author">
              <img
                src={getImageUrl(article.authorAvatar)}
                alt={article.authorName}
              />
              <div className="author-text">
                <span className="name">{article.authorName}</span>
                <span className="position">Chuyên gia / Tác giả</span>{" "}
                {/* Có thể bổ sung trường này từ API */}
              </div>
            </div>
            <div className="date">📅 {formatDate(article.createdAt)}</div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="ad-thumbnail">
          <img src={getImageUrl(article.thumbnailUrl)} alt={article.title} />
        </div>

        {/* Main Content Render */}
        <div
          className="ad-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Footer Actions */}
        <div className="ad-footer">
          <div className="tags">
            <span className="hash-tag">#InterviewTips</span>
            <span className="hash-tag">#CareerAdvice</span>
          </div>
          <div className="actions">
            <span>Chia sẻ:</span>
            <button className="icon-btn">
              <Share2 size={18} />
            </button>
            <button className="icon-btn">
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
