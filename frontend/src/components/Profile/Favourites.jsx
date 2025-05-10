import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";

const Favourites = () => {
  const [favbook, setFavbook] = useState([]); // Initialize as an empty array
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/get-all-fav-book",
          { headers }
        );
        //console.log(response.data.data);
        setFavbook(response.data.data);
      } catch (error) {
        console.error("Error fetching favorite books:", error);
        // Optionally, you can set an error state here to display an error message
      }
    };
    fetch();
  }, [favbook]);

  return (
    <>
      {!favbook && (
        <div className=" bg-zinc-800 w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      {favbook && favbook.length === 0 && (
        <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex flex-col items-center justify-center w-full gap-8 text-center ">
          No favourite books
          <img
            src="./start.png"
            alt="start"
            className="h-[20vh] my-8 rounded"
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {favbook &&
          favbook.map((items, index) => (
            <div key={index}>
              <BookCard data={items} favbook={true} />
            </div>
          ))}{" "}
      </div>
    </>
  );
};

export default Favourites;
