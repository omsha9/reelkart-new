const start = performance.now();
// const REELKART_DOMAIN = "https://dgn77rmztraz5.cloudfront.net";

const REELKART_DOMAIN = "https://backend.reelkart.io/api/public";
// "https://core-api.reelkart.io/public"
// "http://localhost:8002"
var reelsData = [];
let collectionsData = [];
let domain = "";
// Keep track of the current visible video element
let currentVideo = null;
let isMuted = false;
let STORE_ID = null;
let cart_count = 0;

let reelIndex = 0;

let initialTouchY = null;
let initialOffset = 0;
let currentOffset = 0;
let swipeDirection = null;

let horizontalScrolling = false;

let browserIp = null;

let positionStyle;
document.addEventListener("DOMContentLoaded", function () {
  var scriptElement = document.querySelector('script[position="hidden"]');
  if (scriptElement) {
    positionStyle = scriptElement.getAttribute("position");
    console.log("Position:", position); // This will log "hidden"
  }
});
// "http://localhost:8002"

function addStyle(styleString) {
  const style = document.createElement("style");
  style.textContent = styleString;
  document.head.append(style);
}

const close_btn_html = () => {
  const btn = document.createElement("div");
  btn.classList = "rk-close-btn";
  btn.id = "rk-close-btn";
  btn.innerHTML = `
            <div class="close-icon">
              <svg class="close-icon-svg" viewBox="0 0 14.583332061767578 14"
              xmlns="http://www.w3.org/2000/svg">
                <path
                d="M 14.583332061767578 1.4099998474121094 L 13.11458234877812 0 L 7.291666030883789 5.590000152587891 L 1.4687497129894576 0 L 0 1.4099998474121094 L 5.822916317894331 7 L 0 12.59000015258789 L 1.4687497129894576 14 L 7.291666030883789 8.40999984741211 L 13.11458234877812 14 L 14.583332061767578 12.59000015258789 L 8.760415743873246 7 L 14.583332061767578 1.4099998474121094 Z"
                fill="rgba(255, 255, 255, 1)"></path>
              </svg>
            </div>
      `;
  return btn;
};

const open_btn_html = () => {
  const btn = document.createElement("div");
  btn.classList = "rk-open-btn";
  btn.id = "rk-open-btn";
  btn.innerHTML = `
            <div class="open-icon">
              <svg class="open-icon-svg" viewBox="0 0 8.708333969116211 10.5"
              xmlns="http://www.w3.org/2000/svg">
                <path
                d="M 1.5833334489302202 2.7300002574920654 L 5.755417449257617 5.25 L 1.5833334489302202 7.769999742507935 L 1.5833334489302202 2.7300002574920654 Z M 0 0 L 0 10.5 L 8.708333969116211 5.25 L 0 0 Z"
                fill="rgba(255, 255, 255, 1)"></path>
              </svg>
            </div>
      `;
  return btn;
};
/**
 * The function "useUrl" checks if a given URL contains a specific string and replaces it with another
 * string if it does.
 * @param url - The `url` parameter is a string that represents a URL.
 * @returns The function will return the updated URL if the original URL contains
 * "cdn.reelkart.io/media". Otherwise, it will return the original URL.
 */
function useUrl(url) {
  let URL;

  if (url.includes("cdn.reelkart.io/media")) {
    URL = url.replace(
      "cdn.reelkart.io/media",
      "reelkart.blob.core.windows.net/reelkart"
    );
    return URL;
  } else {
    console.log("No need to update!");
    return url;
  }
}
function getIpAddress() {
  let ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/;
  fetch("https://www.cloudflare.com/cdn-cgi/trace")
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
    })
    .then((data) => {
      // Extract the IP address using a regular expression
      let ipRegex = /ip=([0-9.]+)/;
      let match = data.match(ipRegex);

      if (match) {
        let ipAddress = match[1];
        console.log("Your IP address is: " + ipAddress);
        browserIp = ipAddress;
        console.log("BrowserIp inside", browserIp);
      } else {
        throw new Error("IP address not found in the response");
      }
    })
    .catch((error) => {
      console.error("Error: " + error.message);
    });
}
const videoElement = document.createElement("video");

const video_html = () => {
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.loop = true;
  videoElement.setAttribute("playsinline", ""); // Set playsinline attribute
  videoElement.style = "object-fit:cover;display:block !important";
  videoElement.classList = "rk-video short-video";
  videoElement.id = "rk-video";
  return videoElement;
};

addStyle(`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap');
      #rk-widget {
        position: fixed;
        overflow: visible;
        z-index: 5;
        scale:0;
        box-shadow: 0 0 35px 0px white;
        border-radius: 100%;
        width: fit-content;
        display:none;
      }

      #rk-widget-Inside{
        width: inherit;
        height: inherit;
        position: relative;
      }

      video{
        display:block !important;
      }

      .SVR{
        width: 150%;
        position: absolute;
        z-index: -1;
        height: inherit;
        transform: translate(-16%,-25%);
        max-width: none !important;
      }
    
      @media screen and (min-width: 1025px) {
        #rk-widget {
          bottom: 20px;
          right: 35px;
        }
      }
      @keyframes fade-animation {
    
        0%,
        100% {
          opacity: 0;
        }
    
        50% {
          opacity: 1;
        }
      }
    
      .rk-container {
        z-index: 9999;
        padding: 0px 0px 0px 0px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0px;
        height: 310px;
        width: 174px;
        position: relative;
        transition: all .3s ease-in-out;
        // box-shadow: rgba(0, 0, 0, .24) 0px 3px 8px;
        background-color:transparent;
      }
    
    
    
    
      .rk-video-wrapper {
        position: relative;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0px 0px 0px 0px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0px;
        height: 100%;
        width: 100%;
        z-index: 1 !important;
        overflow: hidden;
        border-radius:2em;
        cursor: pointer;
      }
    
      .rk-video.short-video {
        position: relative;
        background: rgba(213.56249392032623, 191.31640523672104, 191.31640523672104, 1);
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0;
      }
    
      .rk-textbox {
        position: absolute;
        left: 0px;
        border-radius: 0px 0px 4px 4px;
        padding: 14px 0px 14px 0px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0px;
        z-index: 2;
        bottom: 0;
        top: auto;
        width: 100%;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .75) 100%);
      }
    
      .rk-caption {
        color: inherit;
        font-family: 'Manrope', sans-serif;
        height: 36px;
        display: flex;
        align-items: center;
        padding: 0px 12px;
        text-align: center;
        text-decoration: none;
        cursor:pointer;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: normal;
        line-height: 10px;
        background: #FFFFFF !important;
        box-shadow: 0px 2px 4px rgba(97, 97, 97, 0.18), 0px 4px 8px rgba(97, 97, 97, 0.18) !important;
        border-radius: 12px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: antialiased;
        font-smooth: auto;
        cursor:pointer !important;
      }
    
      .rk-close-btn {
        top: 10px;
        background: rgba(4.000000236555934, 4.000000236555934, 4.000000236555934, 1);
        border-radius: 20px;
        padding: 0px 0px 0px 0px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0px;
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 2;
        left: auto;
        right: 10px;
      }
    
      .close-icon {
        position: relative;
        border-radius: 0px;
        width: 25px;
        height: 24px;
      }
    
      .close-icon-svg {
        height: 14px;
        width: 14.583332061767578px;
        position: absolute;
        top: 5px;
        left: 5.208333492279053px;
        opacity: 1;
        fill: rgba(255, 255, 255, 1);
        border-radius: 0px;
        height: 14px;
        width: 58.33332824707031%;
      }
    
      .rk-open-btn {
        position: absolute;
        background: rgba(0, 0, 0, 0);
        border-radius: 10.5px;
        padding: 0px 0px 0px 0px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0px;
        display: none;
        top: 50%;
        left: 50%;
        height: 21px;
        width: 21px;
        transform: translate(-50%, -50%);
      }
    
      .open-icon {
        position: relative;
        border-radius: 0px;
        height: 18px;
        width: 90.47619047619048%;
      }
    
      .open-icon-svg {
        height: 10.5px;
        width: 8.708333969116211px;
        position: absolute;
        top: 3.75px;
        left: 6.333333492279053px;
        opacity: 1;
        fill: rgba(255, 255, 255, 1);
        border-radius: 0px;
        height: 10.5px;
        width: 45.833336679559004%;
      }
    
      .q-frame-121821388 {
        position: relative;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0px 0px 0px 0px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.25);
      }
    
      .rk-container-collapsed {
        width:inherit;
        height:inherit;
        overflow: hidden !important;
        border-radius: 50% !important;
      }
    
      .rk-open-btn {
        animation: fade-animation 1.7s infinite;
        transform: translate(-50%, -50%) scale(2) !important;
      }

      * {
      -webkit-tap-highlight-color: transparent;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      }
    `);

addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap');

    #modal {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        font-family: "Manrope", sans-serif !important;
        overflow: hidden;
        /* display: none; */
        /* Apply Animation */
        animation-name: scaleAnimation;
        animation-duration: 0.3s;
        animation-timing-function: ease;
        animation-fill-mode: both;
        animation-delay: 0s;
        z-index:999999999999999999999;
  

    }
    
    @keyframes scaleAnimation {
        from {
            transform: scale(0.5);
        }
    
        to {
            transform: scale(1);
        }
    }
    
    
    #modal-Inside {
        width: inherit;
        height:inherit;
        font-size: 1.5vh;
        position: relative;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        -ms-overflow-style: none;
        scrollbar-width: none;
        touch-action: pan-y;
        overflow:hidden;

    }

    #rk-reels-wrapper{
        width:inherit;
        overflow-x: hidden;
        overflow-y: hidden !important;
        transition: transform 300ms ease 0s;
        transform: translate3d(0px, 0px, 0px);
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateZ(0); /* Ensure hardware acceleration for smoother scrolling */
       
    }
    
    #modal-Inside::before {
        transform: translateZ(0);
        will-change: transform;
    }
    
    
    
    #modal-Inside ::-webkit-scrollbar {
        display: none;
    }
    
    .watermark {
        font-size: 1.3em;
        position: fixed;
        top: 0.5em;
        left: 1em;
        z-index: 200;
        color: white;
        font-weight: bolder;
    }
    
    .closeBtn {
        position: fixed;
        top: 1.2em;
        right: 3.2em;
        z-index: 200;
    }
    
    
    .rk-card {
        position: relative;
        // height: calc(90vh);
        aspect-ratio: 1/1.9;
        background-color: transparent !important;
        margin-block: 0px;
        border-radius: 0em !important;
        flex: 0 0 auto;
        scroll-snap-align: center;
        scroll-snap-stop: always;
        scroll-snap-destination: 0% 50%;
        overflow: hidden;
    }

    .rk-card-Inside{
        width:inherit;
        height:inherit;
    }

    
    
    
    .rk-card video {
        width: inherit;
        height: inherit;
        border-radius: inherit;
        margin: 0 !important;
        object-fit: cover;
        transform: translateZ(0);
        display: block !important;
    }
    
    
    .collectionWrapper {
        width: 40%;
        position: fixed;
        top: 0;
        left: 30%;
        z-index: 200000;
        border-radius: 1em;
        scale: 0;
        display: flex;
        overflow-x: scroll;
        justify-content: flex-start;
        align-items: center;
        padding-left: 1em;
        width: 95vw;

    
    }
    
    .collectionItem {
        aspect-ratio: 1/1;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding-left:0.5em;
    }
    
    .collectionItem img {
        width: 4.5em;
        aspect-ratio: 1/1;
        border: 0.3em solid white;
        border-radius: 100%;
        margin-inline: 0.5em;
    }
    
    .collection-Active {
        border-color: royalblue !important;
    }
    
    .collectionItem h3 {
        font-size: 0.8em;
        font-weight:bold;
        margin: 0;
        margin-top: 0.4em;
        text-transform: capitalize;
        text-align: center;
        max-width:100%;
        height: 50%;
        background-color: #ffffff54;
        border-radius: 0.6em;
        display: grid; /* Use CSS Grid */
        align-items: center;
        padding-inline: 0.5em;
        max-height: 3em; /* Adjusted value to allow for truncation */
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: clip;
      }
      
    
    
    .Btn {
        width: 3.5em;
        height: 3.5em;
        background-color: rgb(252, 2, 2);
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.716);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(5px);
        transition: 0.1s all 0s;
    }


    .rk-cart-Btn{
        width: 3.5em;
        height: 3.5em;
        background-color: rgb(252, 2, 2);
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.716);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(5px);
        transition: 0.1s all 0s;
        position:relative;
    }
    
    
    .rk-cart-Btn>img {
        width: 45%;
        height: auto;
        object-fit: contain;
    }

    .Btn>img {
        width: 45%;
        height: auto;
        object-fit: contain;
    }
    
    
    
    
    .closeBtn:active {
        scale: 0.9;
    }
    
    
    .utilityWrapper {
        position: absolute;
        right: 0.8em;
        bottom: 12em;
        width: auto;
        height: auto;
    }
    
    .utilityWrapper .Btn {
        margin-block: 0.5em;
    
    }
    
    .bottomWrapperParent {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0.8em;
        display: flex;
        justify-content: center;
        transition: all .2s ease-in-out;
        z-index: inherit;
        overflow-x: scroll;
    
    }
    
    .bottomWrapperParentChild {
        width: 100%;
        overflow: scroll;
        display: flex;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        -ms-overflow-style: none;
        scrollbar-width: none;
    
        padding-inline: 0.5em;
    }
    
    .bottomWrapperContainer {
    
        width: 80%;
        margin-inline: 0.5em;
    
        height: 8.2em;
        /* aspect-ratio: 1/0.25; */
        border-radius: 1em;
        display: flex;
        align-items: center;
        padding-inline: 1.2em;
        justify-content: space-evenly;
        transition: all .2s ease-in-out;
        transform: translateZ(0);
        overflow: hidden;
    
        /* SNAP SCROLLING */
        flex: 0 0 auto;
        scroll-snap-align: center;
        scroll-snap-stop: always;
        scroll-snap-destination: 0% 50%;
    
    
    
        /* From https://css.glass */
        background: rgba(255, 255, 255, 0.29);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(0.2em);
        -webkit-backdrop-filter: blur(0.2em);
        cursor: pointer;

    
    
    }
    
    .bottomWrapperContainer-fullwidth {

        width: 96%;
    }
    
    .rk-ScrollBtn{
        width: 5.5em;
        height: 5.5em;
        background-color: white;;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        
        -webkit-backdrop-filter: blur(5px);
        transition: 0.1s all 0s;
        position:absolute;
        top:0;
        right:0;
        margin-right:2%;
    }

    .rk-ScrollBtn img{
        width:50%;
        height:auto;
    }

   
    .rk-Scroll-Up-Btn{
        margin-top:40vh;
    }

    .rk-Scroll-Down-Btn{
        margin-top:50vh;
        rotate:180deg;
    }
    
    
    @keyframes slideUp {
        0% {
            transform: translateY(100%);
        }
    
        100% {
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        0% {
            transform: translateY(0);
        }
    
        100% {
            transform: translateY(100%);
        }
    }
    
    
    .slide-up {
        animation: slideUp 0.2s ease-in-out;
    }
    
    
    .slide-down {
        animation: slideDown 0.2s ease-in-out;
    }
    
    
    
    
    
    .bottomWrapper {
        width: 100%;
        height: inherit;
        left: calc(50% - 47.5%);
        bottom: 0.8em;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        transition: all .2s ease-in-out;
    }
    
    .rk-image {
        width: 22%;
        aspect-ratio: 1/1;
        background-color: white;
        border-radius: 1em;
        overflow: hidden;
        border: 0.15em solid rgba(255, 255, 255, 1);
    }
    
    .rk-image img {
        width: 100%;
        object-fit: contain;
    }
    
    .content {
        width: 50%;
        height: 100%;
        margin-inline: 0.5em;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    
    
    .content h3 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: "Manrope", sans-serif !important;
        font-size: 1em;
        margin: 0;
    }

    #shop-now-btn{
        font-size: 98%;
        color: white !important;
    }
    
    .rk-button {
        width: 30%;
        aspect-ratio: 1/0.4;
        background-color: #4169E1;
        border-radius: 0.2em;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 1.15em;
        font-weight: bold;
        cursor: pointer;
        transition: 0.1s ease-in-out 0s;
    }
    
    /* .button:active {
        scale: 0.9;
    } */
    
    .content h2 {
        font-weight: bold !important;
        font-size: 1.1em !important;
        text-transform: capitalize !important;
        margin: 0 !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        background-color: transparent !important;
        background-image: none !important;
      }
      
    
    
    
    .content p {
        font-size: 0.8em;
        margin: 0;
    
    }
    
    .content h1 {
        font-size: 1.1em;
        font-weight: bolder;
        margin: 0;
    
    }
    
    
    
    .rk-card-slider-container {
        width: 100%;
        height: 90%;
        transition: all .2s ease-in-out;
        background-color: white;
        overflow: hidden;
        position: absolute;
        z-index: 1000000;
        display: flex;
        flex-direction: column;
        align-items: center;
        bottom: 0;
        border-radius: 1em 1em 0 0;
    }
    
    .rk-card-slider-child {
        width: 90%;
        height: 100%;
        overflow-y: scroll;
        padding-bottom: 4em;
    }
    
    
    .rk-card-slider-container .Slider-Btn {
        width: 3em;
        position: absolute;
        height: 3em;
        aspect-ratio: 1/1;
        right: 0.5em;
        top: 0.8em;
        box-shadow: none;
    }
    
    .Slider-Btn img {
        width: auto;
        height: 50%;
    }

    .rk-Slider-Heading {
        display: flex;
        align-items: center;
        font-size: 1.4em;
        margin-top: 0.8em;
        font-weight: bold;
        justify-content:space-between;
    }

    .rk-size-chart-heading{
        font-size: 0.9em !important;
        text-decoration:underline;
        cursor:pointer;
        color:black;
        margin:0;
    }

    .rk-size-modal{
        width:90%;
        height:calc(100% - 13em);
        position:absolute;
        top:5em;
        background-color:white;
        border-radius:1em;
        z-index:1;
        overflow:scroll;
        display:flex;
        align-items:center;
        box-shadow: 0 0 10px #d0d0d0;
        
        /* Apply Animation */
        animation-name: scaleAnimation;
        animation-duration: 0.3s;
        animation-timing-function: ease;
        animation-fill-mode: both;
        animation-delay: 0s;
    }

    .rk-size-chart-img{
        width:100%;

    }
    
    
    
    .sliderproductImageWrapper {
        width: 90%;
        aspect-ratio: 1/1;
        display: flex;
        margin-top: 2em;
        background-color: white;
        /* border-radius: 2.9em; */
        margin-inline: auto;
        overflow-x: scroll;
        // scroll-snap-type: x mandatory;
        // scroll-padding: 0 1em;
        // /* Adjust the padding as per your preference */
        // scroll-snap-align: start;
    }
    
    .sliderproductImage {
        height: 86%;
        // aspect-ratio: 1/1;
        border-radius: 2em;
        object-fit: contain;
        border-radius: 1em;
        scroll-snap-align: center;
        margin-inline: 0.6em;
    }
    
    
    
    
    .optionSelector {
        width: 100%;
        font-size: 1.5em;
        background-color: rgba(255, 255, 255, 0.466);
        border-style: none;
        border-radius: 0.5em;
        padding: 0.5em;
        border: 0.1em solid #CDCDCD;
        cursor: pointer;
        border: 0.1em solid rgba(0, 0, 0, 0.1);
    
    }
    
    
    
    
    
    .bottomButtonsWrapper {
        width: 100%;
        height: 6em;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        position: sticky;
        bottom: 1em;
        z-index: 1;
        border-top-width: 0.1em;
        border-top-color: silver;
        border-top-style: solid;
        padding-top: 0.5em;
    }
    
    .bottomButtonsWrapper .rk-button {
        height: 60%;
        border-style: none;
        color:white !important;
    }
    
    
    
    .addtocartwrapper {
        width: 35%;
        height: 60%;
        border: 0.1em solid rgba(192, 192, 192, 0.3);
        border-radius: 0.2em;
    }
    
    .addtocart {
        width: 100%;
        height: 100% !important;
        background-color: #FB641B;
    }
    
    .quantityContainer {
        width: 100%;
        height: 100%;
        display: flex;
    }
    
    .quantityContainer button {
        width: 30%;
        height: 100%;
        cursor: pointer;
        border: 0;
        background-color: rgba(192, 192, 192, 0.3);
        padding: 0 !important;
        color: black !important;
    }
    
    .quantityContainer input {
        width: 40%;
        height: 100%;
        font-size: 1.25em;
        background-color: white;
        border: 0;
        text-align: center;
        appearance: none;
        padding: 0 !important;
    
    }
    
    .view-cart {
        width: 25%;
        color: #4169E1;
        background-color: white;
        display: flex;
        justify-content: start;
        padding: 0 !important;
    }
    
    .bottomButtonsWrapper div {
        margin-right: 0.8em;
    }
    
    .bottomButtonsWrapper h2 {
        margin: 0;
        font-size: 1.1em;
    }
    
    .bottomButtonsWrapper h3 {
        margin: 0;
        font-size: 1.3em;
        font-weight: bold;
        color: #14BE47;
    }
    
    .Cart-count {
        width: 1.5em;
        height: 1.5em;
        aspect-ratio: 1/1;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 100%;
        background-color: #4169E1;
        display: flex !important;
        justify-content: center;
        align-items: center;
        padding: 0.25em;
        margin-right: -0.4em;
        margin-top: -0.4em;
        opacity:0;
        color: white;
        font-weight: bolder;        
      
    }
    
    .Cart-count p {
        font-size: 0.8em;
        font-weight: bold;
        color: white !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    .Cart-count-visible {
        opacity:1
    }
    
    
    
    .description-container {
        position: relative;
        font-family: "Manrope", sans-serif !important;
    }
    
    .description-content {
        max-height: 150px;
        overflow: hidden;
        font-family: "Manrope", sans-serif !important;
    
    }
    
    
    .description-content.expanded {
        max-height: none;
    }
    
    .description-container::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
        /* background: linear-gradient(to top, white, transparent); */
    }
    
    button {
        background: none;
        border: none;
        cursor: pointer;
    }
    
    
    
    /* LOADER ANAIMATION */
    
    .rk-loader {
        border: 0.5em solid #f3f3f3 !important;
        border-radius: 50% !important;
        border-top: 0.5em solid #3498db !important;
        width: 3em !important;
        height: 3em !important;
        margin-top: calc(50vh - 1.5em) !important;
        -webkit-animation: spin 2s linear infinite !important;
        /* Safari */
        animation: spin 2s linear infinite !important;
        display:block !important;
    }

    .rk-buffer-loader {
        width: 3.5em !important;
        height: 3.5em !important;
        border: 0.4em solid #FFF;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -1.75em 0 0 -1.75em;
        z-index: 100;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    

    .rk-paused {
        width: 3.5em !important;
        height: auto !important;
        display: inline-block;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 100;
        margin: -1.75em 0 0 -1em;
    }
    
    
    /* Safari */
    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }
    
        100% {
            -webkit-transform: rotate(360deg);
        }
    }
    
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
    
        100% {
            transform: rotate(360deg);
        }
    }
    
    
    
    @media only screen and (max-width: 500px) {
        
        #modal{
            background-color:black;
        }

        #modal-Inside {
            padding: 0;
            font-size: 3.3vw;
            overflow-x:hidden;
        }

        #rk-reels-wrapper{
            background-color:black;
        }
      
    
    
        .rk-card {
            width: 100% !important;
            // height: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            background-color:green;
            margin-bottom:2px;
    
        }
    
    
        .closeBtn {
            position: fixed;
            top: 1.2em;
            right: 1.2em;
            z-index: 200;
        }
    
        .collectionWrapper {
            width: 98vw;
            top: 5em !important;
            left: 0;
            z-index: 200;
            border-radius: 0;
            scale: 1;
            overflow-y:hidden;
            
        }

        .rk-ScrollBtn{
            display:none;
        }
    
    
    }
    
    
    
    
    
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    input[type="number"] {
        -moz-appearance: textfield;
        /* Firefox */
        appearance: textfield;
    }
    `);

const applyPositionStyles = (position, offsetY = 20) => {
  let positionMap = {
    bottomright: `#rk-widget {
            bottom: ${offsetY}px;
            right: 35px;
            display:block;
          }`,
    topright: `
          #rk-widget {
            top: ${offsetY}px;
            right: 35px;
            display:block;
          }`,
    bottomleft: `
          #rk-widget {
            bottom: ${offsetY}px;
            left: 35px;
            display:block;
          }
          `,
    topleft: `
          #rk-widget {
            top: ${offsetY}px;
            left: 35px;
            display:block;
          }`,
    hidden: `
          #rk-widget {
            top: ${offsetY}px;
            left: 35px;
            display:hidden;
          }`,
  };

  if (!position) {
    position = "bottomright";
  }

  console.log(positionMap[position]);
  addStyle(positionMap[position]);
};

// ANALYTICS COLLECTOR FOR BRANDS

// https://core-api.reelkart.io/

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const AddViewsProductIds = (productIds = []) => {
  const existingProductIds =
    JSON.parse(localStorage.getItem("reelkart_viewed_productIds")) || [];
  // Merge the existing productIds with the new ones and remove duplicates
  const updatedProductIds = [
    ...new Set([...existingProductIds, ...productIds]),
  ];
  // Update the localStorage with the updated productIds
  localStorage.setItem(
    "reelkart_viewed_productIds",
    JSON.stringify(updatedProductIds)
  );
};

const CollectAnaytics = (type, productIds = []) => {
  const apiUrl = "https://backend.reelkart.io/api/public/analytics/event";
  // const apiUrl = "http://localhost:8002/public/analytics/event";
  // console.log(productIds,"LOFF");

  const data = {
    storeId: STORE_ID,
    type: type,
    browserIp: [browserIp],
  };
  console.log("browerIpAdress is here", browserIp);
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Do something with the retrieved data
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  AddViewsProductIds(productIds);
};

// GOOGLE ANALYTICS INTIALIZATION
const googleAnalyticsScript = document.createElement("script");
googleAnalyticsScript.src =
  "https://www.googletagmanager.com/gtag/js?id=G-5Q43TWJJ6L";
googleAnalyticsScript.async = true;
document.head.appendChild(googleAnalyticsScript);
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
  console.log(dataLayer);
}

// FACEBOOK PIXEL CODE
// Create a function to load the Facebook Pixel
function loadFacebookPixel() {
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  // Replace 'YOUR_PIXEL_ID' with your actual Facebook Pixel ID
  fbq("init", "177476677014203");
}

if (domain == "maishalifestyle.com") {
  loadFacebookPixel();
}
// Call the function to load the Facebook Pixel

// Fetch Cart Items
const FetchCart = () => {
  fetch(window?.Shopify?.routes?.root + "cart.js", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const items = data?.items;
      console.log(items, "FETCH CART");
      const cartCountElements = document.querySelectorAll(".Cart-count");
      console.log(cartCountElements);
      if (items?.length > 0) {
        const cartCount = items.length;
        cart_count = cartCount;
        cartCountElements.forEach((element) => {
          element.querySelector("p").textContent = cartCount;
          element.querySelector("p").style.margin = 0;
          element.classList.add("Cart-count-visible");
          element.style.opacity = 1;
        });
      } else {
        cartCountElements.forEach((element) => {
          element.querySelector("p").textContent = "";
          element.classList.remove("Cart-count-visible");
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const Cart_Set_Reelkart_Attribute = (cartId, redirect = false) => {
  const updateData = {
    id: cartId,
    attributes: {
      order_source: "reelkart",
    },
  };

  fetch(window?.Shopify?.routes?.root + "cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => response.json())
    .then((updatedCart) => {
      if (redirect) {
        window.location.href = "/cart";
      }
      FetchCart();
      console.log("Cart updated with attributes and tags:", updatedCart);
    })
    .catch((error) => {
      console.error("Error updating cart:", error);
    });
};

const LoaderModal = (show = true) => {
  const reelsWrapper = document.querySelector("#rk-reels-wrapper");
  const cards = reelsWrapper.querySelectorAll("div.rk-card"); // Select all div elements with class name 'card' inside reelsWrapper
  cards.forEach((card) => card.remove());

  let loader = reelsWrapper.querySelector(".rk-loader");

  // Remove the loader if it already exists
  if (loader) {
    loader.remove();
  }

  if (show == false) {
    return loader.remove();
  }

  // Create a new loader element
  loader = document.createElement("div");
  loader.classList.add("rk-loader");

  reelsWrapper.appendChild(loader);
};

function AddParamsInURL(key, value) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  history.pushState({}, "", newUrl);
  console.log(urlParams);
}

function getParamsValue(key) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(key);

  return value;
}

const createVideoElement = () => {
  const widget = document.createElement("div");
  widget.id = "rk-widget";

  const widgetInside = document.createElement("div");
  widgetInside.id = "rk-widget-Inside";
  widget.appendChild(widgetInside);

  const img = document.createElement("img");
  img.classList.add("SVR");

  const svgData = `<svg width="130" height="88" viewBox="0 0 130 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.63873 78.9552C8.21054 79.1249 7.92181 79.4103 7.77254 79.8115C7.62327 80.2127 7.62984 80.6974 7.79225 81.2655C7.90261 81.6516 8.05042 81.9619 8.23568 82.1965C8.4173 82.4322 8.62311 82.594 8.85309 82.6819C9.08204 82.7661 9.3167 82.7739 9.55707 82.7052C9.75946 82.6552 9.92231 82.5634 10.0456 82.4296C10.1679 82.2923 10.2602 82.126 10.3226 81.9309C10.3814 81.7368 10.4201 81.5209 10.4388 81.2831C10.4538 81.0463 10.4538 80.7982 10.4387 80.5385L10.3917 79.4646C10.3615 78.9454 10.3791 78.4558 10.4446 77.9958C10.5101 77.5358 10.6331 77.1185 10.8136 76.7439C10.994 76.3692 11.2411 76.0484 11.5548 75.7815C11.8675 75.5109 12.2564 75.3071 12.7215 75.1702C13.4073 74.9781 14.0509 74.9832 14.6524 75.1856C15.2492 75.3853 15.7787 75.7697 16.2408 76.3389C16.6982 76.9054 17.0571 77.6439 17.3174 78.5544C17.5756 79.4576 17.662 80.2839 17.5768 81.0331C17.4906 81.7787 17.2297 82.4167 16.7943 82.9469C16.3542 83.4746 15.7343 83.8625 14.9346 84.1108L14.2803 81.8218C14.6481 81.6891 14.9306 81.4921 15.1278 81.2309C15.3202 80.9671 15.4344 80.6567 15.4703 80.2998C15.5014 79.9402 15.4587 79.5565 15.3421 79.1486C15.2276 78.748 15.0699 78.4169 14.869 78.1552C14.6671 77.8898 14.4389 77.7049 14.1845 77.6004C13.93 77.4958 13.668 77.4821 13.3985 77.5591C13.1472 77.6309 12.9574 77.766 12.8289 77.9642C12.6993 78.1589 12.6151 78.4154 12.5761 78.7338C12.5361 79.0486 12.5252 79.424 12.5435 79.86L12.5858 81.1657C12.626 82.1746 12.4802 83.0219 12.1483 83.7077C11.8165 84.3935 11.2367 84.8528 10.4089 85.0855C9.73252 85.2828 9.08916 85.2717 8.47881 85.0522C7.86742 84.8291 7.32807 84.4376 6.86075 83.8778C6.39344 83.318 6.04318 82.6303 5.80997 81.8144C5.57259 80.9841 5.50745 80.2187 5.61453 79.5184C5.72057 78.8144 5.97726 78.217 6.38459 77.7263C6.79192 77.2356 7.32727 76.8895 7.99063 76.6881L8.63873 78.9552Z" fill="black"/>
    <path d="M15.0295 67.6391L3.40378 67.1419L3.5089 64.6839L8.30566 64.8891L8.51906 59.8993L3.72231 59.6942L3.82719 57.2419L15.4529 57.7391L15.348 60.1914L10.5456 59.986L10.3322 64.9757L15.1346 65.1811L15.0295 67.6391Z" fill="black"/>
    <path d="M15.3545 39.1935C16.5313 39.6682 17.4425 40.2951 18.0881 41.0742C18.7351 41.8498 19.1219 42.7084 19.2486 43.6499C19.3732 44.5864 19.2435 45.5307 18.8595 46.4827C18.4727 47.4417 17.9078 48.2145 17.1647 48.8011C16.4216 49.3877 15.5481 49.7359 14.544 49.8455C13.54 49.9551 12.4513 49.7733 11.278 49.3001C10.1012 48.8254 9.18925 48.2003 8.54226 47.4247C7.89526 46.6491 7.50946 45.793 7.38484 44.8564C7.25672 43.9184 7.38607 42.9699 7.77289 42.0109C8.15687 41.0589 8.7204 40.2896 9.46347 39.703C10.2044 39.1115 11.077 38.7609 12.081 38.6513C13.0865 38.5381 14.1776 38.7189 15.3545 39.1935ZM14.4214 41.5068C13.6591 41.1993 12.9702 41.0542 12.3547 41.0714C11.7406 41.0851 11.2154 41.2429 10.7791 41.5448C10.3429 41.8467 10.0135 42.2734 9.79104 42.8249C9.56858 43.3764 9.50971 43.9123 9.61442 44.4324C9.71913 44.9525 9.98715 45.4323 10.4185 45.8717C10.8512 46.3077 11.4487 46.6794 12.211 46.9869C12.9733 47.2943 13.6615 47.4412 14.2756 47.4275C14.8911 47.4103 15.417 47.2507 15.8533 46.9488C16.2896 46.6469 16.6189 46.2202 16.8414 45.6687C17.0639 45.1172 17.1227 44.5814 17.018 44.0612C16.9133 43.5411 16.6446 43.0631 16.2118 42.6272C15.7805 42.1877 15.1837 41.8142 14.4214 41.5068Z" fill="black"/>
    <path d="M24.3996 35.6286L15.6077 28.0057L18.6152 24.5371C19.1934 23.8702 19.8133 23.4126 20.475 23.1641C21.1338 22.9131 21.7945 22.8593 22.4573 23.0028C23.1196 23.1409 23.7427 23.463 24.3265 23.9692C24.9103 24.4755 25.3163 25.048 25.5444 25.687C25.7725 26.3259 25.8038 26.9923 25.6384 27.6861C25.4755 28.3771 25.1012 29.0603 24.5156 29.7357L22.5987 31.9465L21.1091 30.655L22.7654 28.7446C23.0756 28.3869 23.2697 28.0388 23.3476 27.7003C23.4252 27.3564 23.4034 27.0317 23.2823 26.7261C23.1608 26.4153 22.9555 26.1345 22.6664 25.8839C22.3745 25.6308 22.0689 25.4686 21.7497 25.3973C21.4301 25.3207 21.1084 25.3477 20.7848 25.4781C20.4582 25.6061 20.1386 25.8504 19.826 26.211L18.7391 27.4645L26.0112 33.7698L24.3996 35.6286Z" fill="black"/>
    <path d="M40.5645 8.41831L46.312 15.7011L46.413 15.663L45.9351 6.39612L48.4874 5.43508L48.8338 17.7386L45.8667 18.8558L38.0069 9.38135L40.5645 8.41831Z" fill="black"/>
    <path d="M59.8792 3.66436L61.0099 15.2457L58.5614 15.4847L57.4306 3.90343L59.8792 3.66436Z" fill="black"/>
    <path d="M70.109 15.2921L67.5087 14.8578L73.3874 4.04202L76.5146 4.56421L78.5546 16.7023L75.9542 16.2681L74.5579 6.93338L74.4682 6.91841L70.109 15.2921ZM70.6999 10.7535L76.8421 11.7792L76.5258 13.6734L70.3835 12.6478L70.6999 10.7535Z" fill="black"/>
    <path d="M91.8558 22.8339L99.007 13.6543L102.629 16.4757C103.322 17.0158 103.817 17.6007 104.114 18.2305C104.416 18.8597 104.52 19.4999 104.425 20.1513C104.336 20.8021 104.055 21.4308 103.583 22.0373C103.108 22.6469 102.568 23.0689 101.962 23.3033C101.36 23.5347 100.718 23.5726 100.037 23.4169C99.3597 23.2636 98.6683 22.9122 97.9631 22.3628L95.5383 20.4737L96.7534 18.9139L98.8645 20.5586C99.2351 20.8472 99.5824 21.0362 99.9066 21.1255C100.231 21.2148 100.532 21.2044 100.81 21.0943C101.09 20.9866 101.348 20.7818 101.583 20.48C101.821 20.1752 101.96 19.8705 102 19.5659C102.044 19.2636 101.983 18.9621 101.819 18.6613C101.66 18.3598 101.394 18.0636 101.021 17.7726L99.7117 16.753L93.7965 24.3459L91.8558 22.8339ZM100.067 22.5185L99.0945 28.4732L96.952 26.8041L97.9743 20.8878L100.067 22.5185Z" fill="black"/>
    <path d="M103.386 33.1584L112.942 26.5186L117.416 32.9577L115.751 34.1152L112.68 29.6964L110.403 31.2786L113.243 35.366L111.578 36.5234L108.737 32.436L106.456 34.0214L109.539 38.4588L107.873 39.6162L103.386 33.1584Z" fill="black"/>
    <path d="M110.858 45.5838L121.92 41.9757L124.352 49.4302L122.423 50.0591L120.755 44.9436L118.119 45.8034L119.662 50.5353L117.734 51.1643L116.19 46.4323L113.549 47.2938L115.224 52.4309L113.296 53.0598L110.858 45.5838Z" fill="black"/>
    <path d="M114.436 59.6338L126.069 59.363L126.127 61.8226L116.521 62.0462L116.637 67.0335L114.609 67.0807L114.436 59.6338Z" fill="black"/>
    <path d="M120.098 82.4625C120.552 82.5448 120.948 82.4551 121.286 82.1934C121.625 81.9318 121.876 81.5168 122.038 80.9487C122.148 80.5626 122.187 80.2211 122.154 79.924C122.124 79.6279 122.035 79.3818 121.886 79.1856C121.736 78.9931 121.541 78.8625 121.301 78.7938C121.103 78.7292 120.916 78.7211 120.74 78.7695C120.564 78.8215 120.398 78.9138 120.242 79.0465C120.089 79.1802 119.942 79.343 119.801 79.535C119.663 79.728 119.532 79.9387 119.407 80.1671L118.88 81.1036C118.631 81.5604 118.357 81.9667 118.058 82.3225C117.76 82.6784 117.435 82.9676 117.083 83.1903C116.732 83.4129 116.353 83.5546 115.945 83.6154C115.537 83.6799 115.099 83.6473 114.632 83.5177C113.948 83.3183 113.405 82.9738 113.001 82.4842C112.6 81.9992 112.354 81.393 112.262 80.6656C112.173 79.9429 112.259 79.1263 112.519 78.2158C112.777 77.3125 113.141 76.5654 113.609 75.9744C114.076 75.3871 114.635 74.9834 115.285 74.7634C115.937 74.5481 116.669 74.5464 117.479 74.7582L116.824 77.0472C116.442 76.9655 116.098 76.9834 115.793 77.1009C115.49 77.2232 115.229 77.4263 115.01 77.7104C114.793 77.9991 114.627 78.3474 114.51 78.7553C114.396 79.156 114.354 79.5204 114.387 79.8487C114.418 80.1807 114.514 80.4583 114.675 80.6815C114.835 80.9048 115.05 81.0549 115.32 81.1319C115.571 81.2038 115.804 81.1895 116.018 81.0891C116.23 80.9924 116.438 80.8191 116.639 80.5694C116.839 80.3233 117.047 80.0104 117.262 79.6306L117.916 78.4998C118.415 77.6221 118.987 76.9799 119.631 76.5731C120.275 76.1663 121.01 76.0829 121.836 76.3229C122.514 76.5129 123.055 76.8624 123.457 77.3713C123.858 77.8838 124.109 78.5012 124.21 79.2234C124.31 79.9456 124.244 80.7146 124.011 81.5304C123.774 82.3608 123.424 83.0449 122.963 83.5829C122.501 84.1244 121.968 84.4959 121.362 84.6971C120.757 84.8984 120.12 84.9093 119.45 84.7297L120.098 82.4625Z" fill="black"/>
    </svg>
    `;
  const encodedData = btoa(svgData);
  const dataUrl = `data:image/svg+xml;base64,${encodedData}`;

  img.src = dataUrl;
  widgetInside.appendChild(img);

  const container = document.createElement("div");
  container.id = "rk-container";
  container.classList = "rk-container";
  const wrapper = document.createElement("div");
  wrapper.classList = "rk-video-wrapper";
  wrapper.appendChild(video_html());
  wrapper.appendChild(text_box_html());
  wrapper.appendChild(close_btn_html());
  wrapper.appendChild(open_btn_html());
  container.appendChild(wrapper);
  widgetInside.appendChild(container);
  document.body.append(widget);

  document.getElementById("rk-close-btn").onclick = closeWidget;
  document.getElementById("rk-open-btn").onclick = openWidget;
};

const closeWidget = () => {
  console.log("close widget");
  document
    .getElementById("rk-container")
    .classList.add("rk-container-collapsed");
  document.getElementById("rk-close-btn").style.display = "none";
  document.getElementById("rk-open-btn").style.display = "flex";
  document.getElementById("rk-textbox").style.display = "none";
};

const openWidget = () => {
  console.log("open widget");
  console.log("BrowserIpAddress", browserIp);
  LoaderModal();
  setTimeout(() => {
    LoaderModal(false);
    RenderReels(reelsData);
  }, 10);

  // videoElement.play()
  const modal = document.querySelector("#modal");

  modal.style.display = modal.style.display === "none" ? "block" : "none";
  document.body.style.overflow = "hidden"; // Prevent body from scrolling

  videoElement.pause();

  gtag("event", "popup_open", {
    store_link: window?.location?.hostname,
    // 'reel_id': reelId,
    // 'reel_title': reelTitle
  });

  // document.getElementById('rk-close-btn').style.display = 'flex';
  // document.getElementById('rk-open-btn').style.display = 'none';
  // document.getElementById('rk-textbox').style.display = 'flex';
};

function toggleMute() {
  isMuted = !isMuted;
  const muteBtns = document.querySelectorAll(".muteBtn");
  for (let i = 0; i < muteBtns.length; i++) {
    const muteBtn = muteBtns[i];

    if (isMuted) {
      muteBtn.querySelector("img").src =
        'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none"><path d="M16.0409 4.11855C15.8067 4.01724 15.5499 3.97987 15.2965 4.01027C15.0432 4.04067 14.8024 4.13775 14.5988 4.2916L7.70568 9.74267H2.44208C2.05962 9.74267 1.69282 9.89461 1.42238 10.1651C1.15193 10.4355 1 10.8023 1 11.1848V19.8372C1 20.2197 1.15193 20.5865 1.42238 20.857C1.69282 21.1274 2.05962 21.2793 2.44208 21.2793H7.70568L14.5267 26.7304C14.7805 26.934 15.0955 27.0458 15.4208 27.0477C15.6362 27.0512 15.8492 27.0017 16.0409 26.9035C16.2863 26.7866 16.4937 26.6027 16.6391 26.3731C16.7846 26.1435 16.8621 25.8774 16.8629 25.6056V5.41643C16.8621 5.14461 16.7846 4.87855 16.6391 4.64892C16.4937 4.41929 16.2863 4.23543 16.0409 4.11855ZM13.9787 22.606L9.1045 18.7124C8.85078 18.5089 8.53569 18.3971 8.21041 18.3952H3.88417V12.6268H8.21041C8.53569 12.625 8.85078 12.5131 9.1045 12.3096L13.9787 8.41596V22.606Z" fill="black"/></svg>';
    } else {
      muteBtn.querySelector("img").src =
        "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2231%22%20height%3D%2231%22%20viewBox%3D%220%200%2031%2031%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M15.6239%204.30801C15.3897%204.20669%2015.1329%204.16932%2014.8795%204.19973C14.6262%204.23013%2014.3854%204.32721%2014.1818%204.48106L7.28869%209.93213H2.02509C1.64263%209.93213%201.27583%2010.0841%201.00538%2010.3545C0.734941%2010.6249%200.583008%2010.9917%200.583008%2011.3742V20.0267C0.583008%2020.4092%200.734941%2020.776%201.00538%2021.0464C1.27583%2021.3169%201.64263%2021.4688%202.02509%2021.4688H7.28869L14.1097%2026.9199C14.3635%2027.1234%2014.6786%2027.2352%2015.0038%2027.2371C15.2192%2027.2407%2015.4322%2027.1911%2015.6239%2027.0929C15.8693%2026.976%2016.0767%2026.7922%2016.2221%2026.5625C16.3676%2026.3329%2016.4451%2026.0668%2016.4459%2025.795V5.60588C16.4451%205.33407%2016.3676%205.06801%2016.2221%204.83837C16.0767%204.60874%2015.8693%204.42489%2015.6239%204.30801ZM13.5618%2022.7955L8.68751%2018.9019C8.43379%2018.6983%208.1187%2018.5865%207.79342%2018.5846H3.46717V12.8163H7.79342C8.1187%2012.8144%208.43379%2012.7026%208.68751%2012.499L13.5618%208.60541V22.7955ZM19.532%204.29359C19.3426%204.26707%2019.1499%204.27812%2018.9647%204.3261C18.7796%204.37407%2018.6058%204.45804%2018.4531%204.5732C18.3005%204.68837%2018.172%204.83247%2018.075%204.99728C17.9781%205.1621%2017.9145%205.3444%2017.888%205.53378C17.8615%205.72315%2017.8725%205.9159%2017.9205%206.10101C17.9685%206.28611%2018.0525%206.45996%2018.1676%206.61262C18.4002%206.92092%2018.7457%207.12421%2019.1282%207.17775C21.1705%207.49248%2023.0327%208.52772%2024.378%2010.0962C25.7233%2011.6647%2026.4629%2013.6629%2026.4629%2015.7293C26.4629%2017.7957%2025.7233%2019.7939%2024.378%2021.3624C23.0327%2022.9309%2021.1705%2023.9661%2019.1282%2024.2808C18.7457%2024.3076%2018.3896%2024.4852%2018.1381%2024.7746C17.8865%2025.064%2017.7603%2025.4414%2017.7871%2025.8239C17.8138%2026.2063%2017.9914%2026.5625%2018.2808%2026.814C18.5702%2027.0655%2018.9476%2027.1918%2019.3301%2027.165H19.532C22.2616%2026.7521%2024.7527%2025.374%2026.5528%2023.281C28.353%2021.188%2029.343%2018.5188%2029.343%2015.7581C29.343%2012.9975%2028.353%2010.3283%2026.5528%208.23529C24.7527%206.14228%2022.2616%204.76421%2019.532%204.35127V4.29359ZM18.8686%2018.3971C18.4862%2018.4583%2018.1437%2018.669%2017.9165%2018.9827C17.6893%2019.2964%2017.5961%2019.6875%2017.6573%2020.07C17.7185%2020.4524%2017.9291%2020.7949%2018.2428%2021.0221C18.5565%2021.2493%2018.9476%2021.3425%2019.3301%2021.2813C19.4866%2021.2796%2019.642%2021.2553%2019.7915%2021.2092C20.915%2020.8109%2021.8874%2020.0743%2022.5751%2019.1007C23.2628%2018.1272%2023.6321%2016.9645%2023.6321%2015.7726C23.6321%2014.5806%2023.2628%2013.4179%2022.5751%2012.4444C21.8874%2011.4709%2020.915%2010.7343%2019.7915%2010.3359C19.4282%2010.2135%2019.0311%2010.2405%2018.6877%2010.4109C18.3442%2010.5812%2018.0825%2010.8811%2017.9601%2011.2444C17.8377%2011.6078%2017.8647%2012.0048%2018.0351%2012.3483C18.2054%2012.6918%2018.5053%2012.9535%2018.8686%2013.0759C19.4158%2013.2834%2019.887%2013.6526%2020.2194%2014.1342C20.5519%2014.6159%2020.7299%2015.1873%2020.7299%2015.7726C20.7299%2016.3578%2020.5519%2016.9292%2020.2194%2017.4109C19.887%2017.8926%2019.4158%2018.2617%2018.8686%2018.4693V18.3971Z%22%20fill%3D%22black%22%2F%3E%0A%3C%2Fsvg%3E";
    }
  }

  const videos = document.querySelectorAll("video");

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];

    if (isMuted) {
      video.muted = true;
    } else {
      video.muted = false;
    }
  }
}

async function fetchByCollectionId(domain, rktcollectionid) {
  const url = `${REELKART_DOMAIN}/reels/bycollection/${domain}?collectionId=${rktcollectionid}&page=1&limit=150`;

  const response = await fetch(url);
  const result_1 = await response.text();
  console.log("collection1", JSON.parse(result_1));
  return JSON.parse(result_1)?.data?.reels;
}

const OpenReelsIdinReels = async (domain) => {
  let rktcollectionid = getParamsValue("rktcollectionid");
  if (!rktcollectionid) return;

  videoElement.play();

  const modal = document.querySelector("#modal");
  modal.style.display = modal.style.display === "none" ? "block" : "none";
  document.body.style.overflow = "hidden"; // Prevent body from scrolling

  videoElement.pause();
  LoaderModal();
  try {
    fetchByCollectionId(domain, rktcollectionid).then((result) => {
      console.log(result);
      // COMBINING NEW RESULT  WITH EXISTING ENSURE ENOUGH CONTENT IS ALWAYS THEIR TO SEE BY USER
      ReRenderReels(result);
      playVisibleVideo();
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductHandleFromURL = () => {
  const currentURL = window.location.pathname;
  const lastRoute = currentURL.split("/products/").pop();

  if (lastRoute === "" || lastRoute === currentURL) {
    return undefined;
  }

  return lastRoute;
};

let intervalId;

const getReels = (domain) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let productHandle = getProductHandleFromURL();

  console.log(productHandle);
  //OLD API = https://backend.reelkart.io/api/store/reels/list/${domain}?page=1&limit=15
  fetch(
    `${REELKART_DOMAIN}/reels/${domain}?product=${productHandle}&page=1&limit=150`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      if (result?.status == 200) {
        clearInterval(intervalId); // Stop the interval if fetch is successful
      }
      result = result?.data;
      reelsData = result?.reels;
      let { popupPosition, popupMargin, hidePopupHomepage, popupSize } =
        result?.setting;

      collectionsData = result?.collections;
      const Popupcontainer = document.querySelector("#rk-widget");

      if (Popupcontainer) {
        if (window.innerWidth < 500) {
          popupSize -= 10; // Reduce popupSize by 10 pixels
        }
        Popupcontainer.style.width = `${popupSize || 70}px`;
        Popupcontainer.style.height = `${popupSize || 70}px`;
        Popupcontainer.style.display =
          positionStyle === "hidden" ? "none" : "block";
      }

      applyPositionStyles(popupPosition, 20 + (popupMargin || 0));

      function containsProducts(path) {
        return path.includes("products");
      }

      console.log(window.location);
      if (
        (!containsProducts(window?.location?.pathname) &&
          domain == "cavaathleisure.com") ||
        (hidePopupHomepage &&
          hidePopupHomepage == true &&
          window?.location?.pathname == "/")
      ) {
        document.getElementById("rk-widget").style.display = "none";
      }

      let videoList = reelsData.map((video) => video.src);
      let randomIndex = Math.floor(Math.random() * videoList.length);

      if (productHandle) {
        randomIndex = 0;
      }

      let randomVideo = videoList[randomIndex];
      let randomVideoCaption = reelsData[randomIndex].products[0].title;
      console.log(randomVideoCaption, reelsData);
      let videoElement = document.getElementById("rk-video");
      document.getElementById("rk-widget").style.scale = 1;

      // Temporarily Disabled
      videoElement.setAttribute(
        "poster",
        useUrl(reelsData[randomIndex]?.thumbnail_src)
      );
      videoElement.setAttribute(
        "src",
        useUrl(reelsData[randomIndex]?.preview_src)
      );
      // ! all main here
      ShowCarousel(reelsData, result?.setting, domain);
      ProductPageReels(reelsData, result?.setting, domain);
      ShowEmbeddedReel(reelsData);
      showReelsModal(reelsData, collectionsData, domain);
      // console.log(reelsData[randomIndex]);
      STORE_ID = reelsData[randomIndex]?.storeId;

      localStorage.setItem("reelkart_storeId", STORE_ID);

      gtag("event", "popup_loaded", {
        store_link: window?.location?.hostname,
      });

      // document.getElementById('rk-caption').innerText = randomVideoCaption;
    })
    .catch((error) => {
      console.log("error", error);
      gtag("event", "popup_load_failed", {
        store_link: window?.location?.hostname,
        error: JSON.stringify(error),
      });
    });
};

const getDomainWithoutPrefix = () => {
  const domain = window.location.hostname;
  const domainWithoutPrefix = domain
    .replace(/^(https?:\/\/)?(www\.)?/i, "")
    .split("/")[0];
  return domainWithoutPrefix;
};

const getDomainFromParam = () => {
  let reelkartURL = new URL(
    Array?.from(document.getElementsByTagName("script"))?.filter((s) =>
      s?.src?.includes("js.reelkart.io")
    )[0]?.src ||
      Array?.from(document?.getElementsByTagName("script"))?.filter((s) =>
        s?.src?.includes("reelkart-sdk.js")
      )[0]?.src
  );

  const urlParams = new URLSearchParams(reelkartURL.search);
  var domainParam = urlParams.get("domain") || undefined;
  return domainParam;
};

const getReelsByDomain = () => {
  let domainlocal = getDomainWithoutPrefix() || "ihabags.com";
  let domainByParam = getDomainFromParam();
  if (domainByParam) {
    domainlocal = domainByParam;
  }
  domain = domainlocal;
  console.log("SHOPIFY: ", domain);

  createVideoElement();
  intervalId = setInterval(() => {
    getReels(domainlocal);
  }, 2000);
  getReels(domainlocal);
  // Start the interval and store the interval ID
};

function getIpAddress2() {
  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => {
      browserIp = data?.ip;
    })
    .catch((error) => {
      console.error("Error fetching IP address:", error.message);
      document.getElementById("ip-address").textContent =
        "Error fetching IP address";
    });
}

const launchReelkart = () => {
  SentryError();
  getIpAddress();

  var viewportMetaTag = document.querySelector('meta[name="viewport"]');
  var viewportMetaTagIsUsed =
    viewportMetaTag && viewportMetaTag.hasAttribute("content") ? true : false;
  if (!viewportMetaTagIsUsed) {
    var meta = document.createElement("meta");
    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    meta.name = "viewport";
    document.getElementsByTagName("head")[0].appendChild(meta);
  }
  try {
    // GOOGLE ANALYTICS INITIALIZATION

    gtag("js", new Date());
    gtag("config", "G-5Q43TWJJ6L");

    let reelkartURL = new URL(
      Array.from(document.getElementsByTagName("script")).filter((s) =>
        s.src.includes("reelkart-sdk.js")
      )[0].src
    );
    const params = new URLSearchParams(reelkartURL.search);
  } catch {
    applyPositionStyles("bottomright");
  }
  getReelsByDomain();
  closeWidget();
};

function isInView(element, container) {
  if (!element || !container) {
    return false;
  }

  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const containerTop = containerRect.top;
  const containerBottom = containerRect.bottom;
  const containerHeight = containerRect.height;

  const elementTop = elementRect.top;
  const elementBottom = elementRect.bottom;
  const elementHeight = elementRect.height;

  // Calculate the visible percentage of the element's height in the container
  const visiblePercentage = Math.max(
    0,
    Math.min(
      1,
      (Math.min(containerBottom, elementBottom) -
        Math.max(containerTop, elementTop)) /
        elementHeight
    )
  );

  // Return true if at least 50% of the element's height is visible in the container
  return visiblePercentage >= 0.3;
}

let isPlaying = false; // Add a flag to prevent re-entry
function playVisibleVideo() {
  if (isPlaying) {
    return; // Return early if the function is already in progress
  }

  isPlaying = true;

  const cards = document.querySelectorAll(".rk-card");
  let visibleVideo = null;
  let visibleCard = null;

  const loaderSpan = document.createElement("span");
  loaderSpan.classList.add("rk-buffer-loader");

  const scrollableDiv = document.getElementById("modal-Inside");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const video = card.querySelector("video");
    console.log("video 4234234", video);
    // Check if loaderSpan is present in the card, then remove it
    const loaderSpan = card.querySelector(".rk-buffer-loader");
    if (loaderSpan) {
      card.removeChild(loaderSpan);
    }

    if (reelIndex == i) {
      visibleVideo = video;
      visibleCard = card;
      break;
    }
  }

  function showBuffering() {
    visibleCard.appendChild(loaderSpan);
  }
  function hideBuffering() {
    visibleCard.removeChild(loaderSpan);
    // visibleVideo.style.filter = 'blur(0)';
  }

  if (currentVideo !== visibleVideo) {
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.removeAttribute("src"); // Remove src attribute from the current video

      // currentVideo.style.filter = 'blur(10px)';
      currentVideo.removeEventListener("waiting", showBuffering);
      currentVideo.removeEventListener("canplaythrough", hideBuffering);
    }

    currentVideo = visibleVideo;
  }

  if (visibleVideo) {
    if (!visibleVideo.src && useUrl(visibleVideo.getAttribute("data-src"))) {
      // Temporarily Disabled
      visibleVideo.src = useUrl(visibleVideo.getAttribute("data-src")); // Re-add src attribute if not present
      visibleVideo.muted = isMuted;

      const playIcon = document.createElement("img");
      playIcon.classList.add("rk-paused");
      playIcon.src = `data:image/svg+xml;base64,${btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`
      )}`;
      // Function to handle abort error during autoplay
      function handleAutoplayError() {
        // Show the play icon or play button on the video player
        visibleCard.appendChild(playIcon);
      }

      // Attempt to autoplay the video
      visibleVideo.play().catch(handleAutoplayError);

      visibleVideo.style.filter = "blur(0)";
      visibleVideo.addEventListener("waiting", showBuffering);
      visibleVideo.addEventListener("canplaythrough", hideBuffering);

      visibleVideo.addEventListener("play", () => {
        if (playIcon) {
          visibleCard.removeChild(playIcon);
        }
      });

      function RePlayReel() {
        visibleVideo.play();
        if (playIcon) {
          visibleCard.removeChild(playIcon);
        }
      }

      visibleVideo.onclick = RePlayReel;
      playIcon.onclick = RePlayReel;

      const productIds = reelsData[reelIndex]?.products?.flatMap((product) => [
        product.id,
        ...product.variants.map((variant) => variant.id),
      ]);
      CollectAnaytics("viewreels", productIds);
    }

    var reelTitle = visibleCard.querySelector(".content>h2").textContent;

    gtag("event", "reel_view", {
      store_link: window?.location?.hostname,
      // 'reel_id': reelId,
      reel_title: reelTitle,
    });

    if (window?.location?.hostname == "maishalifestyle.com") {
      fbq("track", "reel_view", {
        reel_title: reelTitle,
        page: window?.location?.pathname,
      });
    }

    visibleVideo.onerror = function (event) {
      console.error("Video loading error:", event.target.error);
      gtag("event", "reel_load_error", {
        store_link: window?.location?.hostname,
        error: JSON.stringify(event.target.error),
      });
    };

    // gtag('event', 'your_event_name', eventParams);
  }
  // Reset the flag to allow future calls to the function
  isPlaying = false;
}

