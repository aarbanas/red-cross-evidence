'use client'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import EducationsTerm from '~/app/(pages)/educations/term/EducationsTerm'
import EducationsTermSearch from '~/app/(pages)/educations/term/EducationsTermSearch'
import TabLayout from '~/components/layout/tabLayout'

const EducationsEvidencePage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  )

  const handleSearch = (newFilter: Record<string, string> | undefined) => {
    setFilter(newFilter)
  }

  return (
    <TabLayout>
      <div className="flex">
        <EducationsTermSearch onSearch={handleSearch} />
        <div className="mt-auto ml-auto h-1/2 rounded-md border px-2">
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
  )
}

export default EducationsEvidencePage
