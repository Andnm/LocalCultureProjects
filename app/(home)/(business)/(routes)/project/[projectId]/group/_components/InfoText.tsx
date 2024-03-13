import { Typography } from "@material-tailwind/react";

const InfoText: React.FC<{ className?: string; children?: any }> = ({
  className,
  children,
}) => {
  return (
    <Typography
      variant="small"
      color="blue-gray"
      className={`font-normal ${className}`}
    >
      {children || ""}
    </Typography>
  );
};

export default InfoText;