const FullScreenMode = () => {
  // Get the element you want to display in full-screen mode
  var element = document.getElementById("modal");

  // Enter full-screen mode
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // Internet Explorer and Edge
    element.msRequestFullscreen();
  }
};

function generateSelectOption(option, index = 0) {
  let selectOption = document.createElement("select");
  selectOption.setAttribute("name", "hi");
  selectOption.setAttribute("class", `reelOption-${index}`);
  selectOption.setAttribute("id", `reelOption-${index}`);

  option.forEach((value, indx) => {
    let optionElem = document.createElement("option");
    optionElem.setAttribute("value", JSON.stringify(value));
    if (indx === 0) {
      optionElem.setAttribute("selected", true);
    }
    optionElem.appendChild(document.createTextNode(value.title));
    selectOption.appendChild(optionElem);
  });

  return selectOption.outerHTML;
}

function extractTextFromHTML(htmlCode) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlCode
    .replace(/[\r\n]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const extractedText = tempElement.textContent.trim();

  tempElement.innerHTML = "";
  return extractedText;
}

function toogleCollections() {
  const CollectionsDiv = document.querySelector(".collectionWrapper");
  if (CollectionsDiv) {
    CollectionsDiv.style.display =
      CollectionsDiv.style.display == "none" ? "flex" : "none";
  }
}

