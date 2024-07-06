"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import { Button } from "antd";

import axios from "axios";
import ModalConfigData from "./_components/ModalConfigData";

interface ConfigureProps {}

const Configure: React.FC<ConfigureProps> = () => {
  const [openModal, setOpenModal] = useState({
    subjectCode: false,
    implementTime: false,
    businessSector: false,
    expectedBudget: false,
  });

  const [data, setData] = useState({
    subjectCode: [] as any[],
    implementTime: [] as any[],
    businessSector: [] as any[],
    expectedBudget: [] as any[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        responseSubjectCode,
        responseImplementTime,
        responseBusinessSector,
        responseExpectedBudget,
      ] = await Promise.all([
        axios.get<any>(
          `${process.env.NEXT_PUBLIC_MOCK_API_URL_1}/subject_code`
        ),
        axios.get<any>(
          `${process.env.NEXT_PUBLIC_MOCK_API_URL_1}/project_implement_time`
        ),
        axios.get<any>(
          `${process.env.NEXT_PUBLIC_MOCK_API_URL_2}/business_sector`
        ),
        axios.get<any>(
          `${process.env.NEXT_PUBLIC_MOCK_API_URL_2}/expected_budget`
        ),
      ]);

      setData({
        subjectCode: responseSubjectCode.data,
        implementTime: responseImplementTime.data,
        businessSector: responseBusinessSector.data,
        expectedBudget: responseExpectedBudget.data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderModalConfigData = (
    key: keyof typeof openModal,
    text: string,
    linkApi: string,
    tagApi: string
  ) =>
    openModal[key] && (
      <ModalConfigData
        open={openModal[key]}
        onClose={() => setOpenModal({ ...openModal, [key]: false })}
        dataConfig={data[key]}
        setDataConfig={(updatedData: any) =>
          setData({ ...data, [key]: updatedData })
        }
        tagApi={tagApi}
        linkApi={linkApi}
        text={text}
        onSubmit={() => {}}
      />
    );

  return (
    <Card className="p-4 manager-project h-full">
      <div className="mx-1 my-4 flex gap-4">
        <Button
          key="btn-subject-code"
          onClick={() => setOpenModal({ ...openModal, subjectCode: true })}
        >
          Mã môn học
        </Button>
        <Button
          key="btn-implement-time"
          onClick={() => setOpenModal({ ...openModal, implementTime: true })}
        >
          Mốc thời gian diễn ra
        </Button>
        <Button
          key="btn-business-sector"
          onClick={() => setOpenModal({ ...openModal, businessSector: true })}
        >
          Lĩnh vực kinh doanh
        </Button>
        <Button
          key="btn-expected-budget"
          onClick={() => setOpenModal({ ...openModal, expectedBudget: true })}
        >
          Ngân sách dự kiến
        </Button>
      </div>

      {renderModalConfigData(
        "subjectCode",
        "mã môn học",
        process.env.NEXT_PUBLIC_MOCK_API_URL_1 || "",
        "subject_code"
      )}
      {renderModalConfigData(
        "implementTime",
        "mốc thời gian",
        process.env.NEXT_PUBLIC_MOCK_API_URL_1 || "",
        "project_implement_time"
      )}
      {renderModalConfigData(
        "businessSector",
        "lĩnh vực kinh doanh",
        process.env.NEXT_PUBLIC_MOCK_API_URL_2 || "",
        "business_sector"
      )}
      {renderModalConfigData(
        "expectedBudget",
        "ngân sách dự kiến",
        process.env.NEXT_PUBLIC_MOCK_API_URL_2 || "",
        "expected_budget"
      )}
    </Card>
  );
};

export default Configure;
