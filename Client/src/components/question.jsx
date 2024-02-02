import React from "react";
export default function QuestionBox({obj}){
    const[show,setShow] = React.useState(false);
       function handleClick(){
           setShow(prevState=>!prevState)
       }
    return(
        <div id="question">
           <h3 id="quesText">{obj.question}
           {show && <p style={{fontWeight:"lighter"}}>{obj.content}</p>}
           </h3>
           <div id="sign" style={{backgroundColor:show?"#1B56F7":"white",color:show?"white":"black"}} onClick={handleClick}>{show?"-":"+"}</div>
        </div>
    )
}