function VirtualizeList(prevIndex) {
  setTimeout(() => {
    let visibleCard = document.querySelectorAll(".rk-card")[reelIndex];
    let NonVisibleCard = document.querySelectorAll(".rk-card")[prevIndex];
    let ImageCard = visibleCard.querySelector(".rk-card-Inside");
    let OldReelCard = NonVisibleCard.querySelector(".rk-card-Inside");

    // console.log(visibleCard.querySelector(".rk-card-Inside"));
    if (visibleCard) {
      let src = visibleCard.getAttribute("data_src");
      let thumbnail_src = visibleCard.getAttribute("thumbnail_src");
      let products = JSON.parse(visibleCard.getAttribute("products"));
      const NewReelCardInside = document.createElement("div");
      console.log("VirtualizeList", products);
      NewReelCardInside.classList.add("rk-card-Inside");
      const ReelCard = CreateReelCard(
        NewReelCardInside,
        useUrl(src),
        useUrl(thumbnail_src),
        products
      );
      visibleCard.replaceChild(ReelCard, ImageCard);
      playVisibleVideo();
    }

    if (NonVisibleCard) {
      let thumbnail_src = NonVisibleCard.getAttribute("thumbnail_src");
      const NewReelImgCardInside = document.createElement("div");
      NewReelImgCardInside.classList.add("rk-card-Inside");
      const ReelCard = CreateReelCardImage(NewReelImgCardInside, thumbnail_src);
      NonVisibleCard.replaceChild(ReelCard, OldReelCard);
    }
  }, 310);
}

