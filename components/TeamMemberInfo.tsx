import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaFacebook } from "react-icons/fa6";

interface TeamMemberInfoProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
  dataMember?: any;
}

export const TeamMemberInfo = ({
  children,
  side,
  sideOffset = 0,
  dataMember,
}: TeamMemberInfoProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          side={side}
          className="text-sm break-words bg-white p-1 "
        >
          <div className="w-full bg-gray-100 px-5 pt-8 pb-5">
            <div className="relative mt-16 max-w-sm mx-auto ">
              <div className="rounded overflow-hidden shadow-md bg-white">
                <div className="absolute -mt-20 w-full flex justify-center">
                  <div className="h-32 w-32">
                    <img
                      src={dataMember?.image}
                      className="rounded-full object-cover h-full w-full shadow-md object-top"
                    />
                  </div>
                </div>

                <div className="px-6 mt-16 mb-5">
                  <h1 className="font-bold text-xl text-center mb-1">
                    {dataMember?.name}
                  </h1>

                  {dataMember?.detail.map((item: any, index: number) => (
                    <p
                      key={index}
                      className={`text-gray-800 text-sm text-justify mb-2`}
                    >
                      {item}
                    </p>
                  ))}
                </div>

                {/* liên lạc */}
                <div className="w-full flex justify-center pb-5 gap-2">
                  {dataMember?.link_email && (
                    <div className="flex items-center space-x-2">
                      <img
                        className="w-5 h-5"
                        src="https://cdn.iconscout.com/icon/free/png-256/free-google-mail-4062821-3357707.png"
                        alt="gmail"
                      />
                      <p>{dataMember?.link_email}</p>
                    </div>
                  )}

                  {dataMember?.phone && (
                    <div className="flex items-center space-x-2">
                      <img
                        className="w-5 h-5"
                        src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/phone-icon.png"
                        alt="phone"
                      />
                      <p>{dataMember?.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
