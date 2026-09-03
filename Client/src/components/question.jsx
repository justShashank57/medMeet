import React from "react";
export default function QuestionBox({obj}){
    const[show,setShow] = React.useState(false);
    const answerId = React.useId();
       function handleClick(){
           setShow(prevState=>!prevState)
       }
       function handleKeyDown(event){
           if(event.key === "Enter" || event.key === " "){
               event.preventDefault();
               handleClick();
           }
       }
    return(
        <div id="question">
           <h3 id="quesText">{obj.question}
           {show && <p id={answerId} style={{fontWeight:"lighter"}}>{obj.content}</p>}
           </h3>
           <div
             id="sign"
             role="button"
             tabIndex={0}
             aria-expanded={show}
             aria-controls={answerId}
             aria-label={show ? "Collapse answer" : "Expand answer"}
             style={{backgroundColor:show?"#1B56F7":"white",color:show?"white":"black"}}
             onClick={handleClick}
             onKeyDown={handleKeyDown}
           >{show?"-":"+"}</div>
        </div>
    )
}