function CreateReelCard(cardInside, src, thumbnail_src, products) {
  let video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("data-src", src); // Set the data-src attribute with the video source URL
  video.poster = useUrl(thumbnail_src);
  // Apply blur effect to the video poster
  video.style.filter = "blur(10px)";

  console.log(video);

  cardInside.appendChild(video);

  // video.src = video.getAttribute('data-src');

  const utilityWrapper = document.createElement("div");
  utilityWrapper.classList.add("utilityWrapper");

  const muteBtn = document.createElement("div");
  muteBtn.classList.add("Btn");
  muteBtn.classList.add("muteBtn");

  const volumeIcon = document.createElement("img");

  if (isMuted) {
    volumeIcon.src =
      'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none"><path d="M16.0409 4.11855C15.8067 4.01724 15.5499 3.97987 15.2965 4.01027C15.0432 4.04067 14.8024 4.13775 14.5988 4.2916L7.70568 9.74267H2.44208C2.05962 9.74267 1.69282 9.89461 1.42238 10.1651C1.15193 10.4355 1 10.8023 1 11.1848V19.8372C1 20.2197 1.15193 20.5865 1.42238 20.857C1.69282 21.1274 2.05962 21.2793 2.44208 21.2793H7.70568L14.5267 26.7304C14.7805 26.934 15.0955 27.0458 15.4208 27.0477C15.6362 27.0512 15.8492 27.0017 16.0409 26.9035C16.2863 26.7866 16.4937 26.6027 16.6391 26.3731C16.7846 26.1435 16.8621 25.8774 16.8629 25.6056V5.41643C16.8621 5.14461 16.7846 4.87855 16.6391 4.64892C16.4937 4.41929 16.2863 4.23543 16.0409 4.11855ZM13.9787 22.606L9.1045 18.7124C8.85078 18.5089 8.53569 18.3971 8.21041 18.3952H3.88417V12.6268H8.21041C8.53569 12.625 8.85078 12.5131 9.1045 12.3096L13.9787 8.41596V22.606Z" fill="black"/></svg>';
  } else {
    volumeIcon.src =
      "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2231%22%20height%3D%2231%22%20viewBox%3D%220%200%2031%2031%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M15.6239%204.30801C15.3897%204.20669%2015.1329%204.16932%2014.8795%204.19973C14.6262%204.23013%2014.3854%204.32721%2014.1818%204.48106L7.28869%209.93213H2.02509C1.64263%209.93213%201.27583%2010.0841%201.00538%2010.3545C0.734941%2010.6249%200.583008%2010.9917%200.583008%2011.3742V20.0267C0.583008%2020.4092%200.734941%2020.776%201.00538%2021.0464C1.27583%2021.3169%201.64263%2021.4688%202.02509%2021.4688H7.28869L14.1097%2026.9199C14.3635%2027.1234%2014.6786%2027.2352%2015.0038%2027.2371C15.2192%2027.2407%2015.4322%2027.1911%2015.6239%2027.0929C15.8693%2026.976%2016.0767%2026.7922%2016.2221%2026.5625C16.3676%2026.3329%2016.4451%2026.0668%2016.4459%2025.795V5.60588C16.4451%205.33407%2016.3676%205.06801%2016.2221%204.83837C16.0767%204.60874%2015.8693%204.42489%2015.6239%204.30801ZM13.5618%2022.7955L8.68751%2018.9019C8.43379%2018.6983%208.1187%2018.5865%207.79342%2018.5846H3.46717V12.8163H7.79342C8.1187%2012.8144%208.43379%2012.7026%208.68751%2012.499L13.5618%208.60541V22.7955ZM19.532%204.29359C19.3426%204.26707%2019.1499%204.27812%2018.9647%204.3261C18.7796%204.37407%2018.6058%204.45804%2018.4531%204.5732C18.3005%204.68837%2018.172%204.83247%2018.075%204.99728C17.9781%205.1621%2017.9145%205.3444%2017.888%205.53378C17.8615%205.72315%2017.8725%205.9159%2017.9205%206.10101C17.9685%206.28611%2018.0525%206.45996%2018.1676%206.61262C18.4002%206.92092%2018.7457%207.12421%2019.1282%207.17775C21.1705%207.49248%2023.0327%208.52772%2024.378%2010.0962C25.7233%2011.6647%2026.4629%2013.6629%2026.4629%2015.7293C26.4629%2017.7957%2025.7233%2019.7939%2024.378%2021.3624C23.0327%2022.9309%2021.1705%2023.9661%2019.1282%2024.2808C18.7457%2024.3076%2018.3896%2024.4852%2018.1381%2024.7746C17.8865%2025.064%2017.7603%2025.4414%2017.7871%2025.8239C17.8138%2026.2063%2017.9914%2026.5625%2018.2808%2026.814C18.5702%2027.0655%2018.9476%2027.1918%2019.3301%2027.165H19.532C22.2616%2026.7521%2024.7527%2025.374%2026.5528%2023.281C28.353%2021.188%2029.343%2018.5188%2029.343%2015.7581C29.343%2012.9975%2028.353%2010.3283%2026.5528%208.23529C24.7527%206.14228%2022.2616%204.76421%2019.532%204.35127V4.29359ZM18.8686%2018.3971C18.4862%2018.4583%2018.1437%2018.669%2017.9165%2018.9827C17.6893%2019.2964%2017.5961%2019.6875%2017.6573%2020.07C17.7185%2020.4524%2017.9291%2020.7949%2018.2428%2021.0221C18.5565%2021.2493%2018.9476%2021.3425%2019.3301%2021.2813C19.4866%2021.2796%2019.642%2021.2553%2019.7915%2021.2092C20.915%2020.8109%2021.8874%2020.0743%2022.5751%2019.1007C23.2628%2018.1272%2023.6321%2016.9645%2023.6321%2015.7726C23.6321%2014.5806%2023.2628%2013.4179%2022.5751%2012.4444C21.8874%2011.4709%2020.915%2010.7343%2019.7915%2010.3359C19.4282%2010.2135%2019.0311%2010.2405%2018.6877%2010.4109C18.3442%2010.5812%2018.0825%2010.8811%2017.9601%2011.2444C17.8377%2011.6078%2017.8647%2012.0048%2018.0351%2012.3483C18.2054%2012.6918%2018.5053%2012.9535%2018.8686%2013.0759C19.4158%2013.2834%2019.887%2013.6526%2020.2194%2014.1342C20.5519%2014.6159%2020.7299%2015.1873%2020.7299%2015.7726C20.7299%2016.3578%2020.5519%2016.9292%2020.2194%2017.4109C19.887%2017.8926%2019.4158%2018.2617%2018.8686%2018.4693V18.3971Z%22%20fill%3D%22black%22%2F%3E%0A%3C%2Fsvg%3E";
  }

  muteBtn.appendChild(volumeIcon);
  utilityWrapper.appendChild(muteBtn);

  muteBtn.addEventListener("click", () => {
    toggleMute(video);
    muteBtn.classList.toggle("muted");
  });

  const cartBtn = document.createElement("div");
  cartBtn.classList.add("rk-cart-Btn");
  const cartIcon = document.createElement("img");
  cartIcon.setAttribute(
    "src",
    'data:image/svg+xml;charset=utf-8,<svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6875 24.125C11.2796 24.125 10.8808 24.246 10.5416 24.4726C10.2025 24.6992 9.9381 25.0213 9.782 25.3982C9.62589 25.7751 9.58505 26.1898 9.66463 26.5899C9.74421 26.99 9.94065 27.3575 10.2291 27.6459C10.5175 27.9343 10.885 28.1308 11.2851 28.2104C11.6852 28.2899 12.0999 28.2491 12.4768 28.093C12.8537 27.9369 13.1758 27.6725 13.4024 27.3334C13.629 26.9942 13.75 26.5954 13.75 26.1875C13.75 25.6405 13.5327 25.1159 13.1459 24.7291C12.7591 24.3423 12.2345 24.125 11.6875 24.125ZM26.125 20H9.625C9.26033 20 8.91059 19.8551 8.65273 19.5973C8.39487 19.3394 8.25 18.9897 8.25 18.625C8.25 18.2603 8.39487 17.9106 8.65273 17.6527C8.91059 17.3949 9.26033 17.25 9.625 17.25H21.3004C22.1961 17.2471 23.0668 16.954 23.7819 16.4147C24.497 15.8753 25.0181 15.1187 25.267 14.2583L27.447 6.62799C27.5054 6.42335 27.5156 6.20793 27.4767 5.99868C27.4378 5.78944 27.3508 5.59208 27.2227 5.42216C27.0946 5.25223 26.9287 5.11436 26.7382 5.01942C26.5478 4.92447 26.3378 4.87503 26.125 4.875H9.26622C8.98158 4.07387 8.45686 3.37998 7.76356 2.88787C7.07026 2.39576 6.2421 2.12937 5.39191 2.125H4.125C3.76033 2.125 3.41059 2.26987 3.15273 2.52773C2.89487 2.78559 2.75 3.13533 2.75 3.5C2.75 3.86467 2.89487 4.21441 3.15273 4.47227C3.41059 4.73013 3.76033 4.875 4.125 4.875H5.39191C5.6904 4.87604 5.98052 4.97374 6.21883 5.15348C6.45714 5.33321 6.63082 5.58531 6.71386 5.87201L6.9277 6.62103L6.92803 6.62799L9.1839 14.5235C8.13417 14.6364 7.1677 15.1475 6.48349 15.9516C5.79928 16.7557 5.44942 17.7915 5.50595 18.8458C5.56248 19.9001 6.02109 20.8925 6.78736 21.6188C7.55363 22.3451 8.56922 22.75 9.625 22.75H26.125C26.4897 22.75 26.8394 22.6051 27.0973 22.3473C27.3551 22.0894 27.5 21.7397 27.5 21.375C27.5 21.0103 27.3551 20.6606 27.0973 20.4027C26.8394 20.1449 26.4897 20 26.125 20ZM24.3022 7.625L22.623 13.5023C22.5401 13.7893 22.3664 14.0416 22.1279 14.2215C21.8894 14.4013 21.5991 14.4991 21.3004 14.5H12.0373L11.6867 13.2732L10.0738 7.625H24.3022ZM22.6875 24.125C22.2796 24.125 21.8808 24.246 21.5416 24.4726C21.2025 24.6992 20.9381 25.0213 20.782 25.3982C20.6259 25.7751 20.585 26.1898 20.6646 26.5899C20.7442 26.99 20.9406 27.3575 21.2291 27.6459C21.5175 27.9343 21.885 28.1308 22.2851 28.2104C22.6852 28.2899 23.0999 28.2491 23.4768 28.093C23.8537 27.9369 24.1758 27.6725 24.4024 27.3334C24.629 26.9942 24.75 26.5954 24.75 26.1875C24.75 25.6405 24.5327 25.1159 24.1459 24.7291C23.7591 24.3423 23.2345 24.125 22.6875 24.125Z" fill="black"/></svg>'
  );

  cartBtn.appendChild(cartIcon);
  utilityWrapper.appendChild(cartBtn);

  const cartCount = document.createElement("div");
  cartCount.classList.add("Cart-count");
  const cartCountText = document.createElement("p");

  if (cart_count > 0) {
    cartCountText.textContent = cart_count;
    cartCount.style.opacity = 1;
  } else {
    cartCount.style.opacity = 0;
  }

  cartCount.appendChild(cartCountText);
  cartBtn.appendChild(cartCount);

  // OPEN CART PAGE
  cartBtn.addEventListener("click", () => {
    window.location.href = "/cart";
  });

  // const shareBtn = document.createElement('div');
  // shareBtn.classList.add('Btn');
  // const shareIcon = document.createElement('img');
  // shareIcon.src = './Icons/share.svg';
  // shareBtn.appendChild(shareIcon);
  // utilityWrapper.appendChild(shareBtn);

  // SHARE PRODUCT
  // Check if the browser supports the Web Share API
  // if (navigator.share) {
  //   const shareData = {
  //     title: 'Shared content',
  //     text: 'Check out this link!',
  //     url: 'https://example.com'
  //   };

  //   // Use the Web Share API to share the content
  //   navigator.share(shareData)
  //     .then(() => {
  //       console.log('Content shared successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error sharing content:', error);
  //     });
  // } else {
  //   console.log('Web Share API is not supported in this browser.');
  //   // Handle fallback options or display an error message
  // }

  cardInside.appendChild(utilityWrapper);

  const bottomWrapperParent = document.createElement("div");
  bottomWrapperParent.classList.add("bottomWrapperParent");

  const bottomWrapperParentChild = document.createElement("div");
  bottomWrapperParentChild.classList.add("bottomWrapperParentChild");

  bottomWrapperParent.appendChild(bottomWrapperParentChild);

  // MULTISHOP PRODUCTS IN EACH REELS

  products?.forEach(({ images, body_html, title, min_price, variants }) => {
    const bottomWrapper = document.createElement("div");
    bottomWrapper.classList.add("bottomWrapperContainer");

    if (products?.length == 1) {
      bottomWrapper.classList.add("bottomWrapperContainer-fullwidth");
    }

    const bottomWrapperInside = document.createElement("div");
    bottomWrapper.appendChild(bottomWrapperInside);

    bottomWrapperInside.classList.add("bottomWrapper");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("rk-image");

    const image = document.createElement("img");
    image.src = images[0]?.src;
    imageWrapper.appendChild(image);

    bottomWrapperInside.appendChild(imageWrapper);

    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("content");
    const titleElem = document.createElement("h2");
    titleElem.textContent = title;
    contentWrapper.appendChild(titleElem);
    const description = document.createElement("h3");
    description.innerHTML = extractTextFromHTML(body_html);
    contentWrapper.appendChild(description);
    const price = document.createElement("p");
    // price.textContent = 'Price';
    contentWrapper.appendChild(price);
    const priceValue = document.createElement("h1");
    var tempPrice = Math.trunc(variants[0]?.price || min_price);
    priceValue.textContent = "Rs " + tempPrice;
    contentWrapper.appendChild(priceValue);
    bottomWrapperInside.appendChild(contentWrapper);

    const shopNowBtn = document.createElement("div");
    shopNowBtn.classList.add("rk-button");
    shopNowBtn.setAttribute("id", "shop-now-btn");
    shopNowBtn.textContent = "Shop now";
    bottomWrapperInside.appendChild(shopNowBtn);

    bottomWrapperParentChild.appendChild(bottomWrapper);

    cardInside.appendChild(bottomWrapperParent);

    // SLIDER POPUP

    const DetailSliderContainerParent = document.createElement("div");
    // card.appendChild(DetailSliderContainerParent)

    const DetailSliderContainer = document.createElement("div");
    DetailSliderContainerParent.appendChild(DetailSliderContainer);

    DetailSliderContainerParent.classList.add("rk-card-slider-container");
    DetailSliderContainer.classList.add("rk-card-slider-child");

    const hideSliderBtn = document.createElement("div");
    hideSliderBtn.classList.add("Btn");
    hideSliderBtn.classList.add("Slider-Btn");
    const hideSliderBtnIcon = document.createElement("img");
    hideSliderBtnIcon.src =
      "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%3Crect%20width%3D%2228%22%20height%3D%2228%22%20fill%3D%22url(%23pattern0)%22%2F%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cpattern%20id%3D%22pattern0%22%20patternContentUnits%3D%22objectBoundingBox%22%20width%3D%221%22%20height%3D%221%22%3E%0A%20%20%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23image0_7_2454%22%20transform%3D%22scale(0.0111111)%22%2F%3E%0A%20%20%20%20%3C%2Fpattern%3E%0A%20%20%20%20%3Cimage%20id%3D%22image0_7_2454%22%20width%3D%2290%22%20height%3D%2290%22%20xlink%3Ahref%3D%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7UlEQVR4nO2cQU7DMBBFZzXh5DTnYRHlQlBuMVVRkFBVBG3i8f%2Fj%2FyRvWKDnp9ZtqRkzIYQQQgghhBBCCHGPycxmMztva95%2BxgKFv5vZm5nFzVrN7MXwofD%2FTRJSltX%2FL0koWVb%2F%2F0oGgiyr%2F6OSARabwv%2F6Srw8IRnbWjq%2FmtP4zzsko3PsvZG%2F1ylD9nyAaHQ4Rp49Lu6tT6bQkRj7yMjX9Z7g%2FPW0OUo4Eo6Ro46Ln%2Bu1oW9T8aVRbCbXlKdiNDhGGBzpN%2BLAbmU25IBOh4C0MQdyaQLCBh3AIYWeG%2FVRIvfcsI8WucfGfdTImQF89MgZIVyRcz4CLw1%2BJ9w33o%2FiDR59wx8XbLFXxjOZLfZaMTJa7NKRUWIPEbl37KEi94o9ZOTs2ENHzoqtyAmxFfkGhU7AdXTwRw4dIaa3dxm4PrDUjRwjHSOuPyqNEzkqP7IdLHLJ2A4auVRsfTmbgK4bJKALNAnoSlgCuuSYgK7tJoBwF84BHJqCtEEHcjkUxI05oNMukDfkwG7lNuIEjmX%2B7Xcicm0yryMSxVvEpprXEcRjJKjmdazEg1Fo5nUs5KN%2BKOZ1LBpeVWycWRV%2FigF9VfwpRk5W8acYolrFn2IscBX%2FaXvr97GtE9m%2F%2FU7k%2FkIIIYQQQgghhBCWxQVCVmav1FT2GAAAAABJRU5ErkJggg%3D%3D%22%2F%3E%0A%20%20%3C%2Fdefs%3E%0A%3C%2Fsvg%3E";

    hideSliderBtn.appendChild(hideSliderBtnIcon);

    DetailSliderContainer.appendChild(hideSliderBtn);

    // Title
    const SectionTitle = document.createElement("div");
    SectionTitle.classList.add("rk-Slider-Heading");
    SectionTitle.textContent = title;
    DetailSliderContainer.appendChild(SectionTitle);

    const producImageWrapper = document.createElement("div");
    producImageWrapper.classList.add("sliderproductImageWrapper");

    images.forEach(({ src }) => {
      const producImage = document.createElement("img");
      producImage.src = src;
      producImage.classList.add("sliderproductImage");
      producImageWrapper.appendChild(producImage);
    });

    DetailSliderContainer.appendChild(producImageWrapper);

    // Variant
    const variantTitle = document.createElement("div");
    variantTitle.classList.add("rk-Slider-Heading");
    variantTitle.textContent = "Variants";

    // SIZING
    const SizeChartOpenBtn = document.createElement("p");
    SizeChartOpenBtn.classList.add("rk-size-chart-heading");
    SizeChartOpenBtn.textContent = "Size Chart";

    // Sizing Modal
    const SizeModal = document.createElement("div");
    SizeModal.classList.add("rk-size-modal");

    const hideModalBtn = document.createElement("div");
    hideModalBtn.classList.add("Btn");
    hideModalBtn.classList.add("Slider-Btn");
    const hideModalBtnIcon = document.createElement("img");
    hideModalBtnIcon.src =
      "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%3Crect%20width%3D%2228%22%20height%3D%2228%22%20fill%3D%22url(%23pattern0)%22%2F%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cpattern%20id%3D%22pattern0%22%20patternContentUnits%3D%22objectBoundingBox%22%20width%3D%221%22%20height%3D%221%22%3E%0A%20%20%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23image0_7_2454%22%20transform%3D%22scale(0.0111111)%22%2F%3E%0A%20%20%20%20%3C%2Fpattern%3E%0A%20%20%20%20%3Cimage%20id%3D%22image0_7_2454%22%20width%3D%2290%22%20height%3D%2290%22%20xlink%3Ahref%3D%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7UlEQVR4nO2cQU7DMBBFZzXh5DTnYRHlQlBuMVVRkFBVBG3i8f%2Fj%2FyRvWKDnp9ZtqRkzIYQQQgghhBBCCHGPycxmMztva95%2BxgKFv5vZm5nFzVrN7MXwofD%2FTRJSltX%2FL0koWVb%2F%2F0oGgiyr%2F6OSARabwv%2F6Srw8IRnbWjq%2FmtP4zzsko3PsvZG%2F1ylD9nyAaHQ4Rp49Lu6tT6bQkRj7yMjX9Z7g%2FPW0OUo4Eo6Ro46Ln%2Bu1oW9T8aVRbCbXlKdiNDhGGBzpN%2BLAbmU25IBOh4C0MQdyaQLCBh3AIYWeG%2FVRIvfcsI8WucfGfdTImQF89MgZIVyRcz4CLw1%2BJ9w33o%2FiDR59wx8XbLFXxjOZLfZaMTJa7NKRUWIPEbl37KEi94o9ZOTs2ENHzoqtyAmxFfkGhU7AdXTwRw4dIaa3dxm4PrDUjRwjHSOuPyqNEzkqP7IdLHLJ2A4auVRsfTmbgK4bJKALNAnoSlgCuuSYgK7tJoBwF84BHJqCtEEHcjkUxI05oNMukDfkwG7lNuIEjmX%2B7Xcicm0yryMSxVvEpprXEcRjJKjmdazEg1Fo5nUs5KN%2BKOZ1LBpeVWycWRV%2FigF9VfwpRk5W8acYolrFn2IscBX%2FaXvr97GtE9m%2F%2FU7k%2FkIIIYQQQgghhBCWxQVCVmav1FT2GAAAAABJRU5ErkJggg%3D%3D%22%2F%3E%0A%20%20%3C%2Fdefs%3E%0A%3C%2Fsvg%3E";
    hideModalBtn.appendChild(hideModalBtnIcon);

    const SizeChartImg = document.createElement("img");
    SizeChartImg.classList.add("rk-size-chart-img");

    let titletoSearch = title || "";
    titletoSearch = titletoSearch.toLowerCase();
    titletoSearch = titletoSearch.split(" ");

    //! HARDCODED FOR MIDNIGHTANGLES SIZECHART
    // * if required take it from hardcoded file

    SizeModal.appendChild(hideModalBtn);
    SizeModal.appendChild(SizeChartImg);

    //Open Size Modal
    SizeChartOpenBtn.onclick = function () {
      DetailSliderContainer.appendChild(SizeModal);
    };

    //Close Size Modal
    hideModalBtn.onclick = function () {
      DetailSliderContainer.removeChild(SizeModal);
    };

    // Options
    const selectElement = document.createElement("select");
    selectElement.classList.add("optionSelector");

    if (variants[0].title != "Default Title") {
      DetailSliderContainer.appendChild(variantTitle);

      if (domain == "midnightangelsbypc.com") {
        variantTitle.appendChild(SizeChartOpenBtn);
      }

      DetailSliderContainer.appendChild(selectElement);
    }

    const options = variants;
    selectElement.innerHTML += generateSelectOption(options);

    selectElement.addEventListener("change", function () {
      const selectedValue = JSON.parse(this.value || "");
      Price.textContent = "Rs " + selectedValue?.price;
      console.log(`Selected option value:`, selectedValue);
    });

    // Description Header
    const DescriptionTitle = document.createElement("div");
    DescriptionTitle.classList.add("rk-Slider-Heading");

    const DescriptionContainer = document.createElement("div");
    const Description = document.createElement("div");
    const SeeMoreButton = document.createElement("p");

    DescriptionTitle.textContent = "Description";
    DescriptionContainer.classList.add("description-container");
    DescriptionContainer.appendChild(Description);
    DescriptionContainer.appendChild(SeeMoreButton);
    DetailSliderContainer.appendChild(DescriptionTitle);
    DetailSliderContainer.appendChild(DescriptionContainer);

    Description.innerHTML = body_html;
    Description.classList.add("description-content");
    SeeMoreButton.textContent = "See More";

    // Click event handler for "See More" button
    DescriptionContainer.addEventListener("click", () => {
      Description.classList.toggle("expanded");
      SeeMoreButton.textContent = Description.classList.contains("expanded")
        ? "See Less"
        : "See More";
    });

    const BottomButtonsWrapper = document.createElement("div");
    BottomButtonsWrapper.classList.add("bottomButtonsWrapper");
    DetailSliderContainerParent.appendChild(BottomButtonsWrapper);

    const PriceDiv = document.createElement("div");
    const PriceHeading = document.createElement("h2");
    const Price = document.createElement("h3");
    PriceHeading.textContent = "Price";
    Price.textContent = "Rs " + variants[0]?.price;

    PriceDiv.appendChild(PriceHeading);
    PriceDiv.appendChild(Price);
    BottomButtonsWrapper.appendChild(PriceDiv);

    // QUANTITY BUTTON
    const quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantityContainer");
    const quantityInput = document.createElement("input");
    // MINUS BUTTON
    const minusButton = document.createElement("button");
    minusButton.textContent = "-";

    quantityContainer.appendChild(minusButton);
    quantityInput.type = "number";
    quantityInput.value = 1;
    quantityInput.min = 1;
    quantityContainer.appendChild(quantityInput);
    // PLUS BUTTON
    const plusButton = document.createElement("button");
    plusButton.textContent = "+";

    quantityContainer.appendChild(plusButton);

    const AddToCartWrapper = document.createElement("div");
    AddToCartWrapper.classList.add("addtocartwrapper");
    // ADD TO CART BUTTON
    const AddtocartBtn = document.createElement("button");
    AddtocartBtn.textContent = "Add To Cart";
    AddtocartBtn.classList.add("rk-button");
    AddtocartBtn.classList.add("addtocart");

    AddToCartWrapper.appendChild(AddtocartBtn);

    BottomButtonsWrapper.appendChild(AddToCartWrapper);
    // BottomButtonsWrapper.appendChild(quantityContainer)

    // VIEW CART BUTTON
    const BuyNowBtn = document.createElement("button");
    BuyNowBtn.textContent = "Buy Now";
    BuyNowBtn.classList.add("rk-button");
    // BuyNowBtn.classList.add("view-cart")
    BottomButtonsWrapper.appendChild(BuyNowBtn);

    // OPEN CART PAGE
    BuyNowBtn.addEventListener("click", () => {
      BuyNow();
    });

    const closeSlider = () => {
      console.log(initialOffset, currentOffset);
      DetailSliderContainerParent.classList.add("slide-down");
      DetailSliderContainerParent.classList.remove("slide-up");
      setTimeout(() => {
        cardInside.removeChild(DetailSliderContainerParent);
        currentVideo.play();
        toogleCollections();
      }, 200); // Wait for the slide-down animation to complete (500 milliseconds)
    };

    const BuyNow = (qty = 1) => {
      BuyNowBtn.textContent = "Loading...";
      BuyNowBtn.disabled = true;
      BuyNowBtn.style.opacity = 0.5;

      quantityInput.value = qty;
      let variant = JSON.parse(selectElement?.value);
      console.log(variant);
      let formData = {
        items: [
          {
            id: variant?.id,
            quantity: quantityInput?.value,
          },
        ],
        customAttributes: { reelkart: true },
        tags: "reelkart",
      };
      console.log(formData);

      gtag("event", "addtocart_click", {
        store_link: window?.location?.hostname,
      });

      if (window?.location?.hostname == "maishalifestyle.com") {
        fbq("track", "rk_add_to_cart_click");
      }

      CollectAnaytics("addtocart");

      // window?.Shopify?.routes?.root
      fetch(window?.Shopify?.routes?.root + "cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          cartId = data?.items[0]?.id;
          console.log(cartId, "CART.JS");

          Cart_Set_Reelkart_Attribute(data, true);
        })
        .catch((error) => {
          console.error("Error:", error);
          BuyNowBtn.textContent = "Buy Now";
          BuyNowBtn.disabled = false;
          BuyNowBtn.style.opacity = 1;
        });
    };

    const AddToCart = (qty = 1) => {
      AddtocartBtn.textContent = "Adding...";
      AddtocartBtn.disabled = true;
      AddtocartBtn.style.opacity = 0.5;

      quantityInput.value = qty;
      let variant = JSON.parse(selectElement?.value);
      console.log(variant);

      let formData = {
        items: [
          {
            id: variant?.id,
            quantity: quantityInput?.value,
          },
        ],
        customAttributes: { reelkart: true },
        tags: "reelkart",
      };
      console.log(formData);

      gtag("event", "addtocart_click", {
        store_link: window?.location?.hostname,
      });

      CollectAnaytics("addtocart");

      // window?.Shopify?.routes?.root
      fetch(window?.Shopify?.routes?.root + "cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          AddtocartBtn.textContent = "Add To Cart";
          AddtocartBtn.disabled = false;
          AddtocartBtn.style.opacity = 1;
          AddToCartWrapper.replaceChild(quantityContainer, AddtocartBtn);

          cartId = data?.items[0]?.id;
          Cart_Set_Reelkart_Attribute(cartId);

          closeSlider();
        })
        .catch((error) => {
          console.error("Error:", error);
          AddtocartBtn.textContent = "Add To Cart";
          AddtocartBtn.disabled = false;
          AddtocartBtn.style.opacity = 1;
        });
    };

    const ChangeCart = (qty = 0) => {
      quantityInput.value = qty;
      let variant = JSON.parse(selectElement?.value);
      console.log(variant);
      let formData = {
        id: JSON.stringify(variant?.id || "0"),
        quantity: quantityInput?.value,
        customAttributes: { reelkart: true },
        tags: "reelkart",
      };
      console.log(formData);

      // window?.Shopify?.routes?.root
      fetch(window?.Shopify?.routes?.root + "cart/change.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          cartId = data?.items[0]?.id;
          Cart_Set_Reelkart_Attribute(cartId);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    AddtocartBtn.addEventListener("click", () => {
      AddToCart();
    });

    minusButton.addEventListener("click", function () {
      if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        ChangeCart(quantityInput.value);
      } else {
        AddToCartWrapper.replaceChild(AddtocartBtn, quantityContainer);
        quantityInput.value = 0;
        ChangeCart(0);
      }
    });

    plusButton.addEventListener("click", function () {
      quantityInput.value = parseInt(quantityInput.value) + 1;
      ChangeCart(quantityInput.value);
    });

    bottomWrapper.addEventListener("click", () => {
      currentVideo.pause();
      // bottomWrapper.classList.add("bottomWrapperContainer-expand")
      // cardList.style.overflow = "hidden"
      // bottomWrapper.removeChild(bottomWrapperInside)
      cardInside.appendChild(DetailSliderContainerParent);
      DetailSliderContainerParent.classList.remove("slide-down");
      toogleCollections();

      DetailSliderContainerParent.classList.add("slide-up");

      console.log(currentVideo);
    });

    hideSliderBtn.addEventListener("click", () => {
      closeSlider();
    });

    // TO PREVENT VERTICAL SWIPE IF USER SCROLLING HORIZONTAL ON MUTI PRODUCT LIST
    bottomWrapper.addEventListener(
      "touchstart",
      () => (horizontalScrolling = true),
      { passive: true }
    );
    bottomWrapper.addEventListener(
      "touchend",
      () => (horizontalScrolling = false),
      { passive: true }
    );
  });

  return cardInside;
}

