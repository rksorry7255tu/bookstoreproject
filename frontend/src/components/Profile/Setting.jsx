import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const Setting = () => {
  const [Value, setValue] = useState({ address: "" });
  const [ProfileData, setProfileData] = useState(null); // Initialize as null for loading state
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const change = (e) => {
    const { name, value } = e.target;
    setValue({ ...Value, [name]: value });
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/get-user-information",
          { headers }
        );
        setProfileData(response.data);
        setValue({ address: response.data.address });
        //console.log(response.data);
      } catch (error) {
        //console.error("Error fetching user information:", error);
      }
    };
    fetch();
  }, []);
  const submitAddress = async () => {
    const response = await axios.put(
      "http://localhost:3001/api/v1/update-address",
      Value,
      { headers }
    );
    alert(response.data.message);
  };

  return (
    <>
      {!ProfileData ? (
        <div className=" bg-zinc-800 w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-full p-4 md:p-8 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Settings
          </h1>
          <div className="flex flex-col md:flex-row gap-12 w-auto lg:w-[50%]">
            <div className="flex-1">
              <label htmlFor="username" className="block mb-1">
                Username
              </label>
              <p className="p-2 rounded w-auto lg:w-[30vh] bg-zinc-800 font-semibold">
                {ProfileData.username}
              </p>
            </div>
            <div className="flex-1">
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <p className="p-2 rounded w-auto lg:w-[30vh] bg-zinc-800 font-semibold">
                {ProfileData.email}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="address" className="block mb-1">
              Address
            </label>
            <textarea
              id="address"
              className="p-2 rounded bg-zinc-800 w-full mt-2 font-semibold"
              rows="5"
              placeholder="Address"
              name="address"
              value={Value.address}
              onChange={change}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-yellow-500 text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition-all duration-300"
              onClick={submitAddress}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Setting;
