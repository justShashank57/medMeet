import React from "react";
import { Link } from "react-router-dom";

export default function Hero(){
    return (
        <div id="hero">
            <div id="hero1">
                <h1 className="head">
                    We help Patients<br/>live a healthy, <br/>longer life.
                </h1>
                <p>At MedMeet, we are dedicated to providing you with reliable and accessible medical information. Our platform offers a wide range of expert-reviewed articles, resources, and tools to empower you to make informed decisions about your health.</p>
                <Link to="/doctors" style={{ textDecoration: 'none' }}>
                  <div id="reqButton">Request an Appointment</div>
                </Link>
                <div id="stats">
                    <div id="num">
                        <span className="yes exp">30+</span>
                        <p>Years of Experience</p>
                    </div>
                    <div id="num">
                        <span className="yes loc">15+</span>
                        <p>Clinic Locations</p>
                    </div>
                    <div id="num">
                        <span className="yes sat">100%</span>
                        <p>Patient Satisfaction</p>
                    </div>
                </div>
            </div>

            <div id="hero2">
                 <img src="doc1.jpg" id="doc1" />
                 <div id="twoDocs">
                    <img src="doc2.jpg" id="doc2" />
                    <img src="doc3.jpg" id="doc3" />
                 </div>
            </div>
        </div>
    )
}