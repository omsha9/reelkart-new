import SideNavBar from "../components/SideNavBar";

const MyProduct = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
        }}
      >
        <SideNavBar />
        <div style={{
            display:'flex',
            justifyContent:'space-evenly',
            backgroundColor:'red',
            width:"fit-content"
        }}>
          <h1
            style={{
              fontSize: "xx-large",
              padding: "10px",
            }}
          >
            MyProducts
          </h1>
          <button style={{
            height:'60px',
            width:'50px',
            borderRadius:'15%',
            // backgroundColor : 'whitesmoke',
            // color:black(--p-icon-hovered),
          }}>
             All
          </button>
          <button style={{
            height:'60px',
            width:'100px',
            borderRadius:'15%',
            // backgroundColor : 'whitesmoke',
            // color:black(--p-icon-hovered),
          }}>
             Mapped
          </button>
          <button style={{
            height:'60px',
            width:'100px',
            borderRadius:'15%',
            // backgroundColor : 'whitesmoke',
            // color:black(--p-icon-hovered),
          }}>
             UnMapped
          </button>
        </div>
      </div>
    </>
  );
};
export default MyProduct;
