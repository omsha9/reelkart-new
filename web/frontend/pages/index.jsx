import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { useAppBridge, Loading } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useTranslation, Trans } from "react-i18next";
import { useEffect } from "react";
import { trophyImage } from "../assets";
import { ProductsCard } from "../components";
import SideNavBar from "../components/SideNavBar";
import Stats from "../components/Stats";
import Info from "../components/Info";
import TopPages from "../components/TopPages";
import TopVid from "../components/TopVid";
import Graphs from "../components/Graphs";
import { LineBar } from "../components/LineBar";
import VideoBar from "../components/VideoOrders";

export default function HomePage() {
  const { t } = useTranslation();
  // const { subscribe } = useAppBridge();
  const app = useAppBridge();
  const token = localStorage.getItem("shopify-access-token");

  const getToken = async () => {
    const sessionToken = await getSessionToken(app);
    console.log("session token is here", sessionToken);
    localStorage.setItem("shopify-access-token", sessionToken);
  };

  useEffect(function fetchState() {
    if (!token) {
      getToken();
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "rgb(249,251,254)",
        paddingLeft: "2px",
      }}
    >
      <div style={{ position: "fixed" }}>
        <SideNavBar token={token}/>
      </div>
      <div
        style={{
          display: "flex",
          marginLeft: "12vw",
        }}
      >
        <div
          style={{
            display: "",
          }}
        >
          <h1
            style={{
              fontSize: "xx-large",
              margin: "20px",
              cursor: "pointer",
            }}
          >
            Overview
          </h1>
          <Stats />
          <TopPages />
          <TopVid />
          <Info />
        </div>
        <div
          style={
            {
              // display: "flex",
            }
          }
        >
          <Graphs />
          <VideoBar />
        </div>
      </div>
    </div>
  );
}
