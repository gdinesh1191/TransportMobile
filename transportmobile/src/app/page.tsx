 "use client"; 

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Dashboard() {
  // Banner Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3; 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000);  
    return () => clearInterval(interval);  
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Date Filter Off-canvas State
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("This Year"); // Default value

  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDateFilter(event.target.value);
    // In a real app, you'd likely update the displayed "Sales", "Purchases", "Profit" data here
    // based on the selected filter.
  };

  // View Bills Off-canvas State
  const [showBillsOffcanvas, setShowBillsOffcanvas] = useState(false);

  const toggleBillsOffcanvas = () => {
    setShowBillsOffcanvas(!showBillsOffcanvas);
  };

  return (
    <main className="min-h-screen flex flex-col pt-16 mb-20">  
      {/* Banner Slider */}
      <div className="relative">
        <div id="banner-slider" className="overflow-hidden rounded-xl mx-4 mt-2 border border-gray-100 flex items-center shadow-sm transition-all duration-300">
          <div
            className="flex w-full transition-transform duration-500"
            id="slider-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="min-w-full flex items-center p-4 bg-green-50">
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-black mb-1">E-INVOICE</h2>
                <p className="text-gray-700 mb-3 text-sm">Create e-Invoice in a click.Unlimited & on mobile too.</p>
                <button className="border border-black text-black font-semibold rounded-full px-4 py-1 text-sm bg-white transition">
                  CREATE NOW!
                </button>
              </div>
              <Image src="/images/Invoice.png" alt="Invoice" width={100} height={100} className="slider_image object-contain" />
            </div>

            <div className="min-w-full flex items-center p-4 bg-green-50">
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-black mb-1">BULK UPLOAD</h2>
                <p className="text-gray-700 mb-3 text-sm">Upload customers, vendors & products data in one click.</p>
                <button className="border border-black text-black font-semibold rounded-full px-4 py-1 text-sm bg-white transition">
                  TRY IT NOW!
                </button>
              </div>
              <Image src="/images/bulkUpload.png" alt="bulk" width={100} height={100} className="slider_image object-contain" />
            </div>

            <div className="min-w-full flex items-center p-4 bg-green-50">
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-black mb-1">BATCH & EXPIRY</h2>
                <p className="text-gray-700 mb-3 text-sm">Track Products by batch number and monitor their expiry dates.</p>
                <button className="border border-black text-black font-semibold rounded-full px-4 py-1 text-sm bg-white transition">
                  TRY IT NOW!
                </button>
              </div>
              <Image src="/images/trackExipry.png" alt="Invoice" width={100} height={100} className="slider_image object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2 gap-2">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              currentSlide === index ? "bg-gray-400" : "bg-gray-300"
            }`}
            onClick={() => goToSlide(index)}
            id={`dot-${index}`}
          ></button>
        ))}
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl mx-4 mt-4 p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center cursor-pointer" onClick={toggleDateFilter} id="dateFilterTrigger">
            <span className="text-gray-800 font-semibold text-sm">This Year</span>
            <i className="ri-arrow-down-s-line text-gray-800 ml-1 font-semibold"></i>
          </div>
          <button onClick={toggleBillsOffcanvas} id="viewBillsBtn" className="text-green-600 font-semibold text-sm">
            View Bills
          </button>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-semibold">Sales</span>
            <span className="font-bold text-lg text-gray-800">₹0.00</span>
          </div>
          <div className="border-l border-gray-200 h-10 mx-4"></div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-semibold">Purchases</span>
            <span className="font-bold text-lg text-gray-800">₹0.00</span>
          </div>
          <div className="border-l border-gray-200 h-10 mx-4"></div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-semibold">Profit</span>
            <span className="font-bold text-lg text-gray-800">₹0.00</span>
          </div>
        </div>
      </div>

      {/* Create Section */}
      <div className="mx-4 mt-4">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-gray-800 text-lg">Create</span>
          <i className="ri-play-circle-fill text-green-500 ml-1 text-3xl"></i>
        </div>
        <div className="grid grid-cols-4 gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <a >
            <div className="flex flex-col items-center text-center">
              <i className="ri ri-bill-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Invoice</span>
            </div>
          </a>
          <a >
            <div className="flex flex-col items-center text-center">
              <i className="ri ri-shopping-cart-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Purchase</span>
            </div>
          </a>
          <a >
            <div className="flex flex-col items-center text-center">
              <i className="ri-file-copy-2-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Quotation</span>
            </div>
          </a>
          <a >
            <div className="flex flex-col items-center text-center">
              <i className="ri ri-truck-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Delivery Challan</span>
            </div>
          </a>
          <a >
            <div className="flex flex-col items-center text-center">
              <i className="ri ri-refund-2-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Credit Note</span>
            </div>
          </a>
          <a >
            <div className="flex flex-col items-center text-center">
              <i className="ri ri-shopping-bag-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Purchase Order</span>
            </div>
          </a>
          <a > {/* Corrected path */}
            <div className="flex flex-col items-center text-center">
              <i className="ri ri-money-dollar-circle-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Expenses</span>
            </div>
          </a>
          <a >
            <div className="flex flex-col items-center text-center">
              <i className="ri ri-file-paper-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Pro Forma Invoice</span>
            </div>
          </a>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mx-4 mt-4 mb-2">
        <div className="font-semibold text-gray-800 text-lg mb-2">Quick Access</div>
        <div className="grid grid-cols-4 gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-route-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">E-Way Bill</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-file-cloud-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">E-Invoice</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-time-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Payments Timeline</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-bar-chart-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Reports</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-line-chart-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Insights</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-bank-card-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Business Cards</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-gift-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Greetings</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-share-forward-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Refer & Get ₹1000</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-layout-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Invoice Templates</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-settings-3-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Document Settings</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <i className="ri ri-question-line mb-1 icon-neutral icon-sm"></i>
            <span className="text-xs text-gray-700">Help</span>
          </div>
        </div>
      </div>

      {/* Date Filter Off-canvas */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          showDateFilter ? "opacity-100 visible" : "opacity-0 hidden"
        }`}
        onClick={toggleDateFilter}
      ></div>
      <div
        className={`date-filter fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-40 h-[90vh] shadow-lg flex flex-col transition-transform duration-300 offcanvas-bg ${
          showDateFilter ? "translate-y-0" : "translate-y-full"
        }`}
        id="dateFilter"
      >
        <div className="py-2 px-5">
          <div className="flex justify-center mb-1">
            <div className="w-16 h-1 bg-gray-400 rounded-full my-2"></div>
          </div>
          <div className="text-xl font-bold">Date Filter</div>
        </div>

        <div className="overflow-y-auto flex-1">
          {[
            { value: "FY 25-26", label: "FY 25-26", dateRange: "01-04-2025 → 31-03-2026", isDefault: false },
            { value: "FY 24-25", label: "FY 24-25", dateRange: "01-04-2024 → 31-03-2025", isDefault: false },
            { value: "Today", label: "Today", dateRange: "18-06-2025 → 18-06-2025", isDefault: false },
            { value: "Yesterday", label: "Yesterday", dateRange: "17-06-2025 → 17-06-2025", isDefault: false },
            { value: "This Week", label: "This Week", dateRange: "16-06-2025 → 22-06-2025", isDefault: false },  
            { value: "Last Week", label: "Last Week", dateRange: "09-06-2025 → 15-06-2025", isDefault: false },  
            { value: "This Month", label: "This Month", dateRange: "01-06-2025 → 30-06-2025", isDefault: false },  
            { value: "Last Month", label: "Last Month", dateRange: "01-05-2025 → 31-05-2025", isDefault: false },  
            { value: "This Year", label: "This Year", dateRange: "01-01-2025 → 31-12-2025", isDefault: true },  
            { value: "Last Year", label: "Last Year", dateRange: "01-01-2024 → 31-12-2024", isDefault: false },
            { value: "Last Quarter", label: "Last Quarter", dateRange: "01-03-2025 → 31-05-2025", isDefault: false },  
            { value: "Custom", label: "Custom", dateRange: "01-01-2025 → 31-12-2025", isDefault: false },
          ].map((filter) => (
            <label key={filter.value} className="flex flex-col py-2 px-5 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="dateFilter"
                  value={filter.value}
                  className="w-4 h-4 custom-green"
                  checked={selectedDateFilter === filter.value}
                  onChange={handleDateFilterChange}
                />
                <span className="text-gray-700 label-main">
                  {filter.label}{" "}
                  <span className={`default-text text-green-600 text-sm font-semibold ${filter.isDefault ? "" : "hidden"}`}>
                    (Default)
                  </span>
                </span>
              </div>
              <div className={`date-extra ${selectedDateFilter === filter.value ? "" : "hidden"}`}>
                <span className="text-sm text-gray-500 ml-7">
                  {filter.dateRange}
                  {filter.value === "Custom" && <i className="ri-calendar-line ml-24 text-lg text-green-600"></i>}
                </span>
                <div>
                  <button type="button" className={`set-default-btn self-start ml-7 mt-2 set-default-bg text-yellow-900 text-sm rounded-lg px-3 py-2 shadow-sm ${filter.isDefault ? "hidden" : ""}`}>
                    Set as Default
                  </button>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="py-2 px-5">
          <button
            className="w-full bg-green-600 text-white py-3 mb-2 rounded-lg font-semibold text-center transition"
            id="applyFilter"
            onClick={toggleDateFilter} // Close off-canvas on apply
          >
            APPLY
          </button>
        </div>
      </div>

      {/* View Bills Off-canvas */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          showBillsOffcanvas ? "opacity-100 visible" : "opacity-0 hidden"
        }`}
        onClick={toggleBillsOffcanvas}
      ></div>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-40 h-[80vh] shadow-lg flex flex-col transition-transform duration-300 offcanvas-bg ${
          showBillsOffcanvas ? "translate-y-0" : "translate-y-full"
        }`}
        id="billsOffcanvas"
      >
        <div className="py-4 px-4 border-b-2 border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">View</div>
            <button id="closeBillsBtn" onClick={toggleBillsOffcanvas} className="text-gray-500">
              <i className="ri-close-line text-2xl font-semibold"></i>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center">
              <i className="ri-file-list-3-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Sales</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-shopping-cart-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Purchases</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-file-copy-2-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Quotations</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-money-dollar-circle-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Expenses</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-upload-2-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Credit Notes</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-shopping-bag-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Purchase Orders</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-download-2-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Debit Notes</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-file-paper-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Pro Forma Invoices</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-route-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Eway Bills</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-currency-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Payments</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-hand-coin-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Settlements</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-box-3-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Inventory</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-truck-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Delivery Challans</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-file-cloud-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">E-Invoices</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-hand-heart-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Indirect Income</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <i className="ri-loop-left-line mb-1 icon-neutral icon-sm"></i>
              <span className="text-xs text-gray-700">Subscriptions</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}