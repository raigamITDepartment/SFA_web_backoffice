
import Tabs from '@/components/ui/Tabs'
import MainCategory from './Components/MainCategory'
import SubCategory from './Components/SubCategory'
import Category from './Components/Category'


const { TabNav, TabList, TabContent } = Tabs

const Default = () => {
    return (
        
        <div>

          <div>Category Add </div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Main Category</TabNav>
                    <TabNav value="tab2">Sub-Category</TabNav>
                    <TabNav value="tab3">Sub-sub Category</TabNav>
                  
                </TabList>
                <div className="py-3">

                    {/* Channel Creation */}
                    <TabContent value="tab1"> 
                            <MainCategory/>
                    </TabContent>

                    {/* Sub-Channel Creation */}
                    <TabContent value="tab2">
                            <SubCategory/>
                    </TabContent>

                    {/* Region Creation */}
                    <TabContent value="tab3">
                            <Category/>
                    </TabContent>

                  
                </div>
            </Tabs>
        </div>
    )
}

export default Default
