"use client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import supabase from "@/lib/supabaseClient";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const Dashboard = () => {
  const [options, setOptions] = useState({
    data: [
      { month: "Jan", avgTemp: 2.3, iceCreamSales: 162000 },
      { month: "Mar", avgTemp: 6.3, iceCreamSales: 302000 },
      { month: "May", avgTemp: 16.2, iceCreamSales: 800000 },
      { month: "Jul", avgTemp: 22.8, iceCreamSales: 1254000 },
      { month: "Sep", avgTemp: 14.5, iceCreamSales: 950000 },
      { month: "Nov", avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    // Series: Defines which chart type and data to use
    series: [{ type: "bar", xKey: "month", yKey: "iceCreamSales" }],
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("transaction").select();
      if (error) alert(error);
      else setRowData(data);
      console.log(data);
    };
    fetchData();
  }, [supabase]);

  const [rowData, setRowData] = useState([
    { name: "", title: "", order_date: "" },
  ]);

  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "title" },
    { field: "order_date" },
  ]);

  return (
    <div className="w-[100%] h-[100svh] flex flex-col items-center bg-slate-950 gap-2">
      <div className="flex flex-wrap">
        <div></div>
      </div>
      <div className="w-[95%] h-[40svh] border rounded">
        <AgCharts options={options} style={{ width: 370, height: 300 }} />
      </div>

      <div className="w-[95%] h-[40svh] border rounded">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          style={{ height: 400, width: 300 }}
        />
      </div>
    </div>
  );
};

export default Dashboard;

{
  /* <div style={{ height: 500, width: 400 }} className="bg-blue-600">
<AgGridReact
  rowData={rowData}
  columnDefs={colDefs}
  style={{ height: 500, width: 400 }}
/>
</div> */
}
