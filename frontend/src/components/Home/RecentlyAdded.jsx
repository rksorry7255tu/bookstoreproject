import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const RecentlyAdded = () => {
  const [Data, setData] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/v1/get-recent-books"
      );
      setData(response.data.data);
      // console.log(response.data.data);
    };
    fetch();
  }, []);
  return (
    <div className="mt-8">
      <h4 className="text-4xl text-yellow-100">Choose Book to Read ...</h4>
      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Data &&
          Data.map((item, index) => (
            <div key={index} className="flex justify-center w-full">
              <BookCard data={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentlyAdded;
