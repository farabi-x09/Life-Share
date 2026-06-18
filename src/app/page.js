import Banner from "@/components/Bannner";
import Featured from "@/components/Featured";
import HowItWorks from "@/components/How-works";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
     <Banner></Banner>
     <Featured></Featured>
     <HowItWorks></HowItWorks>
    </div>
  );
}