function CreateReelCardImage(cardInside, thumbnail_src) {
  const cardInsidePoster = document.createElement("img");
  cardInsidePoster.style.width = "inherit";
  cardInsidePoster.style.height = "inherit";

  cardInsidePoster.src = useUrl(thumbnail_src);
  cardInsidePoster.style.filter = "blur(10px)";
  cardInside.appendChild(cardInsidePoster);
  return cardInside;
}

function RenderReels(data = []) {
  reelIndex = 0;
  currentOffset = 0;

  const cardList = document.querySelector("#rk-reels-wrapper");

  if (data.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No Reels found.";
    cardList.appendChild(message);
  } else {
    // const viewportHeight = productswindow.innerHeight;
    data.forEach(({ src, thumbnail_src, products }, index) => {
      const card = document.createElement("div");
      card.classList.add("rk-card");

      card.setAttribute("data_src", src);
      card.setAttribute("thumbnail_src", useUrl(thumbnail_src));
      card.setAttribute("products", JSON.stringify(products));

      const cardInside = document.createElement("div");
      cardInside.classList.add("rk-card-Inside");
      card.appendChild(cardInside);

      if (reelIndex == index) {
        CreateReelCard(cardInside, src, thumbnail_src, products);
      } else {
        CreateReelCardImage(cardInside, thumbnail_src);
      }

      cardList.appendChild(card);
    });

    playVisibleVideo();
    FetchCart();
  }

  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  const isSliderOpen = () => {
    return document.querySelector(".rk-card-slider-container") != undefined;
  };

  initialTouchY = null;
  initialOffset = 0;
  swipeDirection = null;
  currentOffset = 0;
  cardList.style.transform = `translate3d(0px, ${currentOffset}px, 0px)`;

  const swiperContainer = document.querySelector("#modal-Inside");
  const swiperList = document.querySelector("#rk-reels-wrapper");

  var itemHeight = swiperList.querySelectorAll(".rk-card")[0].offsetHeight;
  const totalSlides = swiperList.querySelectorAll(".rk-card").length;
  const containerHeight = swiperContainer.offsetHeight;
  var maxOffset = (totalSlides - 1) * itemHeight;

  const swipeSensitivity = 0.5;
  const snapThreshold = itemHeight / 2;

  swiperContainer.addEventListener("touchstart", handleTouchStart, {
    passive: true,
  });
  swiperContainer.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });
  swiperContainer.addEventListener("touchend", handleTouchEnd, {
    passive: true,
  });
  swiperContainer.addEventListener("touchcancel", handleTouchEnd, {
    passive: true,
  });
  swiperContainer.addEventListener("touchleave", handleTouchEnd, {
    passive: true,
  });
  // swiperContainer.addEventListener('wheel', handleWheelScroll, { passive: false });

  let cardHeight = 0;
  const cards = document.querySelectorAll(".rk-card");
  const handleResize = () => {
    if (window.innerWidth <= 2000) {
      cards.forEach((card, index) => {
        if (index == 0) {
          const cardOffsetTop = card.offsetTop;
          cardHeight = window.innerHeight - cardOffsetTop;
          itemHeight = cardHeight;
          maxOffset = (totalSlides - 1) * itemHeight;
          // Adjust currentOffset based on the height difference

          // swiperList.style.transform = `translate3d(0px, ${cardHeight}px, 0px)`;
        }
        card.style.height = `${cardHeight}px`;
      });
    } else {
      cards.forEach((card) => {
        card.style.height = ""; // Reset card height if window width is larger than 500
      });
    }

    currentOffset = reelIndex * (-1 * cardHeight);
    swiperList.style.transform = `translate3d(0px, ${currentOffset}px, 0px)`;
    itemHeight = cardHeight;
  };
  window.addEventListener("resize", handleResize);
  // Initial height update
  handleResize();

  // OLD

  // function handleTouchStart(event) {
  //     if (isSliderOpen() || horizontalScrolling) return;

  //     initialTouchY = event.touches[0].clientY;

  //     if (typeof currentOffset === 'number' && !isNaN(currentOffset) && currentOffset !== undefined) {
  //         initialOffset = currentOffset;
  //     }

  //     swiperList.style.transition = `transform 0ms ease 0s`;
  // }

  // function handleTouchMove(event) {
  // if (initialTouchY === null || isSliderOpen() || horizontalScrolling) {
  //     return;
  // }

  //     const currentTouchY = event.touches[0].clientY;
  //     const diff = currentTouchY - initialTouchY;

  //     currentOffset = initialOffset + diff * swipeSensitivity;

  //     if (diff > 0) {
  //         currentOffset = Math.min(currentOffset, snapThreshold);
  //         swipeDirection = 'up';
  //     } else {
  //         currentOffset = Math.max(currentOffset, -maxOffset - snapThreshold);
  //         swipeDirection = 'down';
  //     }

  //     swiperList.style.transform = `translate3d(0px, ${currentOffset}px, 0px)`;
  //     event.preventDefault();
  // }

  // function handleTouchEnd() {
  //     if (isSliderOpen() || horizontalScrolling) return;

  //     initialTouchY = null;

  //     const snappedOffset = Math.round(currentOffset / itemHeight) * itemHeight;

  //     // Determine the target offset based on swipe direction
  //     let targetOffset;
  //     if (swipeDirection === 'up') {
  //         targetOffset = Math.ceil(currentOffset / itemHeight) * itemHeight;
  //     } else if (swipeDirection === 'down') {
  //         targetOffset = Math.floor(currentOffset / itemHeight) * itemHeight;
  //     }

  //     // Check if the target offset exceeds the boundary
  //     if (targetOffset > 0) {
  //         targetOffset = 0;
  //     } else if (targetOffset < -maxOffset) {
  //         targetOffset = -maxOffset;
  //     }

  //     // Apply the target offset to the swiper list
  //     swiperList.style.transform = `translate3d(0px, ${targetOffset}px, 0px)`;
  //     currentOffset = targetOffset;

  //     // Reset the swipe direction
  //     swipeDirection = null;
  //     swiperList.style.transition = `transform 300ms ease 0s`;

  //     // Add an event listener to detect the end of the transition
  //     swiperList.addEventListener('transitionend', handleTransitionEnd);

  //     function handleTransitionEnd() {
  //         // Remove the event listener
  //         swiperList.removeEventListener('transitionend', handleTransitionEnd);

  //         // Call playVisibleVideo when the transition is complete
  //         debounce(playVisibleVideo(), 100)
  //     }

  // }

  // function handleWheelScroll(event) {
  //     const deltaY = event.deltaY;
  //     const deltaX = event.deltaX;

  //     if (Math.abs(deltaY) > Math.abs(deltaX)) {
  //         event.preventDefault();

  //         if (deltaY > 0) {
  //             swipeDown();
  //         } else {
  //             swipeUp();
  //         }
  //     }
  // }

  // NEW

  function handleTouchStart(event) {
    if (isSliderOpen() || horizontalScrolling) return;

    initialTouchY = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (initialTouchY === null || isSliderOpen() || horizontalScrolling) {
      return;
    }

    var currentTouchY = event.touches[0].clientY;
    var diff = currentTouchY - initialTouchY;

    if (diff > 0) {
      swipeDirection = "up";
    } else {
      swipeDirection = "down";
    }

    event.preventDefault();
  }

  function handleTouchEnd() {
    if (isSliderOpen() || horizontalScrolling) return;

    if (swipeDirection === "up") {
      swipeUp();
    } else if (swipeDirection === "down") {
      swipeDown();
    }

    // Reset swipe direction
    swipeDirection = null;
  }

  function handleWheelScroll(event) {
    const deltaY = event.deltaY;
    const deltaX = event.deltaX;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      event.preventDefault();

      if (deltaY > 0) {
        swipeDown();
      } else {
        swipeUp();
      }
    }
  }

  // Swipe On Button Click
  const scrollUpBtn = document.getElementsByClassName("rk-Scroll-Up-Btn")[0];
  const scrollDownBtn =
    document.getElementsByClassName("rk-Scroll-Down-Btn")[0];
  scrollUpBtn.onclick = swipeUp;
  scrollDownBtn.onclick = swipeDown;

  function swipeUp() {
    if (currentOffset === null) {
      currentOffset = 0;
    } else {
      const newOffset = Math.min(currentOffset + itemHeight, 0);
      if (newOffset !== currentOffset) {
        currentOffset = newOffset;
        reelIndex -= 1;
      }
    }
    VirtualizeList(reelIndex + 1);
    swiperList.style.transform = `translate3d(0px, ${currentOffset}px, 0px)`;
  }

  function swipeDown() {
    if (currentOffset === null) {
      currentOffset = -maxOffset;
    } else {
      const newOffset = Math.max(currentOffset - itemHeight, -maxOffset);
      if (newOffset !== currentOffset) {
        console.log(currentOffset, newOffset, itemHeight);
        currentOffset = newOffset;
        reelIndex += 1;
      }
    }
    VirtualizeList(reelIndex - 1);
    swiperList.style.transform = `translate3d(0px, ${currentOffset}px, 0px)`;
  }
}

