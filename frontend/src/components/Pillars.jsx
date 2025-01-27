import React from "react";
import pillarsdet from "../pillarsdet";

function Pillarmem() {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12">
          Our Pillars of Strength
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillarsdet.map((ele, index) => (
            <Pillars key={index} ele={ele} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Pillars({ ele }) {
  return (
    <div className="relative group overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105">
      <div className="relative h-96">
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full transition-all duration-500 group-hover:opacity-0">
          <img
            loading="lazy"
            className="w-full h-full object-cover rounded-3xl"
            src={ele.img_URL}
            alt="clb-img"
          />
        </div>

        {/* Rear Side */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex flex-col items-center justify-center text-white opacity-0 transition-all duration-500 group-hover:opacity-100 rounded-3xl p-6">
          <h3 className="text-2xl font-bold mb-2">{ele.name}</h3>
          <p className="text-lg text-center">{ele.post}</p>
        </div>
      </div>
    </div>
  );
}

export default Pillarmem;