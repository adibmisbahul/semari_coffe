"use client";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeMaterial,
} from "ag-grid-community";
import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import supabase from "@/lib/supabaseClient";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const Dashboard = () => {
  const [orderToday, setOrderToday] = useState();
  const [uangMasuk, setUangMasuk] = useState();
  const gridStyle = useMemo(() => ({ height: "70%", width: "90%" }), []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("transaction").select();
      if (error) alert(error);
      else setRowData(data);
      setOrderToday(data.length);
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

  const total = rowData.reduce((acc, item) => acc + item.price, 0);
  console.log(total);

  return (
    <div className="w-[100%] h-[100svh] flex flex-col items-center bg-slate-950 gap-2">
      <div className="flex flex-wrap text-white w-full p-2 gap-2 justify-center">
        <div className="border rounded w-[48%] h-24 border-zinc-600 p-1">
          <h1>order today</h1>
          <h1>{orderToday}</h1>
        </div>
        <div className="border rounded  w-[48%] h-24 border-zinc-600 p-1 ">
          <h1>Uang masuk</h1>
          <h1>{total}</h1>
        </div>
      </div>

      <div style={gridStyle} className="the">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          theme={themeMaterial}
        />
      </div>
    </div>
  );
};

export default Dashboard;
