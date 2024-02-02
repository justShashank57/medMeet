import React from "react";
import {motion} from "framer-motion"

export default function features(){
    return(
        <div>
            <div>
               <h1 className="head" id="bestServices">Providing the best<br/>Medical services.</h1>
               <p id="bsPara">World-class care for everyone. Our health system offers<br/>unmatched, expert health care.</p>
            </div>

            <div id="goTo">
                <div id="gotoDiv">
                    <div style={{height:"19rem"}}>
                      <img id="gotoImg" src="lifesaver.png" />
                      <h3 id="find">Find a doctor</h3>
                      <p id="paraFind">Find a Doctor from a list of thousands experts, choose which suits you best.</p>
                    </div>
                      <motion.img whileHover={{scale:1.2}} src="arrow.svg" id="arrow"/>
                </div>

                <div id="gotoDiv">
                    <div style={{height:"19rem"}}>
                        <img id="gotoImg" src="location.png" />
                      <h3 id="find">Find a Location</h3>
                      <p id="paraFind">Find a suitable location for your treatment, check out the availability as well.</p>
                    </div>
                      <motion.img whileHover={{scale:1.2}} src="arrow.svg" id="arrow"/>
                </div>

                <div id="gotoDiv">
                    <div style={{height:"19rem"}}>
                      <img id="gotoImg" src="appoint.png" />
                      <h3 id="find">Book an Appointment</h3>
                      <p id="paraFind">Book an appointment according to your convinience with a doctor nearest to you.</p>
                    </div>
                      <motion.img whileHover={{scale:1.2}} src="arrow.svg" id="arrow"/>
                </div>
            </div>
        </div>
    )
}