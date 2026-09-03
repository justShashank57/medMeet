import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Navbar(){
    const location = useLocation();
    const token = useSelector((state)=>state.token.value);
    
    const getCurrentPage = () => {
        switch(location.pathname) {
            case "/": return 0;
            case "/services": return 1;
            case "/doctors": return 2;
            case "/contact": return 3;
            default: return 0;
        }
    };
        
    return (
        <nav aria-label="Main navigation">
            <img src="heart.png" alt="" id="heart"/>
            <h3 id="medMeet">MedMeet</h3>
            <ul>
                <motion.li whileHover={{scale:1.3}}>
                <Link aria-current={getCurrentPage()===0?"page":undefined} style={getCurrentPage()===0?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} className="link smooth-scroll" to="/">Home</Link>
                </motion.li>
                <motion.li whileHover={{scale:1.3}}>
                <Link aria-current={getCurrentPage()===1?"page":undefined} style={getCurrentPage()===1?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} className="link smooth-scroll" to="/services">Services</Link>
                </motion.li>
                <motion.li  whileHover={{scale:1.3}}>
                <Link aria-current={getCurrentPage()===2?"page":undefined} style={getCurrentPage()===2?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} className="link smooth-scroll" to="/doctors">Find a Doctor</Link>
                </motion.li>
                <motion.li  whileHover={{scale:1.3}}>
                <Link aria-current={getCurrentPage()===3?"page":undefined} style={getCurrentPage()===3?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} className="link smooth-scroll" to="/contact">Contact</Link>
                </motion.li>
            </ul>
              {
                 (token) ?
                 <Link to="/profile" aria-label="View profile"><img src="pic1.png" id="icon" alt=""/></Link>
                 :
                 <Link className="link" id="login" to="/login">Login</Link>
              }

        </nav>

    )
}