// Function to pause all videos on the page
function pauseAllVideos() {
  if (currentVideo) {
    currentVideo.pause();
  }
  videoElement.muted = true;
}

function ReRenderReels(data) {
  LoaderModal(false);
  RenderReels(data);

  // playVisibleVideo()
}

// REELS MODAL VIEW - (START)

const showReelsModal = (reelsData = [], collectionsData = [], domain) => {
  const modal = document.createElement("div");

  // create modal container
  modal.setAttribute("id", "modal");
  // add modal to the DOM
  document.body.appendChild(modal);
  // Temporary
  modal.style.display = "none";

  // create modal inside
  const modalInside = document.createElement("div");
  modalInside.setAttribute("id", "modal-Inside");
  const reelsWrapper = document.createElement("div");
  reelsWrapper.setAttribute("id", "rk-reels-wrapper");
  modalInside.appendChild(reelsWrapper);

  modal.appendChild(modalInside);

  // create close button
  const closeButton = document.createElement("div");
  closeButton.classList.add("closeBtn", "Btn");
  const closeButtonImg = document.createElement("img");
  closeButtonImg.src =
    "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%3Crect%20width%3D%2228%22%20height%3D%2228%22%20fill%3D%22url(%23pattern0)%22%2F%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cpattern%20id%3D%22pattern0%22%20patternContentUnits%3D%22objectBoundingBox%22%20width%3D%221%22%20height%3D%221%22%3E%0A%20%20%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23image0_7_2454%22%20transform%3D%22scale(0.0111111)%22%2F%3E%0A%20%20%20%20%3C%2Fpattern%3E%0A%20%20%20%20%3Cimage%20id%3D%22image0_7_2454%22%20width%3D%2290%22%20height%3D%2290%22%20xlink%3Ahref%3D%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7UlEQVR4nO2cQU7DMBBFZzXh5DTnYRHlQlBuMVVRkFBVBG3i8f%2Fj%2FyRvWKDnp9ZtqRkzIYQQQgghhBBCCHGPycxmMztva95%2BxgKFv5vZm5nFzVrN7MXwofD%2FTRJSltX%2FL0koWVb%2F%2F0oGgiyr%2F6OSARabwv%2F6Srw8IRnbWjq%2FmtP4zzsko3PsvZG%2F1ylD9nyAaHQ4Rp49Lu6tT6bQkRj7yMjX9Z7g%2FPW0OUo4Eo6Ro46Ln%2Bu1oW9T8aVRbCbXlKdiNDhGGBzpN%2BLAbmU25IBOh4C0MQdyaQLCBh3AIYWeG%2FVRIvfcsI8WucfGfdTImQF89MgZIVyRcz4CLw1%2BJ9w33o%2FiDR59wx8XbLFXxjOZLfZaMTJa7NKRUWIPEbl37KEi94o9ZOTs2ENHzoqtyAmxFfkGhU7AdXTwRw4dIaa3dxm4PrDUjRwjHSOuPyqNEzkqP7IdLHLJ2A4auVRsfTmbgK4bJKALNAnoSlgCuuSYgK7tJoBwF84BHJqCtEEHcjkUxI05oNMukDfkwG7lNuIEjmX%2B7Xcicm0yryMSxVvEpprXEcRjJKjmdazEg1Fo5nUs5KN%2BKOZ1LBpeVWycWRV%2FigF9VfwpRk5W8acYolrFn2IscBX%2FaXvr97GtE9m%2F%2FU7k%2FkIIIYQQQgghhBCWxQVCVmav1FT2GAAAAABJRU5ErkJggg%3D%3D%22%2F%3E%0A%20%20%3C%2Fdefs%3E%0A%3C%2Fsvg%3E";
  closeButton.appendChild(closeButtonImg);

  // Create Up Down Reel Scroll Button for Desktop
  const UpButton = document.createElement("div");
  const DownButton = document.createElement("div");
  UpButton.classList.add("rk-ScrollBtn", "rk-Scroll-Up-Btn");
  DownButton.classList.add("rk-ScrollBtn", "rk-Scroll-Down-Btn");

  const ScrollButtonUImg = document.createElement("img");
  const ScrollButtonDImg = document.createElement("img");

  ScrollButtonUImg.src =
    "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%3E%3C%21--%21%20Font%20Awesome%20Pro%206.4.0%20by%20%40fontawesome%20-%20https%3A%2F%2Ffontawesome.com%20License%20-%20https%3A%2F%2Ffontawesome.com%2Flicense%20%28Commercial%20License%29%20Copyright%202023%20Fonticons%2C%20Inc.%20--%3E%3Cpath%20d%3D%22M233.4%20105.4c12.5-12.5%2032.8-12.5%2045.3%200l192%20192c12.5%2012.5%2012.5%2032.8%200%2045.3s-32.8%2012.5-45.3%200L256%20173.3%2086.6%20342.6c-12.5%2012.5-32.8%2012.5-45.3%200s-12.5-32.8%200-45.3l192-192z%22%2F%3E%3C%2Fsvg%3E";
  ScrollButtonDImg.src =
    "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%3E%3C%21--%21%20Font%20Awesome%20Pro%206.4.0%20by%20%40fontawesome%20-%20https%3A%2F%2Ffontawesome.com%20License%20-%20https%3A%2F%2Ffontawesome.com%2Flicense%20%28Commercial%20License%29%20Copyright%202023%20Fonticons%2C%20Inc.%20--%3E%3Cpath%20d%3D%22M233.4%20105.4c12.5-12.5%2032.8-12.5%2045.3%200l192%20192c12.5%2012.5%2012.5%2032.8%200%2045.3s-32.8%2012.5-45.3%200L256%20173.3%2086.6%20342.6c-12.5%2012.5-32.8%2012.5-45.3%200s-12.5-32.8%200-45.3l192-192z%22%2F%3E%3C%2Fsvg%3E";

  UpButton.appendChild(ScrollButtonUImg);
  DownButton.appendChild(ScrollButtonDImg);

  modalInside.appendChild(UpButton);
  modalInside.appendChild(DownButton);

  modalInside.appendChild(closeButton);

  // CREATE TOP WATERMART
  const ReelkartWatermark = document.createElement("h1");
  ReelkartWatermark.classList.add("watermark");
  ReelkartWatermark.textContent = "Reelkart";

  modalInside.appendChild(ReelkartWatermark);

  // create Collection Higligter
  const CollectionWrapper = document.createElement("div");
  CollectionWrapper.classList.add("collectionWrapper");
  // modalInside.appendChild(CollectionWrapper);

  // Create a list of items with images and headings
  collectionsData.forEach(({ id, title, src }) => {
    const collectionItem = document.createElement("div");
    collectionItem.classList.add("collectionItem");
    collectionItem.setAttribute("data-id", id);

    const image = document.createElement("img");
    image.src = src;
    collectionItem.appendChild(image);

    const heading = document.createElement("h3");
    heading.textContent = title;
    collectionItem.appendChild(heading);

    CollectionWrapper.appendChild(collectionItem);
  });

  // TO PREVENT VERTICAL SWIPE IF USER SCROLLING HORIZONTAL ON COLLECTIONS PRODUCT LIST
  CollectionWrapper.addEventListener(
    "touchstart",
    () => (horizontalScrolling = true),
    { passive: true }
  );
  CollectionWrapper.addEventListener(
    "touchend",
    () => (horizontalScrolling = false),
    { passive: true }
  );

  function HiglightCollection(rktcollectionid) {
    const collectionItems = document.querySelectorAll(".collectionItem");

    collectionItems.forEach((collectionItem) => {
      const image = collectionItem.querySelector("img");
      const id = collectionItem.getAttribute("data-id");

      if (rktcollectionid === id) {
        image.classList.add("collection-Active");
      } else {
        image.classList.remove("collection-Active");
      }
    });
  }

  CollectionWrapper.addEventListener("click", (event) => {
    const collectionItem = event.target.closest(".collectionItem");

    if (collectionItem) {
      const id = collectionItem.getAttribute("data-id");

      HiglightCollection(id);
      AddParamsInURL("rktcollectionid", id);
      LoaderModal();

      fetch(
        `${REELKART_DOMAIN}/reels/bycollection/${domain}?collectionId=${id}&page=1&limit=15`
      )
        .then((response) => response.text())
        .then((result) => {
          result = JSON.parse(result)?.data?.reels;
          console.log("fwfasfasfwqrrfasfasf", result);
          // COMBINING NEW RESULT  WITH EXISTING ENSURE ENOUGH CONTENT IS ALWAYS THEIR TO SEE BY USER
          reelsData = [
            ...new Map(
              [...result, ...reelsData].map((item) => [item.id, item])
            ).values(),
          ];

          const cardList = document.querySelector("#rk-reels-wrapper");
          cardList.style.transition = "none";
          cardList.style.transform = `translate3d(0px, 0px, 0px)`;
          // Delay the transition reset to allow the initial transform to take effect
          setTimeout(() => {
            cardList.style.transition = "";
          }, 0);

          ReRenderReels(reelsData);
        });
    }
  });

  HiglightCollection(getParamsValue("rktcollectionid"));

  // Add a click event listener to the button
  closeButton.addEventListener("click", () => {
    // RESET OFFSET Y OF SWIPER
    const cardList = document.querySelector("#rk-reels-wrapper");
    cardList.style.transform = `translate3d(0px, 0px, 0px)`;

    LoaderModal(true);
    modal.style.display = modal.style.display === "none" ? "block" : "none";
    videoElement.play();
    pauseAllVideos();
    document.body.style.overflow = "auto"; // Prevent body from scrolling
    // closeWidget()
  });

  const cardList = document.querySelector("#modal-Inside");

  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  const scrollableDiv = document.getElementById("modal-Inside");

  // scrollableDiv.addEventListener('scroll', debounce(playVisibleVideo, 100));
  // window.addEventListener('load', playVisibleVideo);

  const muteBtns = document.querySelectorAll(".mute-btn");
  muteBtns.forEach((btn) => btn.addEventListener("click", toggleMute));

  OpenReelsIdinReels(domain);
};

// REELS MODAL VIEW - (END)

const text_box_html = () => {
  const textbox = document.createElement("div");
  textbox.classList = "rk-textbox";
  textbox.id = "rk-textbox";
  textbox.addEventListener("click", () => {
    LoaderModal();
    setTimeout(() => {
      LoaderModal(false);
      RenderReels(reelsData);
    }, 300);

    // videoElement.play()
    const modal = document.querySelector("#modal");
    modal.style.display = modal.style.display === "none" ? "block" : "none";
    document.body.style.overflow = "hidden"; // Prevent body from scrolling

    videoElement.pause();
    playVisibleVideo();
  });

  textbox.innerHTML = `<a class="rk-caption" id="rk-caption">Shop via Reels</a>`;

  return textbox;
};

document.addEventListener("DOMContentLoaded", function () {
  const setVhProperty = () => {
    let vh = window.innerHeight * 0.01;
    // On mobile browsers that have a search bar and/or bottom navigation bar, we need to adjust the vh value accordingly
    if (
      /Android/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent)
    ) {
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    } else {
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  };

  setVhProperty(); // Call on page load
  window.addEventListener("resize", setVhProperty); // Call on window resize
  launchReelkart();
});

const SentryError = () => {
  // Create a new script element
  const scriptElement = document.createElement("script");

  // Set the src attribute of the script element
  scriptElement.src =
    "https://js.sentry-cdn.com/ecaeb7f3fe894835a91e5f47ca12bf55.min.js";

  // Set the crossorigin attribute if necessary (optional)
  scriptElement.crossOrigin = "anonymous";

  // Append the script element to the head or body of your HTML document
  // Choose the appropriate container where you want the script to be loaded
  document.head.appendChild(scriptElement); // or document.body.appendChild(scriptElement);
};

// // ADDED window?.setTimeout BCZ ABOVE OPTION WERE NOT RUNNING IF SCRIPT ADDED THROUGH SPOTIFY SCRIPTAPI
// window?.setTimeout(function () {
//     console.log("REELKART RUNNING...");

//     const setVhProperty = () => {
//         let vh = window.innerHeight * 0.01;
//         // On mobile browsers that have a search bar and/or bottom navigation bar, we need to adjust the vh value accordingly
//         if (/Android/.test(navigator.userAgent) && !(/Chrome/.test(navigator.userAgent))) {
//             vh = window.innerHeight * 0.01;
//             document.documentElement.style.setProperty('--vh', `${vh}px`);
//         } else {
//             document.documentElement.style.setProperty('--vh', `${vh}px`);
//         }
//     };

//     setVhProperty(); // Call on page load
//     window.addEventListener('resize', setVhProperty); // Call on window resize
//     launchReelkart();
// }, 0);

