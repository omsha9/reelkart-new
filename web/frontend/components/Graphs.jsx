import React from "react";
import { Box, Text } from "@shopify/polaris"; 
import { LineBar } from "./LineBar";





const Graphs = () => {
  return (
    <div
      style={{
        borderRadius: "7%",
        marginLeft: "16px",
        padding: "10px",
        width: "500px",
        height: "fit-content",
        border: "2px solid #E3E6E5",
        padding: "10px",
        marginTop: "25px",
        margin: "50px",
        backgroundColor: "rgb(255,255,255)",
      }}
    >
    
      <div>
        <Text as="p" variant="bodyMd">
          <div
            style={{
              display: "flex",
              justifyContent:'space-between'
            }}
          >
            <h1
              style={{
                fontSize: "20px",
                margin:'20px',
                fontWeight: "bold",
              }}
            >
              Video Sales
            </h1>
            <h2
              style={{
                fontSize: "10px",
                marginTop: "7px",
                textAlign: "end",
                marginLeft: "115px",
                color: "rgb(60,254,207)",
                fontWeight: "bold",
                cursor: "pointer",
                margin:'20px'
              }}
            >
              <u>View Report</u>
            </h2>
          </div>
        </Text>
        <Text>
          <h1
            style={{
              fontSize: "x-large",
                fontSize: "20px",
                marginLeft:'20px',
                fontWeight: "bold",
            
            }}
          >
            0%
          </h1>
          <div style={{
            display:'flex',
            justifyContent:'space-between'
          }}>
          <h4 style={{
            color:'rgb(70,73,72)',
            margin:'20px'
          }}>Purchased</h4>
          <h2 style={{
            margin:'20px',
            fontWeight:'bold'
          }}>0%(0)</h2>
          </div>
        </Text>
      </div>
      <div style={{
        margin:'25px',
    
        
        
      }}>
      <LineBar/>
      </div>
    </div>
  );
};
export default Graphs;
