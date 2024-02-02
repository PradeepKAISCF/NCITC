import React, { useState } from 'react'
import '../pages.css'
import { blue } from '@mui/material/colors'
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { useUserAuth } from '../../context/UserAuthContext';
import {loadStripe} from '@stripe/stripe-js'

function Subscribe() {

    const [plan,setPlan] = useState(0)
    const {user} = useUserAuth()

     const pay = (e)=>{
    e.preventDefault();
    let amount;
    if(plan === 0 ) amount = 79900
    if(plan === 2) amount = 10000
    if(plan === 3) amount = 100000
    if(plan === 1){
      alert("Subrcibed To Free Plan");
      //dispatch(subscription(currentUser?.result?._id,0))
      fetch('https://twitter-backend-hsxx.onrender.com/sub', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(
                  {
                    email: user.email,
                    plan:plan
                  }
                ),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.acknowledged) {
                        console.log(data)
                    }
                })
      }else{
        var options = {
          key: "rzp_test_7kuHOXieqQI1Go",
          key_secret:"Cvseho95ZIwZBK8l5WJBGPlq",
          amount: amount,
          currency:"INR",
          name:"STARTUP_PROJECTS",
          description:"for testing purpose",
          handler: function(response){
            console.log(user.email)
            if(plan === 0){
              alert("Payment Successfull Now your a Premium User");
            }
            if(plan === 2) {
              alert("Payment Successfull Subscribed To Silver Plan");
              //dispatch(subscription(currentUser?.result?._id,1))
            }
            if(plan === 3 ) {
              alert("Payment Successfull Subscribed To Gold Plan");
              //dispatch(subscription(currentUser?.result?._id,2))
            }

            fetch('https://twitter-backend-hsxx.onrender.com/sub', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(
                  {
                    email: user.email,
                    plan:plan
                  }
                ),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.acknowledged) {
                        console.log(data)
                    }
                })

          },
          prefill: {
            name:"A Pradeep",
            email:"pradeep123kaiscf@gmail.com",
            contact:"6374603162"
          },
          notes:{
            address:"Razorpay Corporate office"
          },
          theme: {
            color:"#3399cc"
          }
        };
        var pay = new window.Razorpay(options);
        pay.open();
      }
  }

   /* const pay = async()=>{
      const stripe = await loadStripe("pk_test_51OfNKhSGqCjG3WmbWUEBZSvCGWc3lG6DlhD4ycIxPYNv9kSsJVmSgcVEslYLAfQ7mDVbvQmYS3e6qQ7Iji6gw4mi008p4hNLsb")

      const body = {
        products: plan
      }

      const headers={
        "Content-Type" : 'application/json'
      }

      try {
        const response = await fetch('https://twitter-backend-hsxx.onrender.com/checkout',{
          method:'POST',
          headers:headers,
          body:JSON.stringify(body)
        }) 
      } catch (error) {
        console.log(error)
      }
    }*/

    return (
        <div style={{display:'flex',flexDirection:'column', marginTop:'30px', marginBottom:'50px', color:blue}}>
          
        <h3 style={{marginBottom:'30px'}} className='pageTitle'>Premium Account</h3>
        <label style={{border: '2px solid #ccc',marginRight:'20px',borderRadius:'5px',paddingLeft:'5px',backgroundColor:'#F8F8FF', minHeight:'200px',borderColor:(plan === 0)?'#1E90FF':'black'}} onClick={()=>{setPlan(0)}}>
            <h3 style={{textAlign:'center'}} className='pageTitle'>Features</h3>
            <div style={{height:'3px',backgroundColor:'grey',marginRight:'5px', marginBottom:'10px'}}></div>
            <ul>
              <li>
                Exclusively For Influencers and celebrities
              </li>
              <li>
                Customizable Premium badges
              </li>
              <li>
                Faster and Best Customer Service
              </li>
              <li>
                Amount: 799
              </li>
            </ul>
          </label>
          <div style={{ display:'flex', justifyContent:'center', /* marginTop:'50px' */}}>
        <button style={{width:'100px',marginTop:'10px', backgroundColor:'var(--twitter-color)', borderRadius:'5px', fontWeight:'bold', minHeight:'30px'}} onClick={pay} >Pay Now</button>
        </div>
        <hr style={{marginTop:'10px'}}/>
        <h3 style={{marginBottom:'50px', marginTop:'10px'}} className='pageTitle'>Subscribtion Plans</h3>
        <div style={{display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between'}}>
        <label style={{border: '2px solid #ccc',marginRight:'20px',borderRadius:'5px',paddingLeft:'5px',backgroundColor:'#F8F8FF', minHeight:'200px',borderColor:(plan === 1)?'#1E90FF':'black'}} onClick={()=>{setPlan(1)}}>
            <h3 style={{textAlign:'center'}} className='pageTitle'>Free Plan</h3>
            <div style={{height:'3px',backgroundColor:'grey',marginRight:'5px', marginBottom:'10px'}}></div>
            <h4>Features</h4>
            <ul>
              <li>
                Max 1 questions per day
              </li>
              <li>
                Response from other beginners
              </li>
              <li>
                Amount: free
              </li>
            </ul>
          </label>
          <label style={{border: '2px solid #ccc',marginRight:'20px',borderRadius:'5px',paddingLeft:'5px',paddingRight:'5px',backgroundColor:'#F8F8FF', minHeight:'200px',borderColor:(plan === 2)?'#1E90FF':'black'}} onClick={()=>{setPlan(2)}}>
            <h3 style={{textAlign:'center'}}className='pageTitle'>Silver Plan</h3>
            <div style={{height:'3px',backgroundColor:'grey',marginRight:'5px', marginBottom:'10px'}}></div>
            <h4>Features</h4>
            <ul>
              <li>
                Max 5 questions per day
              </li>
              <li>
                Quick Response
              </li>
              <li>
                Amount: Rs.100/month
              </li>
            </ul>
          </label>
          <label style={{border: '2px solid #ccc',marginRight:'20px',borderRadius:'5px',paddingLeft:'5px',backgroundColor:'#F8F8FF', minHeight:'200px',borderColor:(plan === 3)?'#1E90FF':'black'}} onClick={()=>{setPlan(3)}}>
            <h3 style={{textAlign:'center'}}className='pageTitle'>Gold Plan</h3>
            <div style={{height:'3px',backgroundColor:'grey',marginRight:'5px', marginBottom:'10px'}}></div>
            <h4>Features</h4>
            <ul>
              <li>
                Unlimited questions per day
              </li>
              <li>
                Quick Response from Professionals
              </li>
              <li>
                Amount: Rs.1000/month
              </li>
            </ul>
          </label>
        </div>
        <div style={{ display:'flex', justifyContent:'center', /* marginTop:'30px' */}}>
        <button style={{width:'100px',marginTop:'10px', backgroundColor:'var(--twitter-color)', borderRadius:'5px', fontWeight:'bold', minHeight:'30px'}} onClick={pay} >Pay Now</button>
        </div>
      </div> 
    )
}

export default Subscribe
