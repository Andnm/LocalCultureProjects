import { getColorByProjectStatus } from "@/src/utils/handleFunction";

const StatusCell: React.FC<{ status: string; classes: string }> = ({
  status,
  classes,
}) => {
  return (
    <td className={classes}>
      <div className="w-max">
        <p
          className={`py-1 px-2 font-bold uppercase text-xs ${getColorByProjectStatus(
            status
          )}`}
          style={{ borderRadius: "7px" }}
        >
          {status}
        </p>
      </div>
    </td>
  );
};

export default StatusCell
