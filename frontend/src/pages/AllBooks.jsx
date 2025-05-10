import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";

const AllBooks = () => {
  const [Data, setData] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/v1/get-all-books"
      );
      setData(response.data.data);
      //console.log(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-zinc-900 px-12 py-8 h-auto">
      <h4 className="text-4xl text-yellow-100">All books</h4>
      {!Data && (
        <div className=" bg-zinc-800 w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Data &&
          Data.map((item, index) => (
            <div key={index} className="flex justify-center">
              <BookCard data={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllBooks;
