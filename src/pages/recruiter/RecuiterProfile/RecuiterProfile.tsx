import { useEffect, useState } from "react";
import type { UserResponse } from "../../../types/candidate/candidate.type";
import { userServices } from "../../../services/userServices.service";
import RecruiterInfo from "../RecruiterInfo/RecruiterInfo";
import CompanyInfo from "../Company/CompanyInfo";

const RecuiterProfile = () => {
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await userServices.getMyInfo();
      setData(res);
    } catch (error) {
      console.error("Lỗi khi fetch thông tin recruiter:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ display: "flex", gap: "24px", padding: "24px" }}>
      {/* Card của Recruiter */}
      <div>
        <RecruiterInfo data={data} onRefresh={fetchInfo} />
      </div>

      {/* Card của Company */}
      <div style={{ flex: 1 }}>
        <CompanyInfo company={data?.recruiter?.company} onRefresh={fetchInfo} />
      </div>
    </div>
  );
};

export default RecuiterProfile;
