import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import CustomerListTable from './components/CustomerListTable'
import CustomerListActionTools from './components/CustomerListActionTools'
import CustomersListTableTools from './components/CustomersListTableTools'
import CustomerListSelected from './components/CustomerListSelected'
import OutletFilter from './components/OutletFilter'

const CustomerList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Customers(Outlets)</h3>
                            {/* <CustomerListActionTools /> */}
                        </div>
                        {/* <CustomersListTableTools /> */}
                        <OutletFilter onSubmit={() => {}} />
                        <CustomerListTable />
                    </div>
                </AdaptiveCard> 
            </Container>
            <CustomerListSelected />
        </>
    )
}

export default CustomerList

