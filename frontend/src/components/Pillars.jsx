import React from "react";
import pillarsdet from "../pillarsdet";

function Pillarmem(){
  return (
    <div className="my-20 p-10 md:grid grid-cols-3 bg-cover bg-center">
      {pillarsdet.map(ele =>
      <Pillars ele={ele}/>
      )}
    </div>
  )
}
function Pillars({ele}){
    return(
        <div className="l-container border-black border-2 mx-auto mb-10 md:my-0 items-center rounded-xl p-0 text-center">
        <div className="l-card items-center rounded-xl">
          <div className="l-front rounded-xl">
            <img
              loading="lazy"
              className="m-auto h-[100%] rounded-xl"
              src={ele.img_URL}
              alt="clb-img"
            />
          </div>
          <div className="l-rear text-black bg-cover bg-bottom flex flex-col flex-wrap items-center rounded-xl bg-white">
            <h3 className="absolute top-20 mx-auto text-xl font-bold">
              {ele.name}
            </h3>
            <p className="m-auto">{ele.post}</p>
          </div>
        </div>
        </div>
    )
}

export default Pillarmem;