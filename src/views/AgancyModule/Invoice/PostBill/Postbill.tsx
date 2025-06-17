import React from 'react';
import Tabs from '@/components/ui/Tabs';
import PrintBill from './Components/PrintBill'; 
import LateDelivery from './Components/LateDelivary'; 
import CancelBill from './Components/CancelBill'; 

const { TabNav, TabList, TabContent } = Tabs;

function Postbill() {
  return (
    <div className="p-6">
      <Tabs defaultValue="postInvoice">
        <TabList>
          <TabNav value="postInvoice">Post Invoice</TabNav>
          <TabNav value="lateDelivery">Late Delivery</TabNav>
          <TabNav value="canceled">Canceled</TabNav>
        </TabList>
        
        <div className="mt-4">
          <TabContent value="postInvoice">
            <PrintBill />
          </TabContent>
          
          <TabContent value="lateDelivery">
            <LateDelivery />
          </TabContent>
          
          <TabContent value="canceled">
            <CancelBill />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Postbill;