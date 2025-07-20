"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";

export default function Home() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [customerName, setCustomerName] = useState();

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from("product").select();
      if (error) console.error(error);
      else setMenus(data);
    };
    console.log(menus);
    fetchMenus();
  }, [supabase]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const handleShowPopUP = () => {
    setShowPopUp(true);
  };

  const totalHarga = cart.reduce((total, item) => total + item.price, 0);

  const clocePopUp = () => {
    setCart([]);
    setShowPopUp(false);
  };

  const handleCustomerName = (e) => {
    setCustomerName(e.target.value);
  };

  const paymentProces = async () => {
    if (!customerName || customerName.trim() === "") {
      alert("Nama tidak bolek kosong");
      return;
    } else {
      const { error } = await supabase.from("transaction").insert(
        cart.map((item) => ({
          title: item.title,
          price: item.price,
          name: customerName,
        }))
      );

      if (error) {
        console.error("Insert error:", error.message);
      } else {
        alert("payment succes");
        setCustomerName("");
        setCart([]);
        setShowPopUp(false);
      }
    }
  };

  return (
    <div
      className="bg-slate-950 flex flex-wrap justify-center gap-2 pt-2 h-[100svh] overflow-y-hidden
    "
    >
      <div
        className="flex flex-wrap justify-center gap-1 pt-2 overflow-auto h-[80vh]
text-white "
      >
        {menus.map((menu) => {
          return (
            <div
              key={menu.id}
              onClick={() => addToCart(menu)}
              className="border rounded border-zinc-600 p-2"
            >
              <Image
                src={menu.image}
                width={110}
                height={100}
                alt="halo"
                className="rounded h-[150px] object-cover"
              />
              <h1>{menu.title}</h1>
              <p className="text-xs">{menu.price}</p>
              <button onClick={() => addToCart(menu)}>+</button>
            </div>
          );
        })}
      </div>

      {showPopUp && (
        <div className="text-white flex flex-col w-[90%] h-[50vh] bg-slate-950 shadow border absolute top-40 p-2 rounded justify-center">
          <div>
            <h1 onClick={clocePopUp}>x</h1>
          </div>
          <div>
            <input
              type="text"
              className="h-[5vh] w-full border rounded border-zinc-600"
              placeholder="atas nama"
              onChange={handleCustomerName}
            />
          </div>
          <div className="w-full h-[70%] pt-2">
            {cart.map((item, index) => {
              return (
                <div className="flex justify-start gap-6" key={index}>
                  <ul className="flex gap-2">
                    <li key={index} className="flex items-center gap-2 mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{item.title}</span>
                      <span className="ml-auto">{item.price}</span>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>

          <button
            onClick={paymentProces}
            className="bg-blue-600 w-[100%] text-center rounded text-white h-[5vh]"
          >
            proces
          </button>
        </div>
      )}
      <div className="w-full h-[7vh]  flex items-center justify-center gap-2">
        <div
          className="flex bg-red-600 w-[25vw] justify-center text-white h-[7vh] items-center rounded gap-6"
          onClick={handleShowPopUP}
        >
          <h1>item {cart.length}</h1>
        </div>
        <div
          className="flex bg-blue-600 w-full justify-center text-white h-[7vh] items-center rounded gap-6"
          onClick={handleShowPopUP}
        >
          <h1>Total : {totalHarga}</h1>
        </div>
        <div className="bg-blue-600 h-[7vh] text-white w-[20vw] flex items-center justify-center rounded">
          <a href="/dashboard ">list</a>
        </div>
      </div>
    </div>
  );
}
