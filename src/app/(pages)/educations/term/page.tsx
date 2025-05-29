"use client";
import TabLayout from "~/components/layout/tabLayout";
import { useState } from "react";
import EducationsTermSearch from "~/app/(pages)/educations/term/EducationsTermSearch";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import EducationsTerm from "~/app/(pages)/educations/term/EducationsTerm";

const EducationsEvidencePage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const handleSearch = (newFilter: Record<string, string> | undefined) => {
    setFilter(newFilter);
  };

  return (
    <TabLayout>
      <div className="flex">
        <EducationsTermSearch onSearch={handleSearch} />
        <div className="ml-auto mt-auto h-1/2 rounded-md border px-2">
          <Link
            className="flex gap-2"
            href={{
              pathname: `/educations/term/create`,
            }}
          >
            <CirclePlus />
            Kreiraj novi termin
          </Link>
        </div>
      </div>

      <EducationsTerm filter={filter} />
    </TabLayout>
  );
};

export default EducationsEvidencePage;
