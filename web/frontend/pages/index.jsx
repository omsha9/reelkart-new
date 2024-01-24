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
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

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
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "rgb(249,251,254)",
        paddingLeft: "2px",
      }}
    >
      <div style={{position:"fixed"}} >

      <SideNavBar />
      </div>
      <div style={{
            display: "flex",
            marginLeft: "12vw"
          }}>
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
          <TopVid/>
          <Info />
        </div>
        <div
          style={{
            // display: "flex",
          }}
        >
          <Graphs />
          <VideoBar/>
          
        </div>
      </div>
    </div>
  );
}

{
  /*     
    
    // <Page narrowWidth>
    //   <TitleBar title={"Reelkart"} primaryAction={null} />
    //   <Layout>
    //     <Layout.Section>
    //       <Card sectioned>
    //         <SideNavBar/>
    //         <Stack
    //           wrap={false}
    //           spacing="extraTight"
    //           distribution="trailing"
    //           alignment="center"
    //         >
    //           <Stack.Item fill>
    //             <TextContainer spacing="loose">
    //               < as="h2" variant="headingMd">
    //                 {/* {t("HomePage.heading")} */
}
//
//
{
  /* //               <p>
    //                 <Trans */
}
{
  /* //                   i18nKey="HomePage.yourAppIsReadyToExplore"
    //                   components={{ */
}
{
  /* //                     PolarisLink: (
    //                       <Link url="https://polaris.shopify.com/" external />
    //                     ),
    //                     AdminApiLink: (
    //                       <Link */
}
{
  /* //                         url="https://shopify.dev/api/admin-graphql"
    //                         external
    //                       />
    //                     ),
    //                     AppBridgeLink: (
    //                       <Link */
}
{
  /* //                         url="https://shopify.dev/apps/tools/app-bridge"
    //                         external
    //                       />
    //                     ),
    //                   }}
    //                 />
    //               </p> */
}
//              {/* <p>{t("HomePage.startPopulatingYourApp")}</p>*}
//               <p>
//                 <Trans
//                   i18nKey="HomePage.learnMore"
//                   components={{
//                     ShopifyTutorialLink: (
//                       <Link
//                         url="https://shopify.dev/apps/getting-started/add-functionality"
//                         external
//                       />
//                     ),
//                   }}
//                 />
//               </p>
//             </TextContainer>
//           </Stack.Item>
//           <Stack.Item>
// <div style={{ padding: "0 20px" }}>
//               <Image
//                 source={trophyImage}
//                 alt={t("HomePage.trophyAltText")}
//                 width={120}
//               />
//             </div>
//           </Stack.Item>
//         </Stack>
//       </Card>
//     </Layout.Section>
//     <Layout.Section>
//       <ProductsCard />
//     </Layout.Section>
//   </Layout>
// </Page> */}
