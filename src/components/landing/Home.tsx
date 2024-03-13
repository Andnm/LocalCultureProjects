import React from "react";

const Home = () => {
  return (
    <div className="home-page" style={{ margin: "auto 0" }}>
      <div className="test" style={{ width: "1400px", color: "white" }}>
        <div className="container">
          <div className="sm:flex items-center max-w-screen-xl">
            <div className="sm:w-1/2 p-10">
              <div className="image object-center text-center">
                <img src="https://ss-images.saostar.vn/2020/02/15/6994345/7campusdhfpttphcm.jpg" />
              </div>
            </div>
            <div className="sm:w-1/2 p-5">
              <div className="text">
                <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">
                  Thông tin
                </span>
                <h2 className="my-4 font-bold text-3xl sm:text-4xl text-black">
                  Về <span className="text-indigo-600">kho dự án</span>
                </h2>
                <p className="text-gray-700">
                  Kho dự án là nơi lưu trữ thông tin với những nhiệm vụ cụ thể, 
                  thông tin bao gồm các chi tiết về mục tiêu, các công việc cần thực hiện, 
                  và những nguồn lực đang được sử dụng. Đây là nơi quản lý và theo dõi tiến độ của dự án, 
                  giúp đảm bảo rằng mọi công việc được thực hiện đúng hướng và đúng thời gian.
                </p>

                <button className="cursor-pointer mt-4 group  flex gap-1.5 px-8 py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                  >
                    <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      id="SVGRepo_tracerCarrier"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g id="Interface / Download">
                        <path
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2"
                          stroke="#f1f1f1"
                          d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                          id="Vector"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  Tải về
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
