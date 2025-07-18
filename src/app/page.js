"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";

export default function Home() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [customerName, setCustomerName] = useState([]);

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

  const product = [
    { title: "matcha", price: 12000 },
    { title: "latte", price: 12000 },
  ];

  const paymentProces = async () => {
    const { data, error } = await supabase.from("transaction").insert(
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
      setCart([]);
      setShowPopUp(false);
    }
  };

  useEffect(() => {
    // console.log(cart);
    // console.log(menus);
    // console.log(totalHarga);
    console.log(product);
  });

  return (
    <div className="flex flex-wrap justify-center gap-2 pt-2">
      {menus.map((menu) => {
        return (
          <div key={menu.id} onClick={() => addToCart(menu)}>
            <Image
              src={menu.image}
              width={110}
              height={100}
              alt="halo"
              className="rounded h-[200px] object-cover"
            />
            <h1>{menu.title}</h1>
            <p className="text-xs">{menu.price}</p>
            <button onClick={() => addToCart(menu)}>+</button>
          </div>
        );
      })}
      {showPopUp && (
        <div className="flex flex-col w-[90%] h-[50vh] bg-white shadow border absolute top-40 p-2 rounded justify-center">
          <div>
            <h1 onClick={clocePopUp}>x</h1>
          </div>
          <div>
            <input
              type="text"
              className="h-[5vh] w-full border rounded border-black"
              placeholder="atas nama"
              onChange={handleCustomerName}
            />
          </div>
          <div className="w-full h-[70%]">
            {cart.map((item, index) => {
              return (
                <div className="flex justify-start gap-6" key={index}>
                  <ul className="flex gap-2">
                    <li key={index} className="flex items-center gap-2 mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-cover"
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
      <div
        className="flex fixed top-170 bg-blue-400 w-3/4 justify-center text-white h-[6vh] items-center rounded gap-6"
        onClick={handleShowPopUP}
      >
        <h1>Total : {totalHarga}</h1>
      </div>
    </div>
  );
}
