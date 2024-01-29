import React from "react";
const TopVid= () => {
    return(
        <div
        style={{
            marginLeft:'10px',
            borderRadius:'2%',
            width: '400px',
             height: '200px', 
             border: '2px solid #d3d3d3',
             padding: '10px',
             marginTop:'25px',
             margin:'50px',
             backgroundColor:'white'
        }}>
            <div style={{
                display:'flex',
            }}>
            <h1 style={{
                margin:'25px',
                color:'black',
             fontWeight:'bolder',
             fontSize:'20px'
             
            }}>Top Videos</h1>
            <h3 style={{
                color:' rgb(60,254,207)',
                fontWeight:'bold',
                marginLeft:'115px',
                marginTop:'25px'
            }}><u>View Report</u></h3>
            </div>
            <div style={{
                display:'flex'
            }}>
            <h3 style={{
                margin:'15px',
                marginTop:'15px',
                color:'gray',
             fontWeight:'bold',
             fontSize:'15px',

             
            }}>Pages</h3>
            <h2 style={{
            fontSize:'10px',
            textAlign:'end',
            marginLeft:'250px',
            color:'gray',
            fontWeight:'bold',
            marginTop:'15px'
        }}>SALES</h2>

            </div>
            <h1 style={{
                margin:'25px',
                color:'black',
             fontWeight:'bold',
             fontSize:'15px'
             
            }}>No Data </h1>
            </div>
    )
}
export default TopVid;