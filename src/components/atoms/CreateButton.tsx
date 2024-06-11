import React from "react";
import { Button } from "~/components/atoms/Button";
import { CirclePlusIcon } from "lucide-react";

type Props = {
  onClick: () => void;
  title: string;
  className?: string;
};

const CreateButton: React.FC<Props> = ({ onClick, title, className }) => {
  return (
    <Button
      className={`inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      onClick={onClick}
    >
      <CirclePlusIcon className="mr-2 h-5 w-5" />
      {title}
    </Button>
  );
};

export default CreateButton;
