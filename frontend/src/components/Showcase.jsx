import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Showcase() {
  const [isVisible, setIsVisible] = useState(true);
  const img_urls = [
    { url: "/static/images/PC4.jpg", alt: "Pearl Crest Image 1" },
    { url: "/static/images/PC5.jpg", alt: "Pearl Crest Image 2" },
    { url: "/static/images/PC6.jpg", alt: "Pearl Crest Image 3" },
    { url: "/static/images/PC3.jpg", alt: "Pearl Crest Image 4" },
    { url: "/static/images/IMG-20230402-WA0098.jpg", alt: "Pearl Crest Image 5" },
    { url: "/static/images/IMG-20230402-WA0054.jpg", alt: "Pearl Crest Image 6" },
  ];


  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true, // Adds a fade effect for smoother transitions
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text Section */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-20">
          <div className="flex flex-col space-y-8 md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center md:text-left">
              From Payments to Complaints: Pearl Crest Puts it All at Your
              Fingertips
            </h2>
            <div className="flex justify-center md:justify-start">
              <Link to="/log">
                <button className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="w-full md:w-1/2">
            <Slider {...settings}>
              {img_urls.map((ele, index) => (
                <div key={index}>
                  <div
                    className={`w-full h-64 md:h-96 overflow-hidden rounded-3xl shadow-2xl transition-opacity duration-500 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={ele.url}
                      alt={ele.alt}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Showcase;