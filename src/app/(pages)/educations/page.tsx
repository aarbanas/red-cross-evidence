"use client";
import MainLayout from "~/components/layout/mainLayout";
import Tabs, { type TabProp } from "~/components/atoms/Tabs";
import EducationsListTab from "~/app/(pages)/educations/_components/List/EducationsListTab";
import EducationsEvidenceTab from "~/app/(pages)/educations/_components/Evidence/EducationsEvidenceTab";

const Educations = () => {
  const tabsData: TabProp[] = [
    {
      label: "Evidencija provođenja edukacija",
      queryParam: "evidencija",
      content: <EducationsEvidenceTab />,
    },
    {
      label: "Popis edukacija",
      queryParam: "popis",
      content: <EducationsListTab />,
    },
  ];

  return (
    <MainLayout headerChildren={<div>Educations</div>}>
      <Tabs tabs={tabsData} />
    </MainLayout>
  );
};

export default Educations;
