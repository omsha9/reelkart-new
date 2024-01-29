import React from "react";
import { Box, Text } from "@shopify/polaris";
import Progress from "./progress";
import { CircularProgressbar,CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function BoxWithColorExample() {
  return (
    <Box background="bg-fill-info">
      <Placeholder2 label="Content inside a box" />
    </Box>
  );
}

const Placeholder2 = ({ label = "", height = "60vh", width = "35vw" }) => {
  return (
    <div>
      <div
        style={{
          background: "rgb(19,23,22)",
          height: height,
          width: width,
          borderRadius: "5%",
          marginLeft: "16px",
          padding: "10px",
        }}
      >
        <div
          style={{
            color: "white",
            borderRadius: "10%",
          }}
        >
          <Text as="p" variant="bodyMd">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h1
                style={{
                  fontSize: "20px",
                  marginTop: "7px",
                  marginLeft: "7px",
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
                  alignItems: "end",
                  marginLeft: "115px",
                  color: "rgb(60,254,207)",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <u>View Report</u>
              </h2>
            </div>
          </Text>
        </div>
        <div
          style={{
            marginTop:'25px',
            textAlign: "center",
            
          }}
        > 
          <div
            style={{
              justifyItems: "center",
              alignItems: "flex-start",
              width: "200px",
              height:"200px",
              fontSize:"8px",
              margin:'auto'
            }}
          >
            

<CircularProgressbarWithChildren styles={buildStyles({
    // textSize: '8px',
    pathColor: 'rgb(60,254,207)',
    textColor: 'rgb(60,254,207)',
  })} value={66}>
  {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
  <div style={{ fontSize: 16, marginTop: -5 , color: 'rgb(60,254,207)'}}>

    <strong>Total $2000</strong> <br />5x ROI 66%
  </div>
</CircularProgressbarWithChildren>;

          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding:'0px',
            margin:'0px',
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              marginTop:'20px',
              padding:'10px',
              height:'100%',
              fontSize: "18px", 
              
            }}
          >
            <span
              style={{
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                marginTop:'10px'
              }}
            >
              <h1>On-site Video sales</h1>
              <h3 style={{}}>$0</h3>
            </span>
            <span
              style={{
                color: "gray",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                marginTop:'10px'
              }}
            >
              <h1>Influenced Video sales</h1>
              <h3 style={{}}>$0</h3>
            </span>
            <span
              style={{
                color: "gray",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                marginTop:'10px'
              }}
            >
              <h1>Direct Video sales</h1>
              <h3 style={{}}>$0</h3>
            </span>
          </div>
        </div>
      </div>
      

    </div>
  );
};
export default Placeholder2;
