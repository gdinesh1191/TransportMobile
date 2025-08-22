"use client"; // Keep this line at the top, as you need useState

// import type { Metadata } from "next"; // No longer needed here
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react"; // Import useState for off-canvas management
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// REMOVE THE METADATA EXPORT FROM HERE
// export const metadata: Metadata = {
//   title: "My Business App",
//   description: "A business management application.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showCompanyOffcanvas, setShowCompanyOffcanvas] = useState(false);
const route=useRouter()
  const toggleCompanyOffcanvas = () => {
    setShowCompanyOffcanvas(!showCompanyOffcanvas);
  };

  return (
    <html lang="en">
      <head>
         <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Common Header */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 z-20 shadow-sm">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">
             Transport App
            </span>
          </div>
          <button
            onClick={toggleCompanyOffcanvas}
            className="flex items-center text-gray-700"
          >
            <span className="text-sm font-semibold">Sanjith</span>
            <i className="ri-arrow-down-s-line text-lg ml-1"></i>
          </button>
        </header>

        {children}

        {/* Common Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-lg z-10">
          <a onClick={()=>route.push("/")} className="flex flex-col items-center text-black">
            <i className="ri-home-5-line text-xl mb-1"></i>
            <span className="text-xs">Home</span>
          </a>
          <a
          onClick={()=>route.push("/approval/list")}
            
            className="flex flex-col items-center text-black"
          >
            <i className="ri-user-line text-xl mb-1"></i>
            <span className="text-xs">Approval</span>
          </a>
          <a onClick={()=>route.push("/vehicle/list")}
            className="flex flex-col items-center text-black"
          >
            <i className="ri-truck-line text-xl mb-1"></i>
            <span className="text-xs">Vehicle</span>
          </a>
          <a onClick={()=>route.push("/expense/new")}
            className="flex flex-col items-center text-black"
          >
            <i className="ri-team-line text-xl mb-1"></i>
            <span className="text-xs">Expense</span>
          </a>
          <a
           onClick={()=>route.push("/")}
            className="flex flex-col items-center text-black"
          >
            <i className="ri-apps-2-line text-xl mb-1"></i>
            <span className="text-xs">Trip</span>
          </a>
        </nav>

         
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
            showCompanyOffcanvas ? "opacity-100 visible" : "opacity-0 hidden"
          }`}
          onClick={toggleCompanyOffcanvas}
        ></div>
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-40 h-[90vh] shadow-lg flex flex-col transition-transform duration-300 offcanvas-bg ${
            showCompanyOffcanvas ? "translate-y-0" : "translate-y-full"
          }`} 
          id="companyOffcanvas"
        >
          <div className="py-2 px-4 border-b-2 border-gray-200">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-1 bg-gray-400 rounded-full mt-2 "></div>
            </div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-xl font-bold text-gray-800"> 
                Select Business
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            <div className="space-y-2">
              <div className="p-4 bg-white shadow-sm border border-gray-200 rounded-lg company-card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-800">
                    T
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-semibold">Test</div>
                    <div className="flex gap-4 mt-1 edit-share-options">
                      <button className="text-green-600 text-md font-semibold">
                        Edit Company
                      </button>
                      <button className="text-green-600 text-md font-semibold">
                        Share
                      </button>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="company"
                    value="test"
                    className="w-5 h-5 custom-green"
                    defaultChecked
                    data-bg="bg-green-100"
                    data-text="text-green-800"
                  />
                </div>
              </div>

              <div className="p-4 bg-white shadow-sm border border-gray-200 rounded-lg company-card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-xl font-bold text-red-800">
                    N
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-semibold">nt</div>
                    <div className="flex gap-4 mt-1 edit-share-options hidden">
                      <button className="text-green-600 text-md font-semibold">
                        Edit Company
                      </button>
                      <button className="text-green-600 text-md font-semibold">
                        Share
                      </button>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="company"
                    value="nt"
                    className="w-5 h-5 custom-green"
                    data-bg="bg-red-100"
                    data-text="text-red-800"
                  />
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-3 text-green-600 font-semibold text-xl text-center flex items-center justify-center ">
              <i className="ri-add-line text-2xl"></i>
              Add new Business
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
