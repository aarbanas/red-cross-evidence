import * as Switch from '@radix-ui/react-switch';
import type React from 'react';

type FormSwitchProps = {
  id: string;
  label: string;
  active: boolean;
  setActive(checked: boolean): void;
};

const FormSwitch: React.FC<FormSwitchProps> = ({
  id,
  label,
  setActive,
  active,
}) => {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id}>{label}</label>
      <Switch.Root
        className="relative h-[25px] w-[42px] cursor-pointer rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
        id="active"
        checked={active}
        onCheckedChange={setActive}
      >
        <Switch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  );
};

export default FormSwitch;
