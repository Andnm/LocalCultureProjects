import { getAllRegisterPitchingByBusiness } from "@/src/redux/features/pitchingSlice";
import { useAppDispatch } from "@/src/redux/store";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import TableMemberInGroup from "@/app/(home)/(business)/(routes)/project/[projectId]/group/_components/table";

interface Props {
  selectedProject: any;
}

const RegisterPitchingDetailByAdmin: React.FC<Props> = (props) => {
  const { selectedProject } = props;

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataGroupPitching, setDataGroupPitching] = useState<any>([]);

  useEffect(() => {
    setLoading(true)
    dispatch(getAllRegisterPitchingByBusiness(selectedProject?.id)).then(
      (result) => {
        if (getAllRegisterPitchingByBusiness.fulfilled.match(result)) {
          setDataGroupPitching(result.payload);
        } else {
          // console.log("error", result.payload);
        }
        setLoading(false);
      }
    );
  }, []);

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
    <Spin spinning={loading}>
      {loading ? (
        <></>
      ) : (
        <div className="p-2 overflow-y-scroll overflow-x-hidden h-full flex flex-wrap justify-between">
          {dataGroupPitching.length !== 0 ? (
            dataGroupPitching.map((group: any, indexGroup: number) => (
              <div
                key={indexGroup}
                className="bg-gray-300 p-2 mb-4 mr-6 relative BusinessGroupCard h-fit"
                style={{ borderRadius: "7px", width: "47%" }}
              >
                <div className="flex w-full justify-between">
                  <p className="uppercase font-bold">
                    {group.group.group_name}{" "}
                  </p>
                </div>

                <TableMemberInGroup
                  setDataGroupPitching={setDataGroupPitching}
                  dataGroupPitching={dataGroupPitching}
                  register_pitching_status={group.register_pitching_status}
                  group={group}
                  projectId={selectedProject?.id}
                />
                <div className="absolute bottom-3 left-3 flex w-full justify-between ">
                  {group.document_url ? (
                    <Button
                      className="bg-blue-300 text-blue-900 hover:bg-blue-300 mt-6 rounded"
                      onClick={() => handleDownload(group)}
                    >
                      <Download className="w-4 h-4 mr-2" /> File giới thiệu nhóm
                      {/* {group.document_url} */}
                    </Button>
                  ) : (
                    <Button className="mt-3">
                      (Nhóm chưa có file giới thiệu)
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white font-bold text-lg">
              Chưa có nhóm nào đăng kí
            </p>
          )}
        </div>
      )}
    </Spin>
  );
};

export default RegisterPitchingDetailByAdmin;
