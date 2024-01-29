import React from "react";

const Info = () => {
  return (
    <div
      style={{
        borderRadius: "7%",
        marginLeft: "16px",
        padding: "10px",
        width: "400px",
        height: "200px",
        border: "2px solid #E3E6E5",
        padding: "10px",
        marginTop: "25px",
        margin: "50px",
        backgroundColor: "rgb(255,255,255)",
      }}
    >
      <h1
        style={{
          margin: "25px",
          color: "black",
          fontWeight: "bolder",
          fontSize: "20px",
        }}
      >
        Watch Time/Shopper
      </h1>

      <h1
        style={{
          fontSize: "x-large",
          fontSize: "20px",
          marginLeft: "25px",
          fontWeight: "bold",
        }}
      >
        0s
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin:'15px'
        }}
      >
        <h3
          style={{
            marginTop: "15px",
            color: "gray",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          Pages
        </h3>
        <h2
          style={{
            fontSize: "25px",
            textAlign: "end",
            color: "gray",
            fontWeight: "bold",
            marginTop: "15px",
          }}
        >
          0s
        </h2>
      </div>
    </div>
  );
};

export default Info;
