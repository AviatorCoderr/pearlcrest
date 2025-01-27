import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("/api/v1/review/get-review")
      .then((response) => {
        setReviews(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  return (
    <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-extrabold text-gray-900 text-center mb-12">
          What Our Residents Say
        </h2>
        <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          transitionTime={700}
          className="carousel"
        >
          {reviews?.map((review, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-20 h-20 flex items-center justify-center rounded-full shadow-lg font-bold text-2xl">
                    {review.flatnumber || "N/A"}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {review.name}
                </h3>
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}