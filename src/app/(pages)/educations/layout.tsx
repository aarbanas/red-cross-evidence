'use client'
import type { FC, PropsWithChildren } from 'react'
import Tabs, { type TabProp } from '~/components/atoms/Tabs'
import MainLayout from '~/components/layout/mainLayout'

const EducationLayout: FC<PropsWithChildren> = ({ children }) => {
  const tabsData: TabProp[] = [
    {
      label: 'Termini',
      link: 'term',
    },
    {
      label: 'Popis',
      link: 'list',
    },
  ]

  return (
    <MainLayout headerChildren={<div>Edukacije</div>}>
      <div>
        <Tabs tabs={tabsData} />
        <main>{children}</main>
      </div>
    </MainLayout>
  )
}

export default EducationLayout
