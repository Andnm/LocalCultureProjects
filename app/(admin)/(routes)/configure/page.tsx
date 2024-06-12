"use client";
import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import { Button, Input, Modal, Table, Switch, TimePicker } from "antd";
import ModalConfigSubjectCode from "./_components/ModalConfigSubjectCode";
import axios from "axios";

const Configure = () => {
  const [openModalManageModel, setOpenModalManageModel] =
    useState<boolean>(false);
  const [dataSubjectCode, setDataSubjectCode] = useState<any>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<any>(
        `${process.env.NEXT_PUBLIC_MOCK_API_URL}/subject_code`
      );

      setDataSubjectCode(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Card className="p-4 manager-project h-full">
      <div className="mx-1 my-4 flex gap-4">
        <Button
          key="btn-model"
          onClick={() => {
            setOpenModalManageModel(true);
          }}
        >
          Các mã môn học hiện có
        </Button>
      </div>
      {openModalManageModel && (
        <ModalConfigSubjectCode
          open={openModalManageModel}
          onClose={() => {
            setOpenModalManageModel(false);
          }}
          dataSubjectCode={dataSubjectCode}
          setDataSubjectCode={setDataSubjectCode}
          onSubmit={() => {}}
        />
      )}
    </Card>
  );
};

export default Configure;
