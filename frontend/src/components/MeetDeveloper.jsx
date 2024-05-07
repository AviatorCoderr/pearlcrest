import React from "react";
import { FaInstagram, FaPortrait } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
const dev_details = [{
    img_url: "/static/images/kush.jpg",
    name: "Kushagra Sahay",
    insta_id: "https://www.instagram.com/sahay_kush/",
    linkedin_id: "https://www.linkedin.com/in/kushagra-sahay-500b671b8/",
    contact: "https://github.com/AviatorCoderr",
    portfolio: "https://wonderful-shortbread-50834c.netlify.app/"
}]
function Meetdev() {
  return (
    <div id="developersSection" className="m-3 mt-20 md:ml-10 bg-[url('/static/images/img-bg.jpg')]">
      <h2 className="p-2 text-5xl text-center md:text-left mb-5 md:text-6xl">
        Meet Developer
      </h2>
      <div className="mx-auto text-white">
        {dev_details.map((ele, index) => (
          <Card
            key={index}
            img_url={ele.img_url}
            name={ele.name}
            insta_id={ele.insta_id}
            linkedin_id={ele.linkedin_id}
            contact={ele.contact}
            portfolio={ele.portfolio}
          />
        ))}
      </div>
    </div>
  );
}
function Card(props) {
  return (
    <div className="md:w-1/2 mt-5 m-auto border-2 border-black">
      <div className="text-center m-2">
        <img
          loading="lazy"
          className="dev-img m-auto h-auto w-4/6 rounded-full p-3"
          src={props.img_url}
          alt="img"
        />
      </div>
      <div className="text-center p-2 text-2xl bg-neutral-100 text-black font-semibold">
        <p>{props.name}</p>
      </div>
      <div className="grid grid-cols-4 p-3 bg-black">
        <a className="m-auto p-2 text-2xl" href={props.insta_id}>
          <FaInstagram />
        </a>
        <a className="m-auto p-2 text-2xl" href={props.linkedin_id}>
          <FaLinkedin />
        </a>
        <a className="m-auto p-2 text-2xl" href={props.contact}>
          <FaGithub />
        </a>
        <a className="m-auto p-2 text-2xl" href={props.portfolio}>
          <FaPortrait />
        </a>
      </div>
    </div>
  );
}
export default Meetdev;
