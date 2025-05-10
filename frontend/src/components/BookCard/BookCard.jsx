import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BookCard = ({ data, favbook }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  };

  const handleRemoveBook = async () => {
    const response = await axios.put(
      "http://localhost:3001/api/v1/delete-book-from-favourite",
      {},
      { headers }
    );
    alert(response.data.message);
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col hover:scale-105 transition-all duration-300 ease-in-out transform hover:bg-zinc-700">
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-900 rounded flex items-center justify-center hover:shadow-lg transition-all duration-300 ease-in-out">
          <img
            src={data.url}
            className="h-[25vh] w-[40vh] gap-10 hover:scale-110 transition-all duration-300 ease-in-out"
            alt="/book"
          />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-white">{data.title}</h2>
        <p className="mt-2 text-zinc-400 font-semibold text-xl">
          by {data.author}
        </p>
        <p className="mt-2 text-zinc-200 font-semibold text-xl">
          ₹ {data.price}
        </p>
      </Link>
      {favbook && (
        <button
          className="bg-yellow-50 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4 hover:bg-yellow-500 hover:text-white transition-all duration-300"
          onClick={handleRemoveBook}
        >
          Remove from Favourites
        </button>
      )}
    </div>
  );
};

export default BookCard;
