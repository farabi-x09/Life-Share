import Banner from "@/components/Bannner";
import ContactUs from "@/components/Contact-us";
import Featured from "@/components/Featured";
import HowItWorks from "@/components/How-works";
import StatsSection from "@/components/Stats";

import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className="">
     <Banner></Banner>
     <StatsSection></StatsSection>
     <Featured></Featured>
     <HowItWorks></HowItWorks>
     <ContactUs></ContactUs>
      <ToastContainer />
    </div>
  );
}
