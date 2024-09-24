import React from "react";
import * as Switch from "@radix-ui/react-switch";

type FormSwitchProps = {
  id: string;
  label: string;
  active: boolean;
  setActive: () => void;
};

// eslint-disable-next-line react/display-name
const FormSwitch: React.FC<FormSwitchProps> = ({
  id,
  label,
  setActive,
  active,
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <Switch.Root
        className="bg-blackA6 shadow-blackA4 relative h-[25px] w-[42px] cursor-pointer rounded-full shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
        id="active"
        checked={active}
        onCheckedChange={setActive}
      >
        <Switch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  );
};

export default FormSwitch;
