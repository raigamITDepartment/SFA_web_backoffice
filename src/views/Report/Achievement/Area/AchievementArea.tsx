import React from 'react'
import Tabs from '@/components/ui/Tabs'
import MainCategoryAchievement from './Components/AreaMainCategoryAchievement'
import SubCategoryAchievement from './Components/AreaSubCategoryAchievement'
import SubSubCategoryAchievement from './Components/AreaSubSubCategoryAchievement'
import ItemWiseAchievement from './Components/AreaItemWiseAchievement'
const { TabNav, TabList, TabContent } = Tabs


const Default = () => {
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Main Category</TabNav>
                    <TabNav value="tab2">Sub-Category</TabNav>
                    <TabNav value="tab3">Sub-Sub Category</TabNav>
                    <TabNav value="tab4">Item Wise</TabNav>
                    
                    
                </TabList>
                <div className="py-3">
                    {/* Channel Creation */}
                    <TabContent value="tab1">
                        <MainCategoryAchievement/>
                    </TabContent>

                    {/* Sub-Channel Creation */}
                    <TabContent value="tab2">
                        <SubCategoryAchievement />
                    </TabContent>

                    {/* Region Creation */}
                    <TabContent value="tab3">
                        <SubSubCategoryAchievement />
                    </TabContent>

                    <TabContent value="tab4">
                        <ItemWiseAchievement/>
                    </TabContent>

                    

                    
                </div>
            </Tabs>
        </div>
    )
}

export default Default
