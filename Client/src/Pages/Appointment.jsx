import { useContext } from 'react';
import { UserContext, setUserContext } from '../App';
import React from 'react'
import book from '../components/booking';

function Appointment({img,name,speciality,hospital,setSelected,email}) {
  const user = useContext(UserContext);
  const setUser = useContext(setUserContext);
  const docName = name;
  function back(){
    setSelected(null)
  }
  
 async function handleBook(){
    if(user){
       const {_id,name} = user;
       var d = document.getElementById("day");
       var day = d.options[d.selectedIndex].text;

       var t = document.getElementById("time");
       var time = t.options[t.selectedIndex].text;

       const updatedUser = await book(_id,name,docName,email,day,time);

       console.log("APPOINTMENT PAGE: ",updatedUser);
       await setUser(updatedUser)
       alert("Appointment Booked !")
      //  console.log(updatedUser)
    }
    else{
      alert("Please Login First !")
    }
  }

  return (
    <div id='appointRoot'>
        <img onClick={back} src="arrow.svg" id='back'/>
        <div id='appointLeft'>
            <div style={{display:"flex"}} id='leftUp'>
                <img className='cardImg' src={img}/>
                <div id='specName'>
                  <div className='speciality'>{speciality}</div>
                  <h3 className='docName'>{name}</h3>
                </div>
            </div>
            <div id='leftDown'>
              <h4 className='docName'>About <span style={{fontSize:"1.4rem",color:"#01B5C5",marginLeft:"0.5rem"}}>{name}</span></h4>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis modi aperiam id. Officia repellat eos a optio facere, nobis neque voluptatum. Illum voluptatem sunt provident quisquam, placeat dolore beatae magni recusandae, voluptatum iste sapiente possimus, non distinctio cupiditate eos tenetur enim minima fugiat. Voluptates, voluptatem odio impedit officia qui dignissimos?</p>
              <p style={{marginTop:"5rem",fontSize:"0.8rem"}} className='docLoc'>{hospital}</p>
            </div>
            
        </div>

        <div id='appointRight'>
              <div id='bookingBox'>
                <div style={{display:"flex",gap:"1.5rem",alignItems:"center",padding:"1rem"}}>
                  <span style={{fontFamily:"'Quicksand', sans-serif"}}>Consultation :</span> <span style={{fontFamily:"'Quicksand', sans-serif",fontWeight:"700",fontSize:"1.3rem"}}>100 USD</span>
                </div>
                
                <div>
                  <p>Available Slots :</p>
                  <div style={{display:"flex",justifyContent:"center",gap:"1rem",paddingTop:"1rem",paddingBottom:"1rem"}}>
                          <select name="day" id="day">
                              <option value="monday">Monday</option>
                              <option value="tuesday">Tuesday</option>
                              <option value="wednesday">Wednesday</option>
                          </select>
        
                          <select name="time" id="time">
                              <option value="monday">11:00 AM</option>
                              <option value="tuesday">12:00 AM</option>
                              <option value="wednesday">01:00 PM</option>
                          </select>
                  </div>
            
                </div>
                 
                <div id='book' onClick={handleBook}>Book Appointment</div>

              </div>
             
        </div>
    </div>
  )
}

export default Appointment