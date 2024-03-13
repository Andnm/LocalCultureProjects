import { getAllMemberByGroupId } from "@/src/redux/features/groupSlice";
import { useAppDispatch } from "@/src/redux/store";
import {
  changeStatusFromEnToVn,
  changeStatusPitchingFromEnToVn,
  formatDate,
  generateFallbackAvatar,
  getColorByProjectStatus,
  getRelationshipStatusInfo,
} from "@/src/utils/handleFunction";
import { Clock, GraduationCap, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface CardGroupProps {
  group: any;
  lectureData: any;
}

const CardGroup = ({ group, lectureData }: CardGroupProps) => {
  const [memberInGroup, setMemberInGroup] = React.useState([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getRelationshipStatus = () => {
    const lectureInGroup = lectureData.find(
      (lecture: any) => lecture.group.id === group.group.id
    );

    return lectureInGroup ? lectureInGroup.relationship_status : "N/A";
  };

  const handleNavigateIntoGroupDetail = (groupId: number) => {
    router.push(`/group/${groupId}/member`);
  };

  React.useEffect(() => {
    dispatch(getAllMemberByGroupId(group?.group?.id)).then((result) => {
      if (getAllMemberByGroupId.fulfilled.match(result)) {
        setMemberInGroup(result.payload);
      } else {
        // toast.error("Lỗi khi lấy thông tin thành viên");
      }
    });
  }, []);

  // console.log(group)
  
  return (
    <div
      className="cursor-pointer hover:scale-102 transition-transform duration-300 transform h-full border-2 border-gray-200 border-opacity-60 rounded-2xl overflow-hidden"
      onClick={() => handleNavigateIntoGroupDetail(group?.group?.id)}
    >
      <div className="h-32 w-full bg-[#1a679e] relative">
        <div className="flex flex-col pt-5 pl-5">
          <p className="text-white text-lg ">Tên dự án: </p>
          <p className="text-white text-lg italic pl-2">
            {group?.project?.name_project}
          </p>
          <div
            className={`${getColorByProjectStatus(
              group?.register_pitching_status
            )} px-3 py-1 rounded-xl text-sm text-center`}
            style={{width: '100px'}}
          >
            {changeStatusPitchingFromEnToVn(group?.register_pitching_status)}
          </div>
        </div>
        {Array.isArray(memberInGroup) &&
          memberInGroup.length !== 0 &&
          memberInGroup
            .filter((member: any) => member.user.role.role_name !== "Lecturer")
            .map((filteredMember: any, index) => {
              return (
                <img
                  key={index}
                  className={`h-14 w-14 object-cover rounded-full border-2 border-white absolute -bottom-6  z-${
                    40 - 10 * index
                  }`}
                  src={
                    filteredMember.user.avatar_url ||
                    generateFallbackAvatar(filteredMember?.user?.email)
                  }
                  style={{
                    right: `${16 + 40 * index}px`,
                  }}
                  alt={`Avatar`}
                />
              );
            })}
      </div>
      <div className="p-4">
        <h2 className="tracking-widest text-xs font-medium text-gray-400 mb-1">
          {group?.subject_code}
        </h2>
        <h1 className="title-font text-lg font-medium text-gray-900 mb-2">
          {group?.group?.group_name}
        </h1>
        <div className="leading-relaxed mb-3 flex gap-3">
          <div className="flex gap-1 items-center">
            <GraduationCap className="w-4 h-4" />{group?.group?.group_quantity}
          </div>
          <div
            style={{
              color: getRelationshipStatusInfo(getRelationshipStatus()).color,
            }}
            className={`flex gap-1 items-center font-bold`}
          >
            <Loader className="w-4 h-4" />
            {getRelationshipStatusInfo(getRelationshipStatus()).text}
          </div>
        </div>
        <div className="flex items-center text-sm justify-end text-gray-400 border-t pt-4">
          <Clock className="w-4 h-4" />
          <p className="ml-1">Ngày tạo: {formatDate(group?.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default CardGroup;
