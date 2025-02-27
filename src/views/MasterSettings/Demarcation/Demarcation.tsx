
import Tabs from '@/components/ui/Tabs'
import Channel from './Components/Channel'
import Region from './Components/Region'


const { TabNav, TabList, TabContent } = Tabs

const Default = () => {
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Channel</TabNav>
                    <TabNav value="tab2">Region</TabNav>
                    <TabNav value="tab3">Area</TabNav>
                    <TabNav value="tab4">Territory</TabNav>
                    <TabNav value="tab5">Route</TabNav>
                    <TabNav value="tab6">Agency</TabNav>
                    <TabNav value="tab7">Final</TabNav>
                </TabList>
                <div className="p-4">

                    {/* Channel Creation */}
                    <TabContent value="tab1"> 
                            <Channel/>
                    </TabContent>

                    <TabContent value="tab2">
                            <Region/>
                    </TabContent>
                    <TabContent value="tab3">
                        <p>
                            In C++ its harder to shoot yourself in the foot, but
                            when you do, you blow off your whole leg. (Bjarne
                            Stroustrup)
                        </p>
                    </TabContent>
                    <TabContent value="tab4">
                        <p>
                            In C++ its harder to shoot yourself in the foot, but
                            when you do, you blow off your whole leg. (Bjarne
                            Stroustrup)
                        </p>
                    </TabContent>
                    <TabContent value="tab5">
                        <p>
                            In C++ its harder to shoot yourself in the foot, but
                            when you do, you blow off your whole leg. (Bjarne
                            Stroustrup)
                        </p>
                    </TabContent>
                    <TabContent value="tab6">
                        <p>
                            In C++ its harder to shoot yourself in the foot, but
                            when you do, you blow off your whole leg. (Bjarne
                            Stroustrup)
                        </p>
                    </TabContent>
                    <TabContent value="tab7">
                        <p>
                            In C++ its harder to shoot yourself in the foot, but
                            when you do, you blow off your whole leg. (Bjarne
                            Stroustrup)
                        </p>
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default Default
