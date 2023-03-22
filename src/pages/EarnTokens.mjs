import SharableData from "../components/SharableData.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import Layout from "./Layout.mjs";

export default function EarnTokens() {
  return (
    <Layout>
      <div className='container'>
        <main className='main'>
          <SharableData />
          <div style={{ height: "100px" }}></div>
          <ShowBottomNavCards />
        </main>
      </div>
    </Layout>
  );
}
