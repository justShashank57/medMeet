import React from "react";

export default function Table({arr}){
    
    function handleDelete(){
          console.log("Delete function triggered")
    }

    const rows = arr.map((obj)=>{
        return(
             <tr>
                <td>{obj.name}</td>
                <td>{obj.date}</td>
                <td>{obj.time}</td>
                <td><img id="delete" src="delete.png" onClick={handleDelete}/></td>
            </tr>
        )        
    })
          return(
            <>
            <table>
                <tr>
                    <th>Doctor</th>
                    <th>Day</th>
                    <th>Slot</th>
                    <th>Cancel</th>
                </tr>
                {arr && rows}
            </table>
            </>
          )
}