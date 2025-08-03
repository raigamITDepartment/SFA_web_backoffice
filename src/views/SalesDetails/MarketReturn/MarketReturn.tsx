import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";

const { Tr, Th, Td, THead, TBody } = Table;

const agencies = ["Akurassa", "Matara", "Colombo"];

const channelOptions = [
  { value: "National", label: "National" },
  { value: "Bakery", label: "Bakery" },
];
const subChannelOptions = [
  { value: "SubChannel1", label: "Sub Channel 1" },
  { value: "SubChannel2", label: "Sub Channel 2" },
];
const regionOptions = [
  { value: "Region1", label: "Region 1" },
  { value: "Region2", label: "Region 2" },
];
const areaOptions = [
  { value: "Area1", label: "Area 1" },
  { value: "Area2", label: "Area 2" },
];
const territoryOptions = [
  { value: "Territory1", label: "Territory 1" },
  { value: "Territory2", label: "Territory 2" },
];
const agencyOptions = [
  { value: "Agency1", label: "Agency 1" },
  { value: "Agency2", label: "Agency 2" },
];

const items = [
  {
    line: 733,
    code: "RMDD0144FD",
    description: "Deveni Batha and Double Chicken Door Panel",
    unitPrice: 0.01,
  },
  {
    line: 1,
    code: "RMSO095GPR",
    description: "Prawn Soya 90g",
    unitPrice: 139.2,
  },
  {
    line: 2,
    code: "RMSO095GCH",
    description: "Chicken Soya -90gr",
    unitPrice: 139.2,
  },
  {
    line: 3,
    code: "RMSO095GAM",
    description: "Ambul Thiyal Soya 90g",
    unitPrice: 147.6,
  },
  {
    line: 4,
    code: "RMSO095GNC",
    description: "Normal Curry Soya -90g",
    unitPrice: 0.0,
  },
  {
    line: 5,
    code: "RMSO095GHC",
    description: "Extra Hot Curry Soya -95g",
    unitPrice: 139.2,
  },
];

export default function MarketReturn() {
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("2025-07-01");
  const [toDate, setToDate] = useState("2025-07-24");

  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedSubChannel, setSelectedSubChannel] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">View Market Return</h2>

      {/* Agency Filter */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Agency Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "channel", label: "Channel", value: selectedChannel, setValue: setSelectedChannel, options: channelOptions },
            { id: "subchannel", label: "Sub Channel", value: selectedSubChannel, setValue: setSelectedSubChannel, options: subChannelOptions },
            { id: "region", label: "Region", value: selectedRegion, setValue: setSelectedRegion, options: regionOptions },
            { id: "area", label: "Area", value: selectedArea, setValue: setSelectedArea, options: areaOptions },
            { id: "territory", label: "Territory", value: selectedTerritory, setValue: setSelectedTerritory, options: territoryOptions },
            { id: "agency", label: "Agency", value: selectedAgency, setValue: setSelectedAgency, options: agencyOptions },
          ].map(({ id, label, value, setValue, options }) => (
            <div key={id} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <Select
                id={`filter-${id}`}
                options={options}
                value={options.find((opt) => opt.value === value) || null}
                onChange={(opt) => setValue(opt?.value ?? null)}
                placeholder={`Select ${label}`}
                isClearable
              />
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <Button
            onClick={() => {
              setSelectedChannel(null);
              setSelectedSubChannel(null);
              setSelectedRegion(null);
              setSelectedArea(null);
              setSelectedTerritory(null);
              setSelectedAgency(null);
            }}
          >
            Reset
          </Button>
          <Button variant="solid" className="bg-blue-600 text-white">
            Submit
          </Button>
        </div>
      </Card>

      {/* Agency Info Card */}
      <Card className="border border-blue-100 dark:border-gray-700">
        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 flex items-center justify-center border rounded-xl">
            <svg className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Example Agency</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border rounded-lg">
                <p className="text-sm text-gray-500">Distributor</p>
                <p className="font-semibold">Example Distributor</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border rounded-lg">
                <p className="text-sm text-gray-500">Territory</p>
                <p className="font-semibold">Central</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Date Picker Card */}
      <Card>
        <h2 className="text-xl font-bold mb-4">
          Last Return Period: 2025-03-01 to 2025-03-31
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="font-semibold block mb-1">Market Return From</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold block mb-1">To</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Summary + Table */}
      <Card>
        <div className="bg-gray-100 p-3 rounded mb-4 space-y-2 text-sm">
          <div><strong>Return Stock No:</strong> MRET-0220251</div>
          <div><strong>Return Posting Date:</strong> 07/24/2025</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-red-500 text-white p-4 rounded-md text-center font-bold">
            Actual Ret Value (Invoice Price): <br /> 21,865.50
          </div>
          <div className="bg-blue-100 p-4 rounded-md text-center font-bold">
            Adjusted Ret. Value: <br /> 22,936.00
          </div>
        </div>

        <Table>
          <THead>
            <Tr>
              <Th>Line</Th>
              <Th>Item Code</Th>
              <Th>Description</Th>
              <Th>Unit Price</Th>
              <Th>Adj. Return Qty</Th>
              <Th>Return Qty</Th>
              <Th>Total Value</Th>
              <Th>Select</Th>
            </Tr>
          </THead>
          <TBody>
            {items.map((item) => (
              <Tr key={item.code}>
                <Td className="text-center">{item.line}</Td>
                <Td className="text-center">{item.code}</Td>
                <Td>{item.description}</Td>
                <Td className="text-right">{item.unitPrice.toFixed(2)}</Td>
                <Td className="text-center">
                  <Input type="number" defaultValue="0" className="w-20 text-center" />
                </Td>
                <Td className="text-right">0.00</Td>
                <Td className="text-center">
                  <Input type="checkbox" />
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="primary">Post</Button>
        <Button variant="outline">Print</Button>
      </div>
    </div>
  );
}
