import axios from "axios";
import React, { useEffect } from "react";
import Loader from "../components/Loader/Loader";
import { useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const AllOrders = () => {
  const [AllOrders, setAllOrders] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/v1/get-all-orders",
        { headers }
      );
      setAllOrders(response.data.data);
    };
    fetch();
  }, []);
  return (
    <>
      {!AllOrders && (
        <div className="h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {AllOrders && AllOrders.length > 0 && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            All Orders
          </h1>
          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-8  ">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[40%] md:w-[22%]">
              <h1 className="">Books</h1>
            </div>
            <div className="w-0 md:w-[45%] hidden md:block">
              <h1 className="">Description</h1>
            </div>
            <div className="w-[17%] md:w-[9%]">
              <h1 className="">Price</h1>
            </div>
            <div className="w-[30%] md:w-[16%]">
              <h1 className="">Status</h1>
            </div>
            <div className="w-[10%] md:w-[5%]">
              <h1 className="">
                <FaUserLarge />
              </h1>
            </div>
          </div>
          {AllOrders.map((items, index) => (
            <div
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300 justify-between"
              key={index}
            >
              <div className="w-[3%]">
                <h1 className="text-center">{index + 1}</h1>
              </div>
              <div className="w-[30%] md:w-[22%]">
                <Link
                  // to={`/view-book-details/${items.book._id}`}
                  className="hover:text-blue-300"
                >
                  {/* {items.book.title} */}
                </Link>
              </div>
              <div className="w-[20%] md:w-[45%] hidden md:block">
                {/* <h1>
                  {items.book.disc
                    ? items.book.disc.slice(0, 50) + "..."
                    : "No description available"}
                </h1> */}
              </div>
              <div className="w-0 md:w-[45%] hidden md:block">
                <h1 className="">{items.book.price}</h1>
              </div>
              <div className="w-[30%] md:w-[16%]">
                <h1 className="font-semibold">
                  {/* <button
                    className="hover:scale-10% transition-all duration-300"
                    onClick={() => setOptions(i)}
                  >
                    {items.status === "Order placed" ? (
                      <div className="text-yellow-500">{items.status}</div>
                    ) : items.status === "Cancled" ? (
                      <div className="text-red-500">{items.status}</div>
                    ) : (
                      <div className="text-green-500">{items.status}</div>
                    )}
                  </button> */}
                  {Options === index && (
                    <div className={`${Options === index ? "flex" : "block"}`}>
                      {/* <select name="status" id="" className="bg-gray-800">
                        {[
                          "Order placed",
                          "Out for delivery",
                          "Delivered",
                          "Canceled",
                        ].map((items, index) => (
                          <option value={items} key={index}>
                            {items}
                          </option>
                        ))}
                      </select> */}
                      <button className="text-green-500 hover:text-pink-600 mx-2">
                        <FaCheck />
                      </button>
                    </div>
                  )}
                </h1>
              </div>
              <div className="w-[10%] md:w-[5%]">
                <button
                  className="text-xl hover:text-orange-500"
                  // onClick={() => {
                  //   setuserDiv("fixed");
                  //   setuserDivData(items.user);
                  // }}
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AllOrders;
