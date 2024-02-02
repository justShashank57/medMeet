import React, { useDebugValue } from "react";
import Questions from "../data/faq";
import QuestionBox from "./question";

export default function Faq(){
    
    const elements = Questions.map((obj)=>{
        return(
              <QuestionBox obj={obj}/>
        )
    })

    return(
        <div id="faqRoot">
            <img src="faq.png" id="faqImg"/>
            <div id="faq">
                <h1 className="head">Most questions by our beloved Patients.</h1>
                <div id="questionBox">
                   {elements}
                </div>
            </div>
        </div>
    )
}