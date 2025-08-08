
import Tabs from '@/components/ui/Tabs'
import MainCategory from './Components/MainCategory'
import SubCategory from './Components/SubCategory'
import Category from './Components/SubSubCategory'
import CategoryType from './Components/CategoryType'


const { TabNav, TabList, TabContent } = Tabs

const Default = () => {
    return (
        
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Category Type</TabNav>
                    <TabNav value="tab2">Main Category</TabNav>
                    <TabNav value="tab3">Sub-Category</TabNav>
                    <TabNav value="tab4">Sub-sub Category</TabNav>
                  
                </TabList>
                <div className="py-3">

                    <TabContent value="tab1"> 
                            <CategoryType/>
                    </TabContent>

                    {/* Channel Creation */}
                    <TabContent value="tab2"> 
                            <MainCategory/>
                    </TabContent>

                    {/* Sub-Channel Creation */}
                    <TabContent value="tab3">
                            <SubCategory/>
                    </TabContent>

                    {/* Region Creation */}
                    <TabContent value="tab4">
                            <Category/>
                    </TabContent>

                  
                </div>
            </Tabs>
        </div>
    )
}

export default Default