// CAROUSEL CODE
const ShowCarousel = (data, setting, domain) => {
  const carousels = document.querySelectorAll(".rk-carousel-container");
  console.log("caraousel_clicked", carousels);
  if (!carousels) return;

  for (let carousel of carousels) {
    var tempData = [];
    const CollectionId = carousel.getAttribute("rkId");

    const RenderCarousel = (result = []) => {
      // Custom Styling
      if (setting?.gridMarginBottom) {
        carousel.style.marginBottom = `${setting?.gridMarginBottom}px`;
      }
      if (setting?.gridMarginTop) {
        carousel.style.marginTop = `${setting?.gridMarginTop}px`;
      }

      result.forEach(({ preview_src, products, thumbnail_src, id }, index) => {
        const card = createCard(
          products[0]?.title,
          products[0]?.images[0]?.src,
          useUrl(preview_src),
          products[0]?.variants[0]?.price,
          products[0]?.variants[0]?.compare_at_price
        );
        card.setAttribute("key", index);
        carousel.appendChild(card);

        const openPopup = () => {
          let clickedReel = result.filter((e) => e.id == id);
          reelsData = [...clickedReel, ...result.filter((e) => e.id != id)];
          console.log("caraousel_clicked", reelsData);
          reelsData = Object.values(
            reelsData.reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
          );

          gtag("event", "caraousel_clicked", {
            store_link: window?.location?.hostname,
          });
          openWidget();
        };

        card.addEventListener("click", openPopup);
      });

      // TO ALIGN GRID CARDS AT CENTER IF LESS THAN DISPLAY WIDTH
      let isOverflowing = false;
      const carouselWidth = carousel.offsetWidth;
      const cardsWidth = carousel.scrollWidth;

      if (cardsWidth > carouselWidth) {
        isOverflowing = true;
        carousel.style.justifyContent = "flex-start";
      } else {
        isOverflowing = false;
        carousel.style.justifyContent = "center";
      }

      // GOOGLE ANALYTICS
      // TO ANALYSE IMPRESSION ON CAROUSEL WHEN IT IS IN USER VIWPORT
      const carousel_observer = new IntersectionObserver(function (
        entries,
        observer
      ) {
        entries.forEach(function (entry) {
          // Check if the carousel is in view
          if (entry.isIntersecting) {
            gtag("event", "caraousel_impression", {
              store_link: window?.location?.hostname,
            });
          }
        });
      });
      carousel_observer.observe(carousel);

      // TO ANALYSE SCROLLING ON CAROUSEL BY USER
      var scrollHandler = function () {
        gtag("event", "caraousel_scrolled", {
          store_link: window?.location?.hostname,
        });

        // Remove the event listener after execution
        carousel.removeEventListener("scroll", scrollHandler);
      };

      carousel.addEventListener("scroll", scrollHandler);
    };

    if (!CollectionId) {
      RenderCarousel(data);
    } else {
      fetchByCollectionId(domain, CollectionId).then((result) => {
        RenderCarousel(result);
      });
    }
  }
};
const fetchByProductHandle = async (domain, handle) => {
  const response = await fetch(domain + handle);
  const result = await response.json();
  return result.data.reels;
};

// product Page reel
const ProductPageReels = (data, setting, domain) => {
  const productReels = document.querySelectorAll(".rk-product-reels-container");

  if (!productReels) return;
  let productHandle = getProductHandleFromURL();
  // let { products } = data[0];
  let products = [];
  for (let i = 0; i < data.length; i++) {
    products.push(data[i].products[0]);
  }
  console.log("product", products, "product handle", productHandle);
  const productExists = products?.some(
    (product) => product.handle === productHandle
  );
  console.log("products", productExists, productReels);
  // ! this line should be used

  if (!productExists || !productReels) return;
  // if (productExists || !productReels) return;
  for (let Product of productReels) {
    console.log("product qwerty", Product);
    var tempData = [];
    const CollectionId = Product.getAttribute("rkId");

    const RenderProduct = (result = []) => {
      console.log("product 5423534", result);
      // Custom Styling
      if (setting?.gridMarginBottom) {
        Product.style.marginBottom = `${setting?.gridMarginBottom}px`;
      }
      if (setting?.gridMarginTop) {
        Product.style.marginTop = `${setting?.gridMarginTop}px`;
      }
      result.forEach(({ preview_src, products, id }, index) => {
        const card = createProductHighlight(
          // products[0]?.title,
          // products[0]?.images[0]?.src,
          useUrl(preview_src)
          // products[0]?.variants[0]?.price,
          // products[0]?.variants[0]?.compare_at_price
        );
        card.setAttribute("key", index);
        Product.appendChild(card);

        const openPopup = () => {
          let clickedReel = result.filter((e) => e.id == id);
          reelsData = [
            ...clickedReel,
            ...result.filter((e) => e.id != id),
            ...reelsData,
          ];
          reelsData = Object.values(
            reelsData.reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
          );

          openWidget();
          gtag("event", "caraousel_clicked", {
            store_link: window?.location?.hostname,
          });
        };

        card.addEventListener("click", openPopup);
      });

      // TO ALIGN GRID CARDS AT CENTER IF LESS THAN DISPLAY WIDTH
      let isOverflowing = false;
      const ProductWidth = Product.offsetWidth;
      const cardsWidth = Product.scrollWidth;

      if (cardsWidth > ProductWidth) {
        isOverflowing = true;
        Product.style.justifyContent = "flex-start";
      } else {
        isOverflowing = false;
        Product.style.justifyContent = "center";
      }

      // GOOGLE ANALYTICS
      // TO ANALYSE IMPRESSION ON Product WHEN IT IS IN USER VIWPORT
      const Product_observer = new IntersectionObserver(function (
        entries,
        observer
      ) {
        entries.forEach(function (entry) {
          // Check if the Product is in view
          if (entry.isIntersecting) {
            gtag("event", "caraousel_impression", {
              store_link: window?.location?.hostname,
            });
          }
        });
      });
      Product_observer.observe(Product);

      // TO ANALYSE SCROLLING ON Product BY USER
      var scrollHandler = function () {
        gtag("event", "caraousel_scrolled", {
          store_link: window?.location?.hostname,
        });

        // Remove the event listener after execution
        Product.removeEventListener("scroll", scrollHandler);
      };

      Product.addEventListener("scroll", scrollHandler);
    };

    if (!CollectionId) {
      fetchByProductHandle(
        "http://localhost:8002/public" + "/reels/mapped/",
        productHandle
      ).then((result) => {
        console.log("result dsfla;skhr23erhw2432402u4", result);
        if (result.length > 0) {
          RenderProduct(result);
        }
      });
      console.log("result", CollectionId, data);
    } else {
      fetchByCollectionId(domain, CollectionId).then((result) => {
        console.log("result fetchByCollectionId", result);
        RenderProduct(result);
      });
    }
  }
};

function createProductHighlight(videoSrc) {
  const mainElement = document.createElement("main");
  mainElement.className = "rk-product-reel-Card";

  const thumbnailDiv = document.createElement("div");
  thumbnailDiv.className = "rk-product-reel-Thumbnail";

  const videoElement = document.createElement("video");
  videoElement.muted = true;
  videoElement.setAttribute("playsinline", ""); // Set playsinline attribute
  videoElement.autoplay = true;
  videoElement.loop = true;

  // Intersection Observer to load the video src when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoElement.src = videoSrc;
        videoElement.load(); // Load the video
        observer.unobserve(videoElement); // Stop observing once the video has been loaded
      }
    });
  });

  observer.observe(videoElement);

  const productImgDiv = document.createElement("div");
  productImgDiv.className = "rk-product-reel-productImg";

  thumbnailDiv.appendChild(videoElement);

  const contentDiv = document.createElement("div");
  contentDiv.className = "rk-product-reel-Content";

  mainElement.appendChild(thumbnailDiv); // Append thumbnailDiv to mainElement
  mainElement.appendChild(contentDiv);

  return mainElement;
}

function createCard(name, imgSrc, videoSrc, price, comparePrice) {
  const mainElement = document.createElement("main");
  mainElement.className = "rk-carousel-Card";

  const thumbnailDiv = document.createElement("div");
  thumbnailDiv.className = "rk-carousel-Thumbnail";

  const videoElement = document.createElement("video");
  videoElement.muted = true;
  videoElement.setAttribute("playsinline", ""); // Set playsinline attribute
  videoElement.autoplay = true;
  videoElement.loop = true;

  // Intersection Observer to load the video src when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Temporary
        videoElement.src = videoSrc;
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(videoElement);

  const productImgDiv = document.createElement("div");
  productImgDiv.className = "rk-carousel-productImg";

  const productImg = document.createElement("img");
  productImg.src = imgSrc;

  productImgDiv.appendChild(productImg);
  thumbnailDiv.appendChild(videoElement);
  thumbnailDiv.appendChild(productImgDiv);
  mainElement.appendChild(thumbnailDiv);

  const contentDiv = document.createElement("div");
  contentDiv.className = "rk-carousel-Content";

  const h2Element = document.createElement("h2");
  h2Element.textContent = name;

  const pricingDiv = document.createElement("div");
  pricingDiv.className = "rk-carousel-Pricing";

  const comparePriceText = document.createElement("p");
  comparePriceText.className = "rk-carousel-Price";
  comparePriceText.textContent = "Rs " + Math.trunc(comparePrice);

  comparePriceText.style.textDecoration = "line-through";
  comparePriceText.style.color = "#FA4A32";

  const priceP = document.createElement("p");
  priceP.className = "rk-carousel-Price";
  priceP.textContent = "Rs " + Math.trunc(price);

  if (Math.trunc(comparePrice) != 0) {
    pricingDiv.appendChild(comparePriceText);
  }

  pricingDiv.appendChild(priceP);

  contentDiv.appendChild(h2Element);
  contentDiv.appendChild(pricingDiv);

  mainElement.appendChild(contentDiv);

  return mainElement;
}
// Product Embedded Reel
const ShowEmbeddedReel = (reelData) => {
  if (!reelData || (reelData && reelData.length == 0)) return;

  const EmbeddedReels = document.querySelectorAll(".rk-product-reel");
  let productHandle = getProductHandleFromURL();
  let { products } = reelData[0];
  const productExists = products?.some(
    (product) => product.handle == productHandle
  );

  if (!productExists || !EmbeddedReels) return;

  for (let EmbeddedReel of EmbeddedReels) {
    console.log(EmbeddedReel);

    const videoElement = document.createElement("video");
    videoElement.muted = true;
    videoElement.setAttribute("playsinline", ""); // Set playsinline attribute
    videoElement.autoplay = true;
    videoElement.loop = true;

    videoElement.play();

    videoElement.src = reelData[0]?.src;

    // Intersection Observer to load the video src when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Temporary
          videoElement.src = videoSrc;
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(videoElement);
    EmbeddedReel.appendChild(videoElement);

    const ShopViaReelBtn = document.createElement("button");
    ShopViaReelBtn.classList.add("rk-embedded-video-btn");
    ShopViaReelBtn.textContent = "Watch Video";
    EmbeddedReel.appendChild(ShopViaReelBtn);

    EmbeddedReel.onclick = openWidget;
  }
};

// EMBEDDED REEL CSS
addStyle(`
.rk-product-reel{
  width: 80%;
  margin-inline: auto !important;
  /* max-width: 350px; */
  aspect-ratio: 1/1.8;
  border-radius: 1.8em;
  overflow: hidden;
  position: relative;
}

.rk-product-reel video{
  width: 100%;
  height: 100%;
  object-fit: cover;
  
}

.rk-embedded-video-btn{
  width: 90%;
  height: 3em;
  padding-inline: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 1.2em;
  position: absolute;
  bottom: 1em;
  left: 0;
  transform: translateX(5%);
  background-color: white;
  border-radius: 1em;
}
@media only screen and (max-width: 800px) {

  .rk-product-reel {
      font-size: 2.2vw !important;
  }

  .rk-embedded-video-btn{
    margin:0 !important;
    height: 3em;
    font-size: 2em;
  }
  

`);

// CAROUSEL CSS
addStyle(`
.rk-carousel-container {
    width: 95%;
    margin-inline: auto;
    height: auto;
    display: flex;
    flex-direction: row;
    margin-top: 1em;
    overflow-x: scroll !important;
    padding-block: 1em;
    font-size: 0.7vw;
    font-family: manrope, sans-serif !important;
}

.rk-carousel-Card {
    min-width: 15em;
    width: 15em;
    aspect-ratio: 1/2.35;
    cursor: pointer;
    margin-inline: 0.5em;
    background-color: white;
    box-shadow: 0 0.1em 0.8em 0.1em #b9b9b979;
    border-radius: 2em;
    overflow: hidden;
}

.rk-carousel-Card h2 {
    font-size: 0.85em;
    font-weight: bold;
    width: inherit;
    text-align: center;
    margin-top: 0.5em;
}

.rk-carousel-Thumbnail {
    height: 80% !important;
    border-radius: inherit;
    position: relative;

}

.rk-carousel-Thumbnail video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
}

.rk-carousel-Content {
    width: 100%;
    height: 23%;
    padding-top: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.rk-carousel-productImg {
    width: 4em;
    aspect-ratio: 1/1;
    border-radius: 1em;
    background-color: white;
    position: absolute;
    bottom: -2em;
    z-index: 10;
    left: calc(50% - 2em);
    box-shadow: 0 0.1em 0.8em 0.1em #b9b9b979;
    overflow: hidden;
}

.rk-carousel-productImg>img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.rk-carousel-Content h2 {
    width: 87%;
    font-size: 1.2em !important;
    margin-block: 0.3em !important;
    /* margin-top: 1em; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}

.rk-carousel-Rating {
    display: flex;
    justify-content: center;
    align-items: center;
}

.rk-carousel-Rating p {
    font-size: 0.85em;
    font-weight: bold;
    color: #3D3D3D;
    margin-top: 0.2em;
}

.rk-carousel-Rating img {
    width: 1em;
    margin-top: 0.1em;
    margin-right: 0.2em;
}

.rk-carousel-Pricing {
    display: flex;
    justify-content: center;
    align-items: center;

}

.rk-carousel-MRP {
    color: #6F6F6F;
    font-weight: bold;
    font-size: 0.98em;
    text-decoration: line-through;
    margin-block: 0;
}

.rk-carousel-Price {
    font-weight: bold;
    font-size: 1.2em;
    margin-inline: 0.4em;
    margin-block: 0;

}

.rk-carousel-discount {
    font-weight: bold;
    font-size: 0.9em;
    color: #05A123;
    margin-block: 0;

}

@media only screen and (max-width: 800px) {

    .rk-carousel-container {
        font-size: 2.5vw !important;
    }

    .rk-carousel-Card {
        min-width: 40vw;

    }

}`);

// Highlight
addStyle(`
.rk-product-reels-container {
 width: 95%;
  margin-inline: auto;
  display: flex;
  flex-direction: row;
  margin-top: 1em;
  overflow-x: scroll !important;
  padding-block: 1em;
  font-size: 0.7vw;
  font-family: manrope, sans-serif !important;
}

.rk-product-reel-Card {
  min-width: 8em;
  min-height: 8em;
  width: 8em;
  height: 8em;
  cursor: pointer;
  margin-inline: 0.5em;
  background-color: white;
  box-shadow: 0 0.1em 0.8em 0.1em #b9b9b979;
  background: linear-gradient(white, white) padding-box,
  linear-gradient(to right, darkblue, darkorchid) border-box;
  border: 2px solid transparent;
  border-radius: 100%;
  overflow: hidden;
}

.rk-product-reel-Thumbnail {
  width: 100%;
  height: 100%;
  position: relative;
}

.rk-product-reel-Thumbnail video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.rk-product-reel-Content {
  width: 100%;
  height: 23%;
  padding-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rk-product-reel-productImg {
  width: 4em;
  aspect-ratio: 1/1;
  border-radius: 1em;
  background-color: white;
  position: absolute;
  bottom: -2em;
  z-index: 10;
  left: calc(50% - 2em);
  box-shadow: 0 0.1em 0.8em 0.1em #b9b9b979;
  overflow: hidden;
}

.rk-product-reel-productImg > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.rk-product-reel-Content h2 {
  width: 87%;
  font-size: 1.2em;
  margin-block: 0.3em !important;
  /* margin-top: 1em; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rk-product-reel-Rating {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rk-product-reel-Rating p {
  font-size: 0.85em;
  font-weight: bold;
  color: #3d3d3d;
  margin-top: 0.2em;
}

.rk-product-reel-Rating img {
  width: 1em;
  margin-top: 0.1em;
  margin-right: 0.2em;
}

.rk-product-reel-Pricing {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rk-product-reel-MRP {
  color: #6f6f6f;
  font-weight: bold;
  font-size: 0.98em;
  text-decoration: line-through;
  margin-block: 0;
}

.rk-product-reel-Price {
  font-weight: bold;
  font-size: 1.2em;
  margin-inline: 0.4em;
  margin-block: 0;
}

.rk-product-reel-discount {
  font-weight: bold;
  font-size: 0.9em;
  color: #05a123;
  margin-block: 0;
}

@media only screen and (max-width: 800px) {
  #rk-product-reel-container {
    font-size: 2.5vw !important;
  }

  .rk-product-reel-Card {
    min-width: 80px;
    min-height: 80px;
  }
}

.rk-product-reel {
  width: 80%;
  margin-inline: auto;
  /* max-width: 350px; */
  aspect-ratio: 1/2;
  border-radius: 1.8em;
  overflow: hidden;
  position: relative;
}

.rk-product-reel video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rk-embedded-video-btn {
  width: 90%;
  height: 3.3em;
  padding-inline: 1.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 1em;
  position: absolute;
  bottom: 1em;
  left: 0;
  transform: translateX(5%);
  background-color: white;
  border-radius: 1em;
}
`);

const end = performance.now();

console.log("Reelkart loaded in " + (end - start) + " milliseconds.");
