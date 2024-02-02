import React from "react";
import ServiceData from  "../data/services";
import {motion} from "framer-motion";

export default function GetService(){
    const elements = ServiceData.map((obj,index)=>{
        return(
              <div className="box">
                <h3 id="objHead">{obj.name}</h3>
                <p>{obj.desc}</p>
                <div style={{display:"flex"}}>
                    <motion.img whileHover={{scale:1.4}} style={{width:"1.5rem"}} id="arrow" src="arrow.svg"/>
                    <div className="numbers" style={{backgroundColor:obj.bgColor,color:obj.textColor}} >{index+1}</div>
                </div>
              </div>
        )
    })
    return (
           <div id="serviceRoot">
            <h1 className="head" style={{textAlign:"center",padding:"2rem"}}>Our Medical Services</h1>
            <p style={{textAlign:"center"}}>World-class care for everyone. Our health System offers unmatched,<br/>expert health care. From the lab to the clinic.</p>
            <div id="serviceBoxes">
           {elements}
            </div>
           </div>
    )
}