import React from "react";
import { motion } from "framer-motion";

export default function DoctorCard(props){

    function handleClick(){
        props.setSelected(props.obj);
    }
       return(
            <div className="docCard">
                <img src={props.obj.photo || "docImg.avif"} className="cardImg"/>
                <h3 className="docName">{props.obj.name}</h3>
                <span className="specArrow">
                    <span className="speciality">{props.obj.specialty}</span>
                </span>
                <span className="locArrow">
                    <p className="docLoc">At {props.obj.hospital}</p>
                    <motion.img onClick={handleClick} whileHover={{scale:1.4}} style={{width:"1.5rem"}} className="arrow" src="arrow.svg"/>
                </span>
            </div>
       )
}