// import {  Inter } from "next/font/google";
// import "./globals.css";
// import Navber from "@/components/Navber";
// import Footer from "@/components/Footer";



// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });



// export const metadata = {
//   title: "Life Share - Blood Donation Platform",
//   description: "A modern and secure blood donation platform connecting donors and recipients directly to help save lives efficiently.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html
//       data-theme="light"
//       lang="en"
//       className={`${inter.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">
//         <Navber></Navber>
//         <main>{children}</main>
//           <Footer></Footer>
//       </body>
//     </html>
//   );
// }

import { Inter } from "next/font/google";
import "./globals.css";
import Navber from "@/components/Navber";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Life Share - Blood Donation Platform",
  description: "A modern and secure blood donation platform connecting donors and recipients directly to help save lives efficiently.",
};


export default function RootLayout({ children }) {
  return (
    <html
      data-theme="light"
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900">
        <Navber />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}