import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbSearch } from 'react-icons/tb'
import type { ChangeEvent } from 'react'
import Card from '@/components/ui/Card'
import { FiCalendar, FiUsers } from 'react-icons/fi'

type ProductListSearchProps = {
    onInputChange: (value: string) => void
}

const ProductListSearch = (props: ProductListSearchProps) => {
    const { onInputChange } = props
    const distributorName = 'MM Marketing'
    const agencyNames = ['Agency 1', 'Agency 2', 'Agency 3']

    function handleDebounceFn(value: string) {
        onInputChange?.(value)
    }

    const debounceFn = useDebounce(handleDebounceFn, 500)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <div className="w-full space-y-4">
            {/* Full-width Distributor Info Card */}
            <Card className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md bg-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Date Section */}
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                        <div className="text-base font-semibold text-gray-800 dark:text-white">
                            {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>

                    {/* Distributor Section */}
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Distributor</div>
                        <div className="text-base font-semibold text-gray-800 dark:text-white">
                            {distributorName}
                        </div>

                        {/* Agencies */}
                        <div className="mt-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Agencies</div>
                            <div className="flex flex-wrap gap-2">
                                {agencyNames.map((agency, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                                    >
                                        {agency}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Right-aligned search input below the card */}
            <div className="flex justify-end">
                <Input
                    id="search"
                    placeholder="Search..."
                    suffix={<TbSearch className="text-lg" />}
                    onChange={handleInputChange}
                    className="w-full md:w-64"
                />
            </div>
        </div>
    )
}

export default ProductListSearch