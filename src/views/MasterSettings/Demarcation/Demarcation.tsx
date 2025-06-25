import Tabs from '@/components/ui/Tabs'
import Channel from './Components/Channel'
import Region from './Components/Region'
import SubChannel from './Components/SubChannel'
import Area from './Components/Area'
import AreaRegion from './Components/AreaRegion'
import Territory from './Components/Territory'
import Route from './Components/Route'
import Agency from './Components/Agency'

const { TabNav, TabList, TabContent } = Tabs

const Default = () => {
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Channel</TabNav>
                    <TabNav value="tab2">Sub-Channel</TabNav>
                    <TabNav value="tab3">Region</TabNav>
                    <TabNav value="tab4">Area</TabNav>
                    <TabNav value="tab5">Area Region Mapping</TabNav>
                    <TabNav value="tab6">Territory</TabNav>
                    <TabNav value="tab7">Route</TabNav>
                    <TabNav value="tab8">Agency</TabNav>
                </TabList>
                <div className="py-3">
                    {/* Channel Creation */}
                    <TabContent value="tab1">
                        <Channel />
                    </TabContent>

                    {/* Sub-Channel Creation */}
                    <TabContent value="tab2">
                        <SubChannel />
                    </TabContent>

                    {/* Region Creation */}
                    <TabContent value="tab3">
                        <Region />
                    </TabContent>

                    {/* Area Creation */}
                    <TabContent value="tab4">
                        <Area />
                    </TabContent>

                     <TabContent value="tab5">
                        <AreaRegion />
                    </TabContent>

                    {/* Territory Creation */}
                    <TabContent value="tab6">
                        <Territory />
                    </TabContent>

                    {/* Route Creation */}
                    <TabContent value="tab7">
                        <Route />
                    </TabContent>

                    {/* Agency Creation */}
                    <TabContent value="tab8">
                        <Agency />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default Default
