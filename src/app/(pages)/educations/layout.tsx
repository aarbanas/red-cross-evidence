"use client";
import { type FC, type PropsWithChildren } from "react";
import MainLayout from "~/components/layout/mainLayout";
import Tabs, { type TabProp } from "~/components/atoms/Tabs";

const EducationLayout: FC<PropsWithChildren> = ({ children }) => {
  const tabsData: TabProp[] = [
    {
      label: "Termini",
      link: "term",
    },
    {
      label: "Popis",
      link: "list",
    },
  ];

  return (
    <MainLayout headerChildren={<div>Edukacije</div>}>
      <div>
        <Tabs tabs={tabsData} />
        <main>{children}</main>
      </div>
    </MainLayout>
  );
};

export default EducationLayout;
