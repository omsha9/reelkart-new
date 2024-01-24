import React from "react";
import { Box, Text } from "@shopify/polaris";
import bag from "../assets/bag.png";
import reel from "../assets/play-button.png";
import brochure from "../assets/brochure.png";
import shopify from "../assets/shopify.png";
import file from "../assets/file.png";
import display from "../assets/display-frame.png";
// import logo from '../assets/reelkart-logo';
import { createBrowserRouter } from "react-router-dom";
import MyProduct from "./MyProduct";
import { Link } from "react-router-dom";

function BoxWithColorExample() {
  return (
    <Box background="bg-fill-info">
      <Placeholder label="Content inside a box" />
    </Box>
  );
}

const Placeholder = ({ label = "", height = "140vh", width = "12vw" }) => {
  return (
    <div
      style={{
        background: "whitesmoke",
        height: "100vh",
        width: width,
        borderRadius: "2%",
        boxShadow: "9px 14px 10px 0px rgba(0, 0, 0, 0.16)",
        WebkitBoxShadow: "9px 14px 10px 0px rgba(0, 0, 0, 0.16)",
        MozBoxShadow: "9px 14px 10px 0px rgba(0, 0, 0, 0.16)",
      }}
    >
      <div
        style={{
          color: "",
        }}
      >
        <Text as="p" variant="bodyMd">
          <h1
            style={{
              color: "grey",
              marginLeft: "20px",
              marginTop: "2px",
            }}
          >
            Reelkart
          </h1>
           </Text>
          <div
            style={{
              listStyle: "none",
            }}
          >
            {/* overview */}
            <div
              style={{
                display: "flex",
                alignContent: "start",
                marginTop: "25px",
                marginLeft:'10px',
                alignItems:'center',
                
              }}
            >
              <img
                style={{
                  marginRight: "10px",
                }}
                src={file}
                height={15}
                width={15}
              ></img>
              <span
                style={{
                  color: "black",
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: "0px",
                  textDecoration: "none", // Initial state (no underline)
                  transition: "text-decoration 0.3s ease", // Smooth transition for the underline
                  ":hover": {
                    textDecoration: "underline", // Underline on hover
                  },
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Overview
              </span>
            </div>
            {/* display */}
            <div
              style={{
                display: "flex",
                alignContent: "start",
                marginTop: "25px",
                marginLeft:'10px',
                alignItems:'center',
              }}
            >
              <img
                style={{
                  marginRight: "10px",
                }}
                src={display}
                height={15}
                width={15}
              ></img>
              <span
                style={{
                  color: "black",
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: "0px",
                  textDecoration: "none", // Initial state (no underline)
                  transition: "text-decoration 0.3s ease", // Smooth transition for the underline
                  ":hover": {
                    textDecoration: "underline", // Underline on hover
                  },
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Display
              </span>
            </div>
          </div>

          <h2
            style={{
              color: "grey",
              marginLeft: "20px",
              marginTop:'20px'
            }}
          >
            SetUp
          </h2>
          {/* My Product */}
          <button style={{
            marginTop: "25px",
            marginLeft:'10px',
            border:'hidden',
            padding:'10px',
            
          }}>
          <div
              style={{
                display: "flex",
                alignContent: "start",
                
                alignItems:'center',
                
              }}
            >
              <img
                style={{
                  marginRight: "10px",
                }}
                src={bag}
                height={15}
                width={15}
              ></img>
              <span
                style={{
                  color: "black",
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: "0px",
                  textDecoration: "none", // Initial state (no underline)
                  transition: "text-decoration 0.3s ease", // Smooth transition for the underline
                  ":hover": {
                    textDecoration: "underline", // Underline on hover
                  },
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              > 
                My Product
              </span>
            </div>
            </button>
            <div
              style={{
                display: "flex",
                alignContent: "start",
                marginTop: "25px",
                alignItems:'center',
                marginLeft:'10px'
              }}
            >
              <img
                style={{
                  marginRight: "10px",
                }}
                src={reel}
                height={15}
                width={15}
              ></img>
              <span
                style={{
                  color: "black",
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: "0px",
                  textDecoration: "none", // Initial state (no underline)
                  transition: "text-decoration 0.3s ease", // Smooth transition for the underline
                  ":hover": {
                    textDecoration: "underline", // Underline on hover
                  },
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                My Reels
              </span>
            </div>
            
            <div
              style={{
                display: "flex",
                alignContent: "start",
                marginTop: "25px",
                marginLeft:'10px',
                alignItems:'center',
              }}
            >
              <img
                style={{
                  marginRight: "10px",
                }}
                src={brochure}
                height={15}
                width={15}
              ></img>
              <span
                style={{
                  color: "black",
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: "0px",
                  textDecoration: "none", // Initial state (no underline)
                  transition: "text-decoration 0.3s ease", // Smooth transition for the underline
                  ":hover": {
                    textDecoration: "underline", // Underline on hover
                  },
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Catalogue
              </span>
            </div>
          </div>
          <h1
            style={{
              color: "grey",
              marginLeft: "20px",
              marginTop:'20px'
            }}
          >
            Connected Apps
          </h1>
          <div
            style={{
              listStyle: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignContent: "start",
                marginTop: "25px",
                alignItems:'center',
                marginLeft:'10px'
              }}
            >
              <img
                style={{
                  marginRight: "20px",
                }}
                src={shopify}
                height={15}
                width={15}
              ></img>
              <span
                style={{
                  color: "black",
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: "0px",
                  textDecoration: "none", // Initial state (no underline)
                  transition: "text-decoration 0.3s ease", // Smooth transition for the underline
                  ":hover": {
                    textDecoration: "underline", // Underline on hover
                  },
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Shopify
              </span>
            </div>
          </div>
        
      </div>
    
    
  );
};

// const appRouter = createBrowserRouter([
//   {
//     path:"/",
//     element:<SideNavBar/>,
//   },
//   {
//     path:"/MyProduct",
//     element:<MyProduct/>
//   }
// ])



export default Placeholder;
