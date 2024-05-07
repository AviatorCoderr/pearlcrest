import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Showcase() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = -1; // Adjust this value based on your needs

      setIsVisible(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="m-0 md:h-[30rem]">
      <div className="flex flex-col-reverse md:flex-row items-center p-6 mx-auto space-y-0">
        <div className="flex flex-col ml-5 md:mb-32 space-y-12 md:w-2/3">
          <h2 className="w-full m-0 md:p-1 md:mt-10 text-3xl text-center md:text-5xl md:text-left text-black ">
            From Payments to Complaints: Pearl Crest Puts it All at Your
            Fingertips
          </h2>
          <Link className="m-auto md:m-0" to="/log">
            <button className="px-10 py-4 text-center bg-black hover:opacity-80 border-white text-white border-2 rounded-l-3xl rounded-r-3xl">
              Login
            </button>
          </Link>
        </div>
      </div>
      <div className="md:hidden h-full m-5">
        <Slider {...settings}>
          <div>
            <img
              className={`w-full h-[20rem] md:h-[30rem] object-cover border-2 border-black rounded-3xl ${
                isVisible ? "show" : ""
              }`}
              src="/static/images/PC4.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className={`w-full h-[20rem] md:h-[30rem] object-cover border-2 border-black rounded-3xl ${
                isVisible ? "show" : ""
              }`}
              src="/static/images/PC5.jpg"
              alt=""
            />
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Showcase;
