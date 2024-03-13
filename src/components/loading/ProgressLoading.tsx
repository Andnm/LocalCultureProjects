import { formatDate } from "@/src/utils/handleFunction";
import { FlagIcon } from "lucide-react";
import React from "react";

interface ProgressLoadingProps {
  phaseData: any[];
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Processing":
      return "bg-orange-600 text-orange-300";
    case "Done":
      return "bg-green-600 text-green-300";
    case "Warning":
      return "bg-red-600 text-red-300";
    case "Pending":
      return "bg-gray-600 text-gray-300";
    default:
      return "bg-teal-300 text-teal-600";
  }
};

const getDaysDifference = (startDate: Date, endDate: Date): number => {
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  return Math.round(diffInDays);
};

const ProgressLoading = ({ phaseData }: ProgressLoadingProps) => {
  return (
    <div className="flex justify-center flex-wrap">
      {phaseData?.map((item, index) => {
        const startDate = new Date(item.phase_start_date);
        const endDate = new Date(item.phase_expected_end_date);
        const today = new Date();

        const daysTotal = getDaysDifference(startDate, endDate);
        const daysPassed = getDaysDifference(startDate, today);
        const percentage = (daysPassed / daysTotal) * 100;

        return (
          <div className="relative pb-4 max-w-3xl" key={index}>
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span
                  className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(
                    item.phase_status
                  )}`}
                >
                  {item.phase_status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block">
                  {formatDate(item.phase_expected_end_date)}
                </span>
              </div>
            </div>

            <div
              className="flex rounded-full h-2 bg-gray-200"
              style={{ width: "300px" }}
            >
              <div
                style={{ width: `${percentage}%` }}
                className={`rounded-full ${getStatusColor(item.phase_status)}`}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-semibold">
                {formatDate(item.phase_start_date)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressLoading;
