import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const agencies = ["Akurassa", "Matara", "Colombo"];

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
  const [selectedAgency, setSelectedAgency] = useState("");
  const [fromDate, setFromDate] = useState("2025-07-01");
  const [toDate, setToDate] = useState("2025-07-24");

  return (
    <div className="p-6 space-y-6">

     <Card className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 transition-all">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-16 h-16 flex items-center justify-center shadow-md border border-blue-200 dark:border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Example Agency</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    Distributor
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Example Distributor</div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    Territory
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Central C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>








      <Card>
        <h2 className="text-xl font-bold mb-4">
          Last Return Period: 2025-03-01 to 2025-03-31
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold block mb-1">Market Return Agency</label>
            <Select value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)}>
              <option value="">-Select Agency-</option>
              {agencies.map((agency) => (
                <option key={agency} value={agency}>
                  {agency}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Market Return From</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">To</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="bg-gray-100 p-3 rounded mb-4 space-y-2 text-sm">
          <div>
            <span className="font-bold">Return Stock No:</span> MRET-0220251
          </div>
          <div>
            <span className="font-bold">Return Posting Date:</span> 07/24/2025
          </div>
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
