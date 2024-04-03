"use client";
import React from "react";
import HeaderLecturerBoardGroup from "./_components/HeaderLecturerBoardGroup";
import CardGroup from "./_components/CardGroup";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { getAllRegisterPitchingByStudent } from "@/src/redux/features/pitchingSlice";
import { getAllGroupAreMembers } from "@/src/redux/features/groupSlice";
import LoadingPitching from "./_components/LoadingPitching";

const LecturerBoard = () => {
  const [dataGroupList, setDataGroupList] = React.useState<any[]>([]);
  const [lectureData, setLectureData] = React.useState<any[]>([]);
  const [mergeDataOrigin, setMergeDataOrigin] = React.useState<any[]>([]);
  const [mergeData, setMergeData] = React.useState<any[]>([]);

  const dispatch = useAppDispatch();

  const { data, loadingPitching, error } = useAppSelector(
    (state) => state.pitching
  );

  //load data
  React.useEffect(() => {
    dispatch(getAllGroupAreMembers()).then((result) => {
      if (getAllGroupAreMembers.fulfilled.match(result)) {
        setLectureData(result.payload);
        console.log("lecture", result.payload);
      }
    });

    dispatch(getAllRegisterPitchingByStudent()).then((result) => {
      if (getAllRegisterPitchingByStudent.fulfilled.match(result)) {
        setDataGroupList(result.payload);
      } else {
        // console.log(result.payload);
      }
    });
  }, []);

  React.useEffect(() => {
    if (lectureData.length > 0 && dataGroupList.length > 0) {
      const mergeDataArray = dataGroupList.map((group) => {
        const foundLecture = lectureData.find(
          (lecture) => lecture.group.id === group.group.id
        );

        return {
          ...group,
          relationship_status: foundLecture
            ? foundLecture.relationship_status
            : null,
        };
      });

      setMergeData(mergeDataArray);
      setMergeDataOrigin(mergeDataArray);
    }
  }, [lectureData, dataGroupList]);

  // filter
  const [filterOption, setFilterOption] = React.useState<any>({
    subject_code: [],
    register_pitching_status: [],
    relationship_status: [],
    searchValue: "",
  });

  //search
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();

    setFilterOption((prevFilterOption: any) => ({
      ...prevFilterOption,
      searchValue: searchValue,
    }));

    if (searchValue === "") {
      setMergeData(mergeDataOrigin);
    } else {
      const filteredData = mergeDataOrigin.filter(
        (item: any) =>
          item?.group?.group_name?.toLowerCase().includes(searchValue) ||
          item?.register_pitching_status?.toLowerCase().includes(searchValue) ||
          item?.relationship_status?.toLowerCase().includes(searchValue) ||
          item?.subject_code?.toLowerCase().includes(searchValue)
      );
      setMergeData(filteredData);
    }
  };

  // hàm filter
  React.useEffect(() => {
    const filteredData = mergeDataOrigin.filter((item) => {
      console.log("item", item);
      if (
        filterOption.subject_code.length > 0 &&
        !filterOption.subject_code.includes(item.subject_code)
      ) {
        return false;
      }
      if (
        filterOption.register_pitching_status.length > 0 &&
        !filterOption.register_pitching_status.includes(
          item.register_pitching_status
        )
      ) {
        return false;
      }
      if (
        filterOption.relationship_status.length > 0 &&
        !filterOption.relationship_status.includes(item.relationship_status)
      ) {
        return false;
      }
      if (
        filterOption.searchValue &&
        !(
          item?.subject_code
            ?.toLowerCase()
            .includes(filterOption.searchValue) ||
          item?.group?.group_name
            ?.toLowerCase()
            .includes(filterOption.searchValue) ||
          item?.register_pitching_status
            ?.toLowerCase()
            .includes(filterOption.searchValue) ||
          item?.relationship_status
            ?.toLowerCase()
            .includes(filterOption.searchValue)
        )
      ) {
        return false;
      }
      return true;
    });
    setMergeData(filteredData);
  }, [filterOption, mergeDataOrigin]);

  if (loadingPitching) {
    return (
      <LoadingPitching
        onSearchChange={onSearchChange}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />
    );
  }

  return (
    <div>
      <HeaderLecturerBoardGroup
        onSearchChange={onSearchChange}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />

      <main className="mt-3 mb-5 grid grid-cols-4 gap-2">
        {Array.isArray(mergeData) && mergeData.length === 0 ? (
          <div className="text-center text-lg text-neutral-700">
            Không có nhóm phù hợp
          </div>
        ) : (
          mergeData.map((group, index) => (
            <CardGroup group={group} key={index} />
          ))
        )}
      </main>
    </div>
  );
};

export default LecturerBoard;
