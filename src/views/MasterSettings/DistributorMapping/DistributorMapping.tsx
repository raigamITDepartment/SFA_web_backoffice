
import Tabs from '@/components/ui/Tabs'
import DistributorCreation from './Components/DistributorCreation'
import DistributorAgencyMapping from './Components/DistributorAgencyMapping'
import DistributorWarehouse from './Components/DistributorWarehouse'




const { TabNav, TabList, TabContent } = Tabs

const Default = () => {
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Distributor Creation</TabNav>
                    <TabNav value="tab2">Agency Mapping</TabNav>
                    <TabNav value="tab3">Warehouse Mapping</TabNav>
                </TabList>
                <div className="py-3">

                    {/* Distributor Creation */}
                    <TabContent value="tab1"> 
                            <DistributorCreation/>
                    </TabContent>

                    {/*  Distributor-Agency Mapping */}
                    <TabContent value="tab2">
                            <DistributorAgencyMapping/>
                    </TabContent>

                    {/*  Distributor-Agency Mapping */}
                    <TabContent value="tab3">
                            <DistributorWarehouse/>
                    </TabContent>

                </div>
            </Tabs>
        </div>
    )
}

export default Default
