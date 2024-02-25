import React from "react";
const TopPages= () => {
    return(
        <div
        style={{
            borderRadius: '7%',
            marginLeft:'16px',
            // padding:'10px',
            width: '400px',
             height: '200px', 
             border: '2px solid #E3E6E5',
             padding: '10px',
             marginTop:'25px',
             margin:'50px',
             backgroundColor:'rgb(255,255,255)'
        }}>
            <div style={{
                display:'flex',
            }}>
            <h1 style={{
                margin:'25px',
                color:'black',
             fontWeight:'bolder',
             fontSize:'20px'
             
            }}>Top Pages</h1>
            <h3 style={{
                color:'rgb(60,254,207)',  
                fontWeight:'bold',
                marginLeft:'115px',
                marginTop:'25px',
                cursor:'pointer'
            }}><u>View Report</u></h3>
            </div>
            <div style={{
                display:'flex',
                justifyContent:'space-between'
            }}>
            <h3 style={{
                marginTop:'15px',
                color:'gray',
             fontWeight:'bold',
             fontSize:'15px',

             
            }}>Pages</h3>
            <h2 style={{
            fontSize:'10px',
            textAlign:'end',
            color:'gray',
            fontWeight:'bold',
            marginTop:'15px'
        }}>SALES</h2>

            </div>
            <div style={{
                display:'flex',
                justifyContent:'space-between',
                marginTop:'25px'
            }}>
            <h1 style={{
                color:'black',
             fontWeight:'bold',
             fontSize:'15px'
             
            }}>No Data </h1>
            <h3 style={{
                color:'black',
                fontWeight:'bold'
                
            }}>
                $0
            </h3>
            </div>
            </div>
    )
}
export default TopPages;