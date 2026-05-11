'use client'
import { useParams } from 'next/navigation'
import EducationForm from '~/app/(pages)/educations/list/[id]/_components/EducationsForm'
import TabLayout from '~/components/layout/tabLayout'
import LoadingSpinner from '~/components/organisms/loadingSpinner/LoadingSpinner'
import { api } from '~/trpc/react'

export default function EducationDetailPage() {
  const { id } = useParams()

  // Fetch unique types
  const { data: uniqueTypesData } = api.education.list.getUniqueTypes.useQuery()

  const { data, isLoading, error } = api.education.list.findById.useQuery(
    { id: id as string },
    { enabled: id !== 'create' },
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Greška</div>
  }

  const uniqueTypes = uniqueTypesData ?? []

  return (
    <TabLayout>
      <div>
        {(id === 'create' || data) && (
          <EducationForm
            id={id as string}
            formData={{
              type: data?.type ?? '',
              title: data?.title ?? '',
              description: data?.description ?? '',
              precondition: data?.precondition ?? '',
              duration: data?.duration ?? '',
              lecturers: data?.lecturers ?? '',
              courseDuration: data?.courseDuration ?? '',
              renewalDuration: data?.renewalDuration ?? '',
              topics: data?.topics ?? '',
            }}
            uniqueTypes={uniqueTypes}
          />
        )}
      </div>
    </TabLayout>
  )
}
