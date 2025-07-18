"use client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import supabase from "@/lib/supabaseClient";

ModuleRegistry.registerModules([AllCommunityModule]);

const Dashboard = () => {
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
    { name: "Tesla", title: "Model Y", order_date: "" },
  ]);

  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "title" },
    { field: "order_date" },
  ]);

  return (
    <div className="w-[100%] h-[100svh] flex flex-col items-center">
      <div className="w-[95%] h-[50svh] border rounded">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          style={{ height: 500, width: 400 }}
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
