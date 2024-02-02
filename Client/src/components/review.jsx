import React from "react";
export default function Reviews(){
        return(
            <div id="reviewRoot">
                <h1 className="head" id="reviewHead">What our patients say.</h1>
                <p className="reviewPara">World-class care for everyone. Our health system offers unmatched expert health care.</p>
                <div id="reviewBox">

                    <div id="review">

                        <div className="upper">
                            <img className="pics" src="pic1.png" />

                            <div id="nameAndImg">
                               <h3 className="name">Aniket</h3>
                               <img className="star" src="stars.webp"/>
                            </div>

                        </div>
                        <p>"I've never had a more thorough and comprehensive medical examination - thank you, Dr. Patel!"</p>

                    </div>
                    
                    <div id="review">

                        <div className="upper">
                            <img className="pics" src="pic2.png" />

                            <div id="nameAndImg">
                               <h3 className="name">Steve</h3>
                               <img className="star" src="stars.webp"/>
                            </div>

                        </div>
                        <p>"I have taken medical services from them, they treated me very well and took good care of me."</p>

                    </div>

                    <div id="review">

                        <div className="upper">
                            <img className="pics" src="pic3.png" />

                            <div id="nameAndImg">
                               <h3 className="name">Ranjeet</h3>
                               <img className="star" src="stars.webp"/>
                            </div>

                        </div>
                        <p>"From the moment I stepped in, Dr. Foster's clinic exhibited professionalism and genuine care."</p>

                    </div>
                       
                </div>
            </div>
            
        )
}