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
    const filterOrderToday = async () => {
      [0];
      const { data, error } = await supabase
        .from("transaction")
        .select()
        .eq("order_date", filterDate);
      if (error) {
        console.log(error);
      } else {
        const time = data.map((data) => data.time);
        console.log(data);
        setRowData(data);
        setOrderToday(data.length);
      }
    };

    filterOrderToday();
  }, [filterDate, supabase]);

  const [rowData, setRowData] = useState([
    {
      name: "",
      title: "",
    },
  ]);

  const [status, setStatus] = useState();
  const updateStatus = async (id) => {
    const { data, error } = await supabase
      .from("transaction")
      .update({ status: true })
      .eq("id", id);

    if (error) {
      console.error("Gagal update:", error);
    } else {
      // Update data di rowData agar langsung berubah di tampilan
      setRowData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: true } : item))
      );
    }
  };

  const [colDefs, setColDefs] = useState([
    {
      headerName: "Proces",
      field: "proses",
      width: 70,
      cellRenderer: (params) => {
        const isDone = params.data.status === true;
        return (
          <button
            className={`text-sm px-2 py-1 rounded ${
              isDone ? "text-green-400" : "text-yellow-400"
            }`}
            onClick={() => updateStatus(params.data.id)}
            disabled={isDone}
          >
            {isDone ? "success" : "proses"}
          </button>
        );
      },
    },
    { field: "name", width: 120 },
    { field: "title", width: 120 },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params) => {
        return (
          <button
            onClick={() => handleDelete(params.data)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        );
      },
    },
  ]);

  const total = rowData.reduce((acc, item) => acc + item.price, 0);
  console.log(total);

  const handleDelete = async (row) => {
    const { data, error } = await supabase.from("transaction").delete().match({
      name: row.name,
      title: row.title,
      order_date: row.order_date,
    });

    if (error) {
      console.error("Delete failed", error);
    } else {
      console.log("Deleted:", data);
      setRowData((prev) => prev.filter((item) => item !== row));
    }
  };

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

      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          getRowStyle={() => ({
            backgroundColor: "#020618",
          })}
        />
      </div>
    </div>
  );
};

export default Dashboard;
