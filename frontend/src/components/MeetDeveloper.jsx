import React from "react";
import { FaInstagram, FaLinkedin, FaGithub, FaPortrait } from "react-icons/fa";

const dev_details = [
  {
    img_url: "/static/images/manish_jpg.jpg",
    name: "Manish",
    description: "Web Designer & PCS Treasurer, MCA",
  },
  {
    img_url: "/static/images/kush.jpg",
    name: "Kushagra Sahay",
    insta_id: "https://www.instagram.com/sahay_kush/",
    linkedin_id: "https://www.linkedin.com/in/kushagra-sahay-500b671b8/",
    contact: "https://github.com/AviatorCoderr",
    portfolio: "https://wonderful-shortbread-50834c.netlify.app/",
    description: "Web Developer, CSE, BIT MESRA",
  },
];

function Meetdev() {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading Section */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">
          Meet the Developers
        </h2>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dev_details.map((ele, index) => (
            <Card
              key={index}
              img_url={ele.img_url}
              name={ele.name}
              insta_id={ele.insta_id}
              linkedin_id={ele.linkedin_id}
              contact={ele.contact}
              portfolio={ele.portfolio}
              description={ele.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card(props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* Developer Image */}
      <div className="w-full flex justify-center pt-8">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            loading="lazy"
            className="w-full h-full object-cover transform transition-all duration-300 hover:scale-110"
            src={props.img_url}
            alt={props.name}
          />
        </div>
      </div>

      {/* Developer Details */}
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{props.name}</h3>
        <p className="text-lg text-gray-600 mb-4">{props.description}</p>

        {/* Social Links */}
        <div className="flex justify-center space-x-6">
          {props.insta_id && (
            <a
              href={props.insta_id}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-600 transition-colors duration-300"
            >
              <FaInstagram className="text-2xl" />
            </a>
          )}
          {props.linkedin_id && (
            <a
              href={props.linkedin_id}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-700 transition-colors duration-300"
            >
              <FaLinkedin className="text-2xl" />
            </a>
          )}
          {props.contact && (
            <a
              href={props.contact}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors duration-300"
            >
              <FaGithub className="text-2xl" />
            </a>
          )}
          {props.portfolio && (
            <a
              href={props.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-purple-600 transition-colors duration-300"
            >
              <FaPortrait className="text-2xl" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Meetdev;