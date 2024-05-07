import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/review/get-review')
      .then(response => {
        setReviews(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  return (
    <div className="m-4 p-8 mb-10 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-4xl mb-8 text-center">Customer Reviews</h2>
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        className="carousel"
      >
        {reviews?.map((review, index) => (
          <div key={index} className="review-item p-6 bg-white rounded-lg shadow-md">
            <div className="review-content">
              <h3 className="text-2xl font-semibold mb-2">{review.flatnumber}</h3>
              <p className="text-lg font-medium text-gray-800 mb-4">{review.name}</p>
              <p className="text-lg text-gray-800">&ldquo;{review.review}&rdquo;</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
