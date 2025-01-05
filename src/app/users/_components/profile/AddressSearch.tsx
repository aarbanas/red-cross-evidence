"use client";

import { type FC } from "react";
import { api } from "~/trpc/react";
import { type GroupBase } from "react-select";
import AsyncSelect, { type AsyncProps } from "react-select/async";

type AddressSearchProps = Omit<
  AsyncProps<unknown, false, GroupBase<unknown>>,
  "loadOptions"
>;

type Option = {
  id: string;
  label: string;
};

const AddressSearch: FC<AddressSearchProps> = (props) => {
  const utils = api.useUtils();

  const loadOptions = async (input: string) => {
    const items = await utils.address.search.fetch({
      street: input,
    });

    return items.map<Option>((item) => ({
      id: item.address.id,
      label: `${item.address.street}, ${item.city.name}`,
    }));
  };

  return <AsyncSelect loadOptions={loadOptions} {...props} />;
};

AddressSearch.displayName = "AddressSearch";

export { AddressSearch };
