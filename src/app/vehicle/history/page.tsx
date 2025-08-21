 "use client";

import { useState, useRef, useEffect, useCallback } from "react";
// Assuming you have a Layout component at "../../layout"
// import Layout from "../../layout";

// Define a type for trip data
interface Trip {
  id: string;
  vehicleNumber: string;
  fromPlace: string;
  toPlace: string;
  startDate: string;
  endDate: string;
  product: string;
  quantity: string;
  tripRent: number;
  tollExpense: number;
  fuelExpense: number;
  otherExpense: number;
}

export default function VehicleTripHistory() {
  // Example static trip data. In a real application, this would come from an API call or props.
  const [tripData, setTripData] = useState<Trip>({
    id: "1",
    vehicleNumber: "TN 20 SN 1298",
    fromPlace: "Karur",
    toPlace: "Namakkal",
    startDate: "30/05/2025",
    endDate: "02/06/2025",
    product: "Tapioca",
    quantity: "120 kg",
    tripRent: 12000,
    tollExpense: 1000,
    fuelExpense: 2000,
    otherExpense: 500,
  });

  const totalExpense = tripData.tollExpense + tripData.fuelExpense + tripData.otherExpense;
  const profit = tripData.tripRent - totalExpense;

  // Ref for potential search input, though not used in this specific HTML snippet
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus on search input on component mount, similar to document.ready(function) in jQuery
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []); // Empty dependency array means this runs once on mount

  // Handle back button click
  const handleBackButtonClick = useCallback(() => {
    window.history.back();
  }, []);

  // Handle clear button click for a hypothetical search input
  // (Assuming there was a search input with id="searchInput" and a clear button with id="clearBtn")
  const handleClearSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      // If you were using a state variable for search, you'd update it here:
      // setSearchQuery('');
    }
  }, []);


  return (
    // <Layout> {/* Uncomment if you have a Layout component */}
    <main>
      <header
        className="fixed top-0 left-0 right-0 w-full z-20 flex items-center px-4 bg-white border-b border-gray-200 shadow-sm h-14"
      >
        <button className="text-gray-800 mr-2" onClick={handleBackButtonClick}>
          <i className="ri-arrow-left-line text-2xl"></i>
        </button>
        <span className="font-semibold text-gray-800 text-lg">{tripData.vehicleNumber}</span>
      </header>

      <div className="min-h-screen flex flex-col pt-16 bg-[#f3f3f3]">
        <div className="h-auto max-h-[calc(100vh-100px)] overflow-y-auto flex-1">
          <div className="mt-2 mx-4 flex flex-col">
            <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div> <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div> <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div> <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div> <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div> <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div> <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div> <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Top Row: Route & Dates */}
              <div className="flex justify-between text-gray-700 mb-3">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>From: {tripData.fromPlace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#2563eb]"></i><span>To: {tripData.toPlace}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right text-gray-500 font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <i className="ri-calendar-line text-[#a78bfa]"></i><span>{tripData.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Material and Quantity */}
              <div className="flex justify-between border-t border-gray-200 pt-2 mb-3 text-[14px]">
                <div className="text-[#009333] font-semibold">Material: {tripData.product}</div>
                <div className="text-gray-600">Qty: <span className="text-gray-800 font-semibold">{tripData.quantity}</span></div>
              </div>

              {/* Bottom Row: Financial Summary */}
              <div className="border-t border-gray-200 pt-2 text-[14px]">
                <div className="flex justify-between mb-2 font-bold">
                  <div className="text-gray-600">Trip Rent</div>
                  <div className="text-blue-600">₹{tripData.tripRent.toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between font-bold mb-1">
                    <div>Total Expense</div>
                    <div className="text-red-500">₹{totalExpense.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-[13px] mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Toll</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.tollExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Fuel</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.fuelExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 shadow-sm min-w-[90px] justify-between">
                      <span className="font-semibold text-gray-800">Other</span>
                      <span className="ml-2 text-red-500 font-bold">₹{tripData.otherExpense.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 text-[#009333] font-bold">
                  <div>Profit</div>
                  <div>₹{profit.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    // </Layout>
  );
}