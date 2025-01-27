import React, { useState } from "react";
import feat_det from "../feat_det";
import { FaPlus, FaMinus } from "react-icons/fa";

const Features = () => {
  const [isOpen, setIsOpen] = useState(Array(feat_det.length).fill(false));

  const toggleDropdown = (index) => {
    setIsOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Features
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
            Uncover a seamless and intuitive user experience as you navigate through advanced tools and functionalities designed to enhance your interaction and engagement. Discover a world of convenience and innovation right at your fingertips.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-6">
          {feat_det.map((ele, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="p-6 flex items-center cursor-pointer"
                onClick={() => toggleDropdown(index)}
              >
                <div className="flex items-center space-x-4">
                  <ele.icon className="text-3xl text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {ele.title}
                  </h2>
                </div>
                <span className="ml-auto">
                  {isOpen[index] ? (
                    <FaMinus className="text-gray-500 text-xl transition-transform duration-200" />
                  ) : (
                    <FaPlus className="text-gray-500 text-xl transition-transform duration-200" />
                  )}
                </span>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen[index] ? "max-h-48" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-lg text-gray-600">{ele.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;