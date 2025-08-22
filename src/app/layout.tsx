 "use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Home");
  const route = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { label: "Approval", icon: "ri-check-double-line", path: "/approval/list" },
    { label: "Vehicle", icon: "ri-truck-line", path: "/vehicle/list" },
    { label: "Expense", icon: "ri-wallet-3-line", path: "/expense/new" },
    { label: "Cashbook", icon: "ri-cash-line", path: "/cashbook" },
    { label: "Trip", icon: "ri-road-map-line", path: "/" },
  ];

  // This effect sets the page title based on the current URL
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === pathname);
    if (currentItem) {
      setPageTitle(currentItem.label);
    } else if (pathname.startsWith("/vehicle")) {
      setPageTitle("Vehicle");
    } else if (pathname.startsWith("/approval")) {
      setPageTitle("Approval");
    } else {
      setPageTitle("Home"); // Fallback for other routes
    }
  }, [pathname, menuItems]);

  // This effect redirects the user to /vehicle/list if they visit the root URL
  useEffect(() => {
    if (pathname === "/") {
      route.push("/vehicle/list");
    }
  }, [pathname, route]);

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={toggleSidebar}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
            {/* Dynamic Title */}
            <span className="text-xl font-bold text-gray-800">
              {pageTitle}
            </span>
          </div>
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            <i className="ri-notification-3-line text-lg ml-1"></i>
          </button>
        </header>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl rounded-r-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 h-26 border-b border-gray-200 bg-[#009333]/5">
            <div className="w-10 h-10 rounded-full bg-[#009333] text-white flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <div className="font-semibold text-gray-800">Sanjith</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-1 mt-4 px-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPageTitle(item.label);
                  route.push(item.path);
                  toggleSidebar();
                }}
                className={`flex items-center gap-3 text-gray-700 hover:bg-[#009333]/10 hover:text-[#009333] px-4 py-3 transition rounded-lg ${
                  (pathname === item.path ||
                    (item.path === "/vehicle/list" &&
                      pathname.startsWith("/vehicle")))
                    ? "bg-[#009333]/10 text-[#009333]"
                    : ""
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="mt-auto border-t border-gray-200 px-2 py-3">
            <button
              onClick={() => {
                route.push("/logout");
                toggleSidebar();
              }}
              className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition"
            >
              <i className="ri-logout-box-r-line text-xl"></i>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="pt-6 p-2">{children}</main>
      </body>
    </html>
  );
}