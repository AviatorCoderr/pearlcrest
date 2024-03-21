import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  return (
    <div className="m-0 md:h-[30rem]">
      <div className="flex flex-col-reverse md:flex-row items-center p-6 mx-auto space-y-0">
        <div className="flex flex-col ml-5 md:mb-32 space-y-12 md:w-2/3">
          <h2 className="w-full m-0 md:p-1 md:mt-10 text-3xl text-center md:text-5xl md:text-left text-black ">
            From Payments to Complaints: Pearl Crest Puts it All at Your
            Fingertips
          </h2>
          <Link to="/log">
            <button className="p-3 text-center bg-black hover:opacity-80 w-1/4 m-auto md:m-0 border-white text-white border-2 rounded-l-3xl rounded-r-3xl">
              Login
            </button>
          </Link>
        </div>
        <div className="w-1/2 h-full invisible md:visible">
          <img
            className={`${
              isVisible ? "show" : ""
            } showcase_img1 overflow-x-hidden w-1/3 border-2 border-black  absolute top-[60%] left-[63%] rounded-3xl rotate-12`}
            src="/static/images/PC2.jpg"
            alt=""
          />
          \
          <img
            className={`${
              isVisible ? "show" : ""
            } showcase_img2 w-1/3 border-2 border-black  absolute top-[20%] left-[52%] rounded-3xl rotate-12`}
            src="/static/images/PC4.jpg"
            alt=""
          />
          \
          <img
            className={`${
              isVisible ? "show" : ""
            } showcase_img3 w-1/3 border-2 border-black absolute top-1/6 left-[32%] rounded-3xl rotate-12`}
            src="/static/images/PC5.jpg"
            alt=""
          />
          \
        </div>
      </div>
      <div className="md:hidden h-full m-1 grid gap-4 overflow-hidden">
        {/* <img className={`w-full m-auto border-2 border-black rounded-3xl`} src="../../public/static/images/PC2.jpg" alt="" /> */}
        <img
          className={`showcase_img1 ${
            isVisible ? "show" : ""
          } w-1/2 m-auto border-2 border-black rounded-3xl`}
          src="../../public/static/images/PC4.jpg"
          alt=""
        />
        <img
          className={`showcase_img3 ${
            isVisible ? "show" : ""
          } w-1/2 m-auto border-2 border-black rounded-3xl`}
          src="../../public/static/images/PC5.jpg"
          alt=""
        />
      </div>
    </div>
  );
}

export default Showcase;
