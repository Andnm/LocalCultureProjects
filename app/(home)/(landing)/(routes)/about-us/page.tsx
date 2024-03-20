"use client";

import React, { useEffect, useState } from "react";
import "./style.scss";
import { FaCheck } from "react-icons/fa6";

const AboutUs = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navLinks = [
    {
      display: "Cam kết phê duyệt",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-verify-listing-blue.svg",
    },
    {
      display: "Dẫn đầu số lượng",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-many-listing-blue.svg",
    },
    {
      display: "Hỗ trợ nhiệt tình",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-save-money-blue.svg",
    },
    {
      display: "Nhiều điều bất ngờ",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-save-gift-blue.svg",
    },
  ];

  return (
    <div className="about-us-container">
      <div className="banner-about-us">
        <div className="overlay"></div>

        <div className="banner-content flex flex-col">
          <h1 className="font-bold mb-5" style={{ fontSize: "30px" }}>
            Kho Dự án Truyền thông - Quảng bá sản phẩm văn hóa bản địa Việt Nam
          </h1>
          <p style={{ maxWidth: "50%" }} className="text-center text-lg">
            Là dự án kết nối các doanh nghiệp nhỏ và hộ kinh doanh với sinh viên
            trường Đại học FPT nhằm lên ý tưởng và triển khai các chiến dịch
            marketing - truyền thông thực tế cho sản phẩm văn hóa bản địa của
            các doanh nghiệp này, dựa trên một mô hình truyền thông đặc thù được
            nghiên cứu và thiết kế riêng cho các loại hình sản phẩm văn hóa bản
            địa Việt Nam
          </p>
        </div>
      </div>

      {/* sứ mệnh */}
      <div className="py-12 container">
        <div className="grid grid-cols-2 gap-20">
          <div>
            <h2>100% dự án đã được phê duyệt</h2>
            <p>
              Thấu hiểu nhu cầu sinh viên về thông tin của một dự án, nền tảng
              Kho dự án sẽ cung cấp dự án với 4 giá trị:
            </p>

            <ul className="mx-2 my-3">
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-600" />
                <p>Phù hợp sinh viên</p>
              </li>

              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-600" />
                <p>Không quá khó khăn</p>
              </li>

              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-600" />
                <p>Trải nghiệm thực tế</p>
              </li>

              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-600" />
                <p>Sẵn sàng tiến hành</p>
              </li>
            </ul>

            <p>
              Từ đây, bạn đã có thể đặt trọn niềm tin. Việc của bạn là tìm kiếm
              dự án theo nhu cầu. Thời gian tìm kiếm dự án ưng ý của bạn hoàn
              toàn được rút ngắn.
            </p>
          </div>

          <div>
            <img
              src="https://upload.tanca.io/api/upload/news/62deb4415d40ee43ee00f325?name=62deb441a99faOmGq2886793-du-an-la-gi-3.jpg"
              alt="img"
            />
          </div>
        </div>
      </div>

      {/* Đối tượng dự án */}
      <div className="background-gray second-section py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-20">
            <div>
              <img
                src="https://img.pikbest.com/ai/illus_our/20230413/07839fdef7fbcd893a0dfe920ad240ff.jpg!w700wp"
                alt="img"
              />
            </div>

            <div className="flex flex-col justify-center h-full">
              <h2>Dẫn đầu về số lượng</h2>
              <p>
                Với đội ngũ luôn thức trực để sàng lọc, nền tảng Kho dự án có
                những người chuyên môn tại Đại học FPT. Các dự án hay và hấp dẫn
                sẽ được cập nhật liên tục với thông tin đến từ các doanh nghiệp
                xịn xò. Bạn an tâm với nhiều lựa chọn đa dạng và phù hợp nhất.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tính khả thi dự án */}
      <div className="py-12 container">
        <div className="grid grid-cols-2 gap-20">
          <div className="flex flex-col justify-center h-full">
            <h2>Hỗ trợ nhiệt tình</h2>
            <p>
              Là Kho dự án luôn đồng hành cùng bạn, đội ngũ admin được đào tạo
              bài bản & am hiểu nghiệp vụ, luôn hỗ trợ bạn trong suốt quá trình
              tham gia nếu có vấn đề gì phát sinh, giúp bạn tiết kiệm đáng kể
              công sức và thời gian.
            </p>
          </div>

          <div>
            <img
              src="https://vieclamkinhdoanh.vn/blog/wp-content/uploads/2022/05/ho-tro-kinh-doanh-la-gi.png"
              alt="img"
            />
          </div>
        </div>
      </div>

      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-to-top-btn">
          <span>↑</span>
        </button>
      )}
    </div>
  );
};

export default AboutUs;
