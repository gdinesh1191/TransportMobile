"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Layout from "../../layout";
// Define a type for trip data
interface Trip {
  id: string;
  vehicleNumber: string;
  fromPlace: string;
  toPlace: string;
  date: string;
  product: string;
  quantity: string;
}

// Dummy data for trips - replace with actual data fetching
const DUMMY_TRIPS: Trip[] = [
  {
    id: "1",
    vehicleNumber: "TN38NK3456",
    fromPlace: "Karur",
    toPlace: "Namakkal",
    date: "30/05/2025",
    product: "Tapioca",
    quantity: "120 kg",
  },
  {
    id: "2",
    vehicleNumber: "MH 12 AB 1234",
    fromPlace: "Mumbai",
    toPlace: "Pune",
    date: "01/06/2025",
    product: "Grains",
    quantity: "500 kg",
  },
  {
    id: "3",
    vehicleNumber: "DL 01 ZZ 4321",
    fromPlace: "Delhi",
    toPlace: "Jaipur",
    date: "02/06/2025",
    product: "Vegetables",
    quantity: "80 kg",
  },
  {
    id: "4",
    vehicleNumber: "KA 05 CD 8765",
    fromPlace: "Bangalore",
    toPlace: "Mysore",
    date: "03/06/2025",
    product: "Fruits",
    quantity: "200 kg",
  },
  {
    id: "5",
    vehicleNumber: "TN 22 GH 2345",
    fromPlace: "Chennai",
    toPlace: "Madurai",
    date: "04/06/2025",
    product: "Textiles",
    quantity: "100 kg",
  },
];

// Dummy data for vehicle numbers - replace with actual data fetching
const DUMMY_VEHICLE_NUMBERS: string[] = [
  "MH 12 AB 1234",
  "MH 14 XY 5678",
  "DL 01 ZZ 4321",
  "KA 05 CD 8765",
  "TN 22 GH 2345",
  "GJ 01 KL 7890",
  "RJ 14 MN 4567",
  "PB 10 QR 1234",
  "UP 32 ST 5678",
  "WB 20 UV 9012",
];

