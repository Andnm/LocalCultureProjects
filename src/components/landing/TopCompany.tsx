import React from "react";

const TopCompany = () => {
  return (
    <div style={{ margin: "auto 0", marginBottom: "50px"}}>
      <div
        className="mt-8 mb-5"
        style={{ fontSize: "20px", fontWeight: "bold" }}
      >
        Những công ty đã liên kết
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="h-[200px] flex items-center justify-center flex-col gap-2 border-2"
        style={{borderRadius: '10px'}}
        >
          <img
          className="w-9/12 object-cover h-auto"
            src="https://live.staticflickr.com/65535/53397875578_9a1ed05b1b_b.jpg"
            alt="branch"
          />
          <div className="uppercase font-bold text-base">Tập đoàn FPT</div>
        </div>
        
        <div className="h-[200px] flex items-center justify-center flex-col gap-2 border-2"
        style={{borderRadius: '10px'}}
        >
          <img
          className="w-9/12 object-cover h-auto"
            src="https://live.staticflickr.com/65535/53397875578_9a1ed05b1b_b.jpg"
            alt="branch"
          />
          <div className="uppercase font-bold text-base">Tập đoàn FPT</div>
        </div>

        <div className="h-[200px] flex items-center justify-center flex-col gap-2 border-2"
        style={{borderRadius: '10px'}}
        >
          <img
          className="w-9/12 object-cover h-auto"
            src="https://live.staticflickr.com/65535/53397875578_9a1ed05b1b_b.jpg"
            alt="branch"
          />
          <div className="uppercase font-bold text-base">Tập đoàn FPT</div>
        </div>

        <div className="h-[200px] flex items-center justify-center flex-col gap-2 border-2"
        style={{borderRadius: '10px'}}
        >
          <img
          className="w-9/12 object-cover h-auto"
            src="https://live.staticflickr.com/65535/53397875578_9a1ed05b1b_b.jpg"
            alt="branch"
          />
          <div className="uppercase font-bold text-base">Tập đoàn FPT</div>
        </div>
      </div>
    </div>
  );
};

export default TopCompany;
