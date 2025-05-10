import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { CiHeart } from "react-icons/ci";
import { IoCartSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ViewBookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  //console.log(id);

  const [Data, setData] = useState();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // console.log(isLoggedIn);

  const role = useSelector((state) => state.auth.role);
  // console.log(role);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/v1/get-book-by-id/${id}`
      );
      //console.log(response.data.data);
      setData(response.data.data);
    };
    fetch();
  }, []);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleAddToCart = async () => {
    const response = await axios.put(
      "http://localhost:3001/api/v1/addToCart",
      {},
      { headers }
    );
    alert(response.data.message);
    //console.log(response.data.message);
  };

  const handleFavourite = async () => {
    const response = await axios.put(
      "http://localhost:3001/api/v1/add-book-to-favourite",
      {},
      { headers }
    );
    alert(response.data.message);
  };

  // delete book as admin
  const Delete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/v1/delete-book",
        { headers }
      );
      alert(response.data.message);
      navigate("/all-books");
    } catch (error) {
      console.log(error);
    }
  };

  //Update Book as admin
  const updateBook = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/api/update-book",
        {},
        {
          headers,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {Data && (
        <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row  gap-8">
          <div className=" w-full lg:w-3/6   ">
            <div className="bg-zinc-800 p-12 flex flex-col lg:flex-row rounded justify-around">
              <img
                className="h-[50vh] md:h-[60vh] lg:h-[70vh]  rounded"
                src={Data.url}
                alt="/"
              />
              {isLoggedIn === true && role === "user" && (
                <div className="flex flex-col md:flex-row lg:flex-col  items-center justify-between lg:justify-start mt-8 lg:mt-0">
                  <button
                    className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 text-blue-500 flex items-center justify-cente "
                    onClick={handleFavourite}
                  >
                    <CiHeart />
                    <span className="ms-4 block lg:hidden text-xl">
                      Favourites
                    </span>
                  </button>
                  <button
                    className="text-white rounded mt-8 md:mt-0 lg:rounded-full text-4xl lg:text-3xl p-3   lg:mt-8 bg-blue-500 flex items-center justify-center"
                    onClick={handleAddToCart}
                  >
                    <IoCartSharp />{" "}
                    <span className="ms-4 block lg:hidden text-xl">
                      Add to cart
                    </span>
                  </button>
                </div>
              )}
              {isLoggedIn === true && role === "admin" && (
                <div className="flex flex-col buttonmd:flex-row lg:flex-col  items-center justify-between lg:justify-start mt-8 lg:mt-0">
                  <Link
                    to={`/updateBook/${id}`}
                    className=" bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 flex items-center justify-cente "
                  >
                    <CiEdit />
                    <span className="ms-4 block lg:hidden text-xl">
                      Edit Book
                    </span>
                  </Link>
                  <button
                    className=" text-red-500 rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 md:mt-0 lg:mt-8 bg-white flex items-center justify-center"
                    onClick={Delete}
                  >
                    <MdDelete />{" "}
                    <span className="ms-4 block lg:hidden text-xl">
                      Delete Book
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 lg:w-3/6">
            <h1 className="text-2xl lg:text-4xl text-zinc-300 font-semibold w-[40vh] lg:w-full">
              {Data.title}
            </h1>
            <p className="text-zinc-400 mt-1">by {Data.author}</p>
            <p className="text-zinc-400 mt-1 text-xl  w-full h-auto break-words">
              {Data.disc}
            </p>

            <p className="flex mt-4 items-center justify-start text-zinc-400 ">
              <GrLanguage className="me-3" />
              {Data.language}
            </p>
            <p className="mt-4 text-zinc-100 text-3xl font-semibold w-[50vh] lg:w-full">
              Price:₹{Data.price}
            </p>
          </div>
        </div>
      )}
      {!Data && (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
