import React, { useState } from 'react'
import OutletFilter, { FormSchema } from './OutletFilter'
import OutletListTable from './OutletListTable'
import type { DemarcationRoute } from '@/services/DemarcationService'

const OutletPage = () => {
  const [filteredData, setFilteredData] = useState<DemarcationRoute[]>([])

  const handleFilterSubmit = (form: FormSchema, filtered: DemarcationRoute[]) => {
    setFilteredData(filtered)
  }

  return (
    <div className="space-y-6">
      <OutletFilter onSubmitData={handleFilterSubmit} />
      <OutletListTable customData={filteredData} />
    </div>
  )
}

export default OutletPage