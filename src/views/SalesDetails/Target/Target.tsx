
import Tabs from '@/components/ui/Tabs'
import TerritoryWise from './Components/TerritoryWise'
import TerritoryWiseCategory from './Components/TerritoryWiseCategory'
import ItemWise from './Components/ItemWise'



const { TabNav, TabList, TabContent } = Tabs

const Default = () => {
    return (
        
        <div>

            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Territory Wise</TabNav>
                    <TabNav value="tab2">Territory Wise Category </TabNav>
                    <TabNav value="tab3">Item Wise</TabNav>
                   
                  
                </TabList>
                <div className="py-3">

                    {/* Territory Wise Target */}
                    <TabContent value="tab1"> 
                            <TerritoryWise/>
                    </TabContent>

                    <TabContent value="tab2">
                        <TerritoryWiseCategory/>
                    </TabContent>   

                    <TabContent value="tab3">
                        <ItemWise/>
                    </TabContent>     


                  
                </div>
            </Tabs>
        </div>
    )
}

export default Default
