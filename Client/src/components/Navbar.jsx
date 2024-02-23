import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Navbar(){
    const user = useSelector((state)=>state.user.value);
    const[clickedPage,setClickedPage] = React.useState(0);
    const token = localStorage.getItem('jwt');
        function handleClick(event){
            let key = parseInt(event.target.getAttribute('data-key'));
            setClickedPage(key);
        }
        
    return (
        <nav>
            <img src="heart.png" alt="heart" id="heart"/>
            <h3 id="medMeet">MedMeet</h3>
            <ul>
                <motion.li whileHover={{scale:1.3}}>
                <Link data-key={0} style={clickedPage===0?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} onClick={handleClick}  className="link smooth-scroll" to="/">Home</Link>
                </motion.li>
                <motion.li whileHover={{scale:1.3}}>
                <Link data-key={1} style={clickedPage===1?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} onClick={handleClick} className="link smooth-scroll" to="/services">Services</Link>
                </motion.li>
                <motion.li  whileHover={{scale:1.3}}>
                <Link data-key={2} style={clickedPage===2?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} onClick={handleClick} className="link smooth-scroll" to="/doctors">Find a Doctor</Link>
                </motion.li>
                <motion.li  whileHover={{scale:1.3}}>
                <Link data-key={3} style={clickedPage===3?{borderBottom:"1px solid #333333"}:{borderBottom:"none"}} onClick={handleClick} className="link smooth-scroll" to="#contactMe">Contact</Link>
                </motion.li>
            </ul>
              {
                 (token) ?
                 <Link to="/profile"><img src="pic1.png" id="icon" /></Link>
                 :
                 <Link className="link" id="login" to="/login">Login</Link>
              }
               
        </nav>
        
    )
}