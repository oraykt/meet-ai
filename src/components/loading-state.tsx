import { Loader2Icon } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export const LoadingState = ({ title = "Loading...", description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      <h2 className="text-lg font-medium">{title}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

{
  /* <div className="p-6 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <Loader2Icon className="size-6 animate-spin text-primary" />
          <h6 className="text-lg font-medium">{title}</h6>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div> */
}
