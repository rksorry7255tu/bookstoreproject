import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [Carts, setCarts] = useState();
  const [Total, setTotal] = useState(0);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  //getting added cart
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/v1/get-user-cart-book",
        { headers }
      );
      setCarts(response.data.data);
      //console.log(response.data.data);
    };
    fetch();
  }, [Carts]);

  //deleting cart item
  const deleteItem = async (bookid) => {
    const response = await axios.put(
      `http://localhost:3001/api/v1/delete-From-Cart/${bookid}`,
      {},
      { headers }
    );
    //console.log(response.data);
    alert(response.data.message);
  };

  //updating total order price
  useEffect(() => {
    if (Carts && Carts.length > 0) {
      let total = 0;
      Carts.map((items) => {
        total = total + items.price;
      });
      setTotal(total);
    }
  }, [Carts]);

  //place order-Problem is that it can not be able to delete the items from cart after order
  const PlaceOrder = async () => {
    try {
      navigate("/RazorPay", { state: { total: Total } });
      const response = await axios.post(
        "http://localhost:3001/api/v1/place-order",
        { order: Carts },
        { headers }
      );
      //console.log(response.data);
      // alert(response.data.message);
      //navigate("/profile/orderHistory");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-zinc-900 px-12 h-[100%] py-8 ">
      {!Carts && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      {Carts && Carts.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
              Empty Cart
            </h1>
            <img
              src="./empty-cart.png"
              alt="empty-cart"
              className="lg:h-[50vh]"
            />
          </div>
        </div>
      )}
      {Carts && Carts.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
            Your Cart
          </h1>
          {Carts.map((items, index) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center "
              key={index}
            >
              <img
                src={items.url}
                alt="/"
                className="h-[15vh] md:w-[10vh] object-cover"
              />
              <div className="w-full md:w-auto">
                <h1 className="text-3xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                  {items.title}
                </h1>
                <p className="text-normal text-zinc-300 mt-2 ">
                  {items.disc
                    ? items.disc.slice(0, 100)
                    : "No description available."}
                  ...
                </p>
                <p className="text-normal text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {items.desc
                    ? items.desc.slice(0, 100)
                    : "No description available."}
                  ...
                </p>
                <p className="text-normal text-zinc-300 mt-2 block md:hidden">
                  {items.disc
                    ? items.disc.slice(0, 100)
                    : "No description available."}
                  ...
                </p>
              </div>
              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 text-3xl font-semibold flex ">
                  ₹ {items.price}
                </h2>
                <button
                  className="bg-red-100 textred-700 border border-red-700 rounded p-2 ms-12"
                  onClick={() => deleteItem(items._id)}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {Carts && Carts.length > 0 && (
        <div className="mt-4 w-full flex items-center justify-end">
          <div className="p-4 bg-zinc-800 rounded">
            <h1 className="text-3xl text-zinc-200 font-semibold">
              Total Amount
            </h1>
            <div className="mt-3 flex items-center justify-between text-xl text-zinc-200">
              <h2>{Carts.length} books</h2>
              <h2>₹{Total}</h2>
            </div>
            <div className="w-[100%] mt-3">
              <button
                className="bg-zinc-100 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-zinc-500"
                onClick={PlaceOrder}
              >
                Place your order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