export default function TripApproval() {
  const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = useState(false);
  const [isFilterOffcanvasOpen, setIsFilterOffcanvasOpen] = useState(false);
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false); // For vehicle number selection
  const [selectedSort, setSelectedSort] = useState("Default");
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState<
    string | null
  >(null);
  const [searchVehicleTerm, setSearchVehicleTerm] = useState("");

  const sortOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOffcanvasRef = useRef<HTMLDivElement>(null);
  const categoryOffcanvasRef = useRef<HTMLDivElement>(null);

  // Filtered vehicle numbers for the category off-canvas search
  const filteredVehicleNumbers = DUMMY_VEHICLE_NUMBERS.filter((number) =>
    number.toLowerCase().includes(searchVehicleTerm.toLowerCase())
  );

  // Trip filtering and sorting logic
  const sortedAndFilteredTrips = DUMMY_TRIPS.filter((trip) => {
    // Apply vehicle number filter if selected
    if (selectedVehicleNumber && trip.vehicleNumber !== selectedVehicleNumber) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    // Apply sorting logic
    if (selectedSort === "Quantity - Low to High") {
      const qtyA = parseFloat(a.quantity);
      const qtyB = parseFloat(b.quantity);
      return qtyA - qtyB;
    } else if (selectedSort === "Quantity - High to Low") {
      const qtyA = parseFloat(a.quantity);
      const qtyB = parseFloat(b.quantity);
      return qtyB - qtyA;
    } else if (selectedSort === "Product Name - A to Z") {
      return a.product.localeCompare(b.product);
    } else if (selectedSort === "Product Name - Z to A") {
      return b.product.localeCompare(a.product);
    }
    return 0; // Default or no specific sort applied
  });

  // Handle clicks outside off-canvases to close them
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      sortOffcanvasRef.current &&
      !sortOffcanvasRef.current.contains(event.target as Node)
    ) {
      setIsSortOffcanvasOpen(false);
    }
    if (
      filterOffcanvasRef.current &&
      !filterOffcanvasRef.current.contains(event.target as Node)
    ) {
      setIsFilterOffcanvasOpen(false);
    }
    if (
      categoryOffcanvasRef.current &&
      !categoryOffcanvasRef.current.contains(event.target as Node)
    ) {
      setIsCategoryOffcanvasOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handler for Approve button click
  const handleApprove = (tripId: string) => {
    console.log(`Trip ${tripId} Approved!`);
    // Here you would typically send an API request to approve the trip
    // and then update your local state or refetch trips.
  };

  // Handler for Reject button click
  const handleReject = (tripId: string) => {
    console.log(`Trip ${tripId} Rejected!`);
    // Here you would typically send an API request to reject the trip
    // and then update your local state or refetch trips.
  };

  return (
    <Layout  >
      <div className="flex-1 flex flex-col pt-16 bg-gray-50">
        {/* Search, Sort, Filter */}
        <div className="flex items-center justify-between px-4 m-1">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setIsSortOffcanvasOpen(true)}
            id="sort-btn"
          >
            <span className="text-gray-500 text-sm font-medium">Sort</span>
            <span id="sort-text" className="text-gray-800 text-sm font-semibold focus:outline-none">
              {selectedSort}
            </span>
          </div>
          <button
            id="openFilterBtn"
            className="text-gray-700 text-sm flex items-center gap-1"
            onClick={() => setIsFilterOffcanvasOpen(true)}
          >
            <i className="ri-filter-2-line"></i>
            <span className="text-sm font-semibold">Filter</span>
          </button>
        </div>

        <div className="h-auto max-h-[calc(100vh-165px)] overflow-y-auto flex-1">
          <div className="mt-2 mx-4 flex flex-col">
            <div className="product-list space-y-2">
              {sortedAndFilteredTrips.length === 0 ? (
                <div className="text-center text-gray-600 mt-8">
                  No trips found matching your criteria.
                </div>
              ) : (
                sortedAndFilteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="relative bg-white border border-gray-100 rounded-xl p-4 max-w-md mx-auto"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-md font-bold text-gray-800 flex items-center gap-1">
                          {trip.vehicleNumber}
                        </div>
                        <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <i className="ri-map-pin-line text-gray-500"></i>{" "}
                          From: {trip.fromPlace}
                        </div>
                        <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <i className="ri-map-pin-line text-gray-500"></i> To:{" "}
                          {trip.toPlace}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-sm font-semibold text-gray-600 flex items-center gap-1 justify-end">
                          {trip.date}
                        </div>
                        <div className="text-sm text-green-600 font-semibold flex items-center gap-1 justify-end">
                          {trip.product}
                        </div>
                        <div className="text-sm font-semibold text-gray-600 flex items-center gap-1 justify-end">
                          Qty: {trip.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(trip.id)}
                        className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(trip.id)}
                        className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sort Off-canvas */}
      <div
        id="sort-offcanvas"
        ref={sortOffcanvasRef}
        className={`fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-30 transition-opacity duration-300 ${
          isSortOffcanvasOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-md bg-white custom-rounded-t shadow-lg transform transition-transform duration-300 ${
            isSortOffcanvasOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between pl-6 pr-5 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Sort By</h3>
            <button
              id="close-sort"
              className="text-gray-500 text-2xl focus:outline-none"
              onClick={() => setIsSortOffcanvasOpen(false)}
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="flex flex-col">
            {[
              "Default",
              "Quantity - Low to High",
              "Quantity - High to Low",
              "Product Name - A to Z",
              "Product Name - Z to A",
            ].map((option) => (
              <label
                key={option}
                className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer"
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="sort"
                  value={option}
                  className="custom-green accent-green-600"
                  checked={selectedSort === option}
                  onChange={() => {
                    setSelectedSort(option);
                    setIsSortOffcanvasOpen(false); // Close after selection
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Overlay */}
      <div
        id="filterOverlay"
        className={`fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)] transition-opacity duration-300 ${
          isFilterOffcanvasOpen || isCategoryOffcanvasOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setIsFilterOffcanvasOpen(false);
          setIsCategoryOffcanvasOpen(false);
        }} // Close both if overlay clicked
      ></div>

      {/* Filter Off-canvas */}
      <div
        id="Filter-offcanvas"
        ref={filterOffcanvasRef}
        className={`fixed bottom-0 w-full max-w-md bg-white rounded-t-2xl shadow-lg z-50 transform transition-transform duration-300 ${
          isFilterOffcanvasOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="py-2 px-5 border-b-2 border-gray-200">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-1 bg-gray-400 rounded-full mt-2"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">Applied by</div>
            <button
              id="close-Filter"
              className="text-gray-500"
              onClick={() => setIsFilterOffcanvasOpen(false)}
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col px-5 py-6">
          {/* Label */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Vehicle Number
            </label>
            <div
              className="relative cursor-pointer"
              id="categoryTrigger"
              onClick={() => setIsCategoryOffcanvasOpen(true)}
            >
              <input
                type="text"
                className="pr-10 w-full expense"
                value={selectedVehicleNumber || ""}
                placeholder="Select Vehicle Number"
                readOnly
              />
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <i className="ri-arrow-down-s-fill text-gray-800 text-lg"></i>
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between px-6 py-3 border-t-[1px] border-gray-200 text-lg ">
          <button
            className="text-gray-800 font-semibold"
            onClick={() => {
              setSelectedVehicleNumber(null); // Clear filter
              setIsFilterOffcanvasOpen(false);
            }}
          >
            Clear
          </button>
          <button
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
            onClick={() => setIsFilterOffcanvasOpen(false)} // Just close filter after selection
          >
            Apply
          </button>
        </div>
      </div>

      {/* Category Off-canvas (Vehicle Number Selection) */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-60 shadow-lg flex flex-col transform transition-transform duration-200 ${
          isCategoryOffcanvasOpen ? "translate-y-0" : "translate-y-full"
        }`}
        id="categoryOffcanvas"
        ref={categoryOffcanvasRef}
      >
        <div className="py-2 px-5 border-b-2 border-gray-200">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-1 bg-gray-400 rounded-full mt-2"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">
              Select Vehicle Number
            </div>
            <button
              id="closecategoryBtn"
              className="text-gray-500"
              onClick={() => setIsCategoryOffcanvasOpen(false)}
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="mb-2 relative">
            <input
              type="text"
              id="unitSearchInput"
              className="w-full search-input pr-4 py-2 border border-gray-300 rounded-lg pl-10" // Added pl-10 for icon
              placeholder="Search Vehicle number"
              value={searchVehicleTerm}
              onChange={(e) => setSearchVehicleTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400 text-lg"></i>
            </div>
          </div>

          <div className="h-80 overflow-y-auto">
            {filteredVehicleNumbers.length === 0 ? (
              <div className="p-2 text-center text-gray-500">
                No matching vehicle numbers found.
              </div>
            ) : (
              filteredVehicleNumbers.map((number) => (
                <div
                  key={number}
                  className={`p-2 flex items-center cursor-pointer hover:bg-gray-100 ${
                    selectedVehicleNumber === number ? "bg-blue-50 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSelectedVehicleNumber(number);
                    setIsCategoryOffcanvasOpen(false); // Close after selection
                    setIsFilterOffcanvasOpen(true); // Re-open filter to apply
                  }}
                >
                  <span>{number}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}