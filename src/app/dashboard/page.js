"use client";
import "../dashboard/agGrid.css";
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
  const gridStyle = useMemo(() => ({ height: "70%", width: "95%" }), []);
  const today = new Date().toISOString().split("T");

  const [filterDate, setfilterDate] = useState(today);

  const handleFilterDate = (e) => {
    setfilterDate(e.target.value);
  };

  useEffect(() => {
    const today = filterDate.toString().split("T")[0];
    const filterOrderToday = async () => {
      [0];
      console.log(today);
      const { data, error } = await supabase
        .from("transaction")
        .select()
        .eq("order_date", filterDate);
      if (error) {
        console.log(error);
      } else {
        setRowData(data);
        setOrderToday(data.length);
      }
    };

    filterOrderToday();
  }, [filterDate, supabase]);

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
      <input
        placeholder=""
        type="date"
        className="text-white border-zinc-600 border rounded w-[95%] h-10 p-2 mt-2"
        onChange={handleFilterDate}
      />
      <div className="flex flex-wrap text-white w-full p-2 gap-2 justify-center">
        <div className="border rounded w-[48%] h-24 border-zinc-600 pl-[4vw] pt-2">
          <h1>order today</h1>
          <h1 className="text-2xl font-semibold text-blue-700 text-center">
            {orderToday}
          </h1>
        </div>
        <div className="border rounded  w-[48%] h-24 border-zinc-600 pl-[4vw] pt-2">
          <h1>profit</h1>
          <h1 className="text-2xl text-lime-500 font-semibold text-center ">
            {total}
          </h1>
        </div>
      </div>

      <div style={gridStyle} className="themematerial !text-white">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          theme={themeMaterial}
          getRowStyle={() => ({
            backgroundColor: "#020618",
          })}
        />
      </div>
    </div>
  );
};

export default Dashboard;
