"use client";

import React from "react";

import {
  chooseGroupByBusiness,
  getAllRegisterPitchingByBusiness,
} from "@/src/redux/features/pitchingSlice";
import { useAppDispatch } from "@/src/redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TableMemberInGroup from "./table";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import "./styles.css"

interface BusinessGroupPageProps {
  projectId: number;
}

const BusinessGroupPage: React.FC<BusinessGroupPageProps> = ({ projectId }) => {
  const dispatch = useAppDispatch();
  const [dataGroupPitching, setDataGroupPitching] = React.useState<any>([]);
  const [userLogin, setUserLogin] = useUserLogin();

  React.useEffect(() => {
    dispatch(getAllRegisterPitchingByBusiness(projectId)).then((result) => {
      if (getAllRegisterPitchingByBusiness.fulfilled.match(result)) {
        console.log(result.payload);
        setDataGroupPitching(result.payload);
      } else {
        // console.log("error", result.payload);
      }
    });
  }, []);

  const handleClickUploadFile = () => {
    alert("chưa hỗ trợ");
  };

  const handleDownload = (group: any) => {
    const fileUrl = group.document_url;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${group.group.group_name}_introduction`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-2 overflow-y-scroll overflow-x-hidden h-full BusinessGroupContainer">
      {dataGroupPitching.length !== 0 ? (
        dataGroupPitching.map((group: any, indexGroup: number) => (
          <div
            key={indexGroup}
            className="bg-gray-300 p-2 mb-4 mr-6 relative BusinessGroupCard"
            style={{ borderRadius: "7px" }}
          >
            <div className="flex w-full justify-between">
              <p className="uppercase font-bold">{group.group.group_name} </p>
            </div>

            <TableMemberInGroup
              register_pitching_status={group.register_pitching_status}
              group={group}
              projectId={projectId}
            />
            <div className="absolute bottom-3 left-3 flex w-full justify-between ">
              {group.document_url ? (
                userLogin?.role_name === "Student" ? (
                  <></>
                ) : (
                  <Button
                    className="bg-blue-300 text-blue-900 hover:bg-blue-300 mt-6 rounded"
                    onClick={() => handleDownload(group)}
                  >
                    <Download className="w-4 h-4 mr-2" /> File giới thiệu nhóm
                    {/* {group.document_url} */}
                  </Button>
                )
              ) : userLogin?.role_name === "Student" ? (
                <Button
                  className="bg-teal-300 text-teal-900 hover:bg-teal-300 mt-6 rounded"
                  onClick={handleClickUploadFile}
                >
                  Tải lên file giới thiệu
                </Button>
              ) : (
                <Button className="mt-3">(Nhóm chưa có file giới thiệu)</Button>
              )}
            </div>

          </div>
        ))
      ) : (
        <p className="text-white font-bold text-lg">Chưa có nhóm nào đăng kí</p>
      )}
    </div>
  );
};

export default BusinessGroupPage;
