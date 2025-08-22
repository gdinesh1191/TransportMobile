"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { postData } from "@/app/utils/api";
import Toaster from "@/app/utils/toast";

// Define a type for trip data
interface Trip {
  id: string;
  vehicleNumber: string;
  fromPlace: string;
  toPlace: string;
  date: string;
  driverName: string;
  netTotal: string;
  totalQty: number;
}

export default function TripApproval() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicleNumbers, setVehicleNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = Toaster();

  // --- Offcanvas states ---
  const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = useState(false);
  const [isFilterOffcanvasOpen, setIsFilterOffcanvasOpen] = useState(false);
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false);

  const [selectedSort, setSelectedSort] = useState("Default");
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState<string | null>(null);
  const [pendingVehicleNumber, setPendingVehicleNumber] = useState<string | null>(null);
  const [searchVehicleTerm, setSearchVehicleTerm] = useState("");

  const sortOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOffcanvasRef = useRef<HTMLDivElement>(null);
  const categoryOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const categoryOverlayRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement | null>(null);



  useEffect(() => {
    if (isCategoryOffcanvasOpen && categoryInputRef.current) {
      categoryInputRef.current.focus();
    }
  }, [isCategoryOffcanvasOpen]);

  //Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const payload = {
          token: "getTripSheet",
          data: {
            withDetails: true,
          },
        };

        const result = await postData<any>(payload);

        if (result.status === "success" && Array.isArray(result.tripSheets)) {

          const filtered = result.tripSheets.filter((t: any) => t.status === "0");

          const mappedTrips: Trip[] = filtered.map((t: any) => {
            const totalQty = Array.isArray(t.details)
              ? t.details.reduce(
                (sum: number, d: any) => sum + (Number(d.quantity) || 0),
                0
              )
              : 0;

            return {
              id: t.id,
              vehicleNumber: t.vehicleNumber,
              fromPlace: t.fromPlace,
              toPlace: t.toPlace,
              date: t.tripDate,
              driverName: t.driverName,
              netTotal: t.netTotal,
              totalQty,
            };
          });

          setTrips(mappedTrips);

          const numbers = [...new Set(mappedTrips.map((t) => t.vehicleNumber))];
          setVehicleNumbers(numbers);
        } else {
          console.error("API did not return trips:", result);
          setTrips([]);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);




  const filteredVehicleNumbers = vehicleNumbers.filter((number) =>
    number.toLowerCase().includes(searchVehicleTerm.toLowerCase())
  );


  const sortedAndFilteredTrips = trips
    .filter((trip) => {
      if (selectedVehicleNumber && trip.vehicleNumber !== selectedVehicleNumber) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (selectedSort === "Total - Low to High") {
        return parseFloat(a.netTotal) - parseFloat(b.netTotal);
      } else if (selectedSort === "Total - High to Low") {
        return parseFloat(b.netTotal) - parseFloat(a.netTotal);
      }
      return 0;
    });
  const openFilterOffcanvas = useCallback(() => {
    setIsFilterOffcanvasOpen(true);
    if (filterOverlayRef.current) {
      filterOverlayRef.current.classList.remove('hidden');
      filterOverlayRef.current.classList.add('opacity-100');
    }
  }, []);
  const closeFilterOffcanvas = useCallback(() => {
    setIsFilterOffcanvasOpen(false);
    if (filterOverlayRef.current) {
      filterOverlayRef.current.classList.add('hidden');
      filterOverlayRef.current.classList.remove('opacity-100');
    }
  }, []);

  const openCategoryOffcanvas = useCallback(() => {
    if (filterOverlayRef.current) {
      filterOverlayRef.current.classList.add('hidden');
    }
    setIsCategoryOffcanvasOpen(true);
    if (categoryOverlayRef.current) {
      categoryOverlayRef.current.classList.remove('hidden');
      categoryOverlayRef.current.classList.add('opacity-100');
    }
  }, []);

  const closeCategoryOffcanvas = useCallback(() => {
    setIsCategoryOffcanvasOpen(false);
    if (categoryOverlayRef.current) {
      categoryOverlayRef.current.classList.add('hidden');
      categoryOverlayRef.current.classList.remove('opacity-100');
    }
    // Restore filter overlay if filter was open
    if (isFilterOffcanvasOpen && filterOverlayRef.current) {
      filterOverlayRef.current.classList.remove('hidden');
      filterOverlayRef.current.classList.add('opacity-100');
    }
  }, [isFilterOffcanvasOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Sort Off-canvas
      if (sortOffcanvasRef.current && !sortOffcanvasRef.current.contains(event.target as Node)) {
        setIsSortOffcanvasOpen(false);
      }
      // Filter Off-canvas
      if (filterOffcanvasRef.current && !filterOffcanvasRef.current.contains(event.target as Node) && isFilterOffcanvasOpen && event.target === filterOverlayRef.current) {
        closeFilterOffcanvas();
      }
      // Category Off-canvas
      if (categoryOffcanvasRef.current && !categoryOffcanvasRef.current.contains(event.target as Node) && isCategoryOffcanvasOpen && event.target === categoryOverlayRef.current) {
        closeCategoryOffcanvas();
      }
      // Vehicle Info Off-canvas

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOffcanvasOpen, isFilterOffcanvasOpen, closeFilterOffcanvas, isCategoryOffcanvasOpen, closeCategoryOffcanvas]);



  // Handlers for Approve/Reject
  const handleAction = async (id: string, status: number) => {


    const payload = {
      token: "keepStatusTripSheet",
      data: {
        id,
        status,
      },
    };

    try {
      const result = await postData<any>(payload);

      if (result.status === "success") {
        showToast({
          title: status === 1 ? "Approved successfully!" : "Rejected successfully!",
          type: "success",
        });

        setTrips((prev) => prev.filter((trip) => trip.id !== id));
      } else {
        showToast({
          title: "Action failed",
          description: result.message,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      showToast({
        title: "Something went wrong!",
        type: "error",
      });
    }

  };


  return (
    <>
      <div className="flex-1 flex flex-col pt-16 bg-gray-50">

        <div className="flex items-center justify-between px-4 m-1">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setIsSortOffcanvasOpen(true)}
            id="sort-btn"
          >
            <span className="text-gray-500 text-sm font-medium">Sort</span>
            <span id="sort-text" className="text-gray-800 text-sm font-semibold">
              {selectedSort}
            </span>
          </div>
          <button
            id="openFilterBtn"
            className="text-gray-700 text-sm flex items-center gap-1"
            onClick={openFilterOffcanvas}
          >
            <i className="ri-filter-2-line"></i>
            <span className="text-sm font-semibold">Filter</span>
          </button>
        </div>

        <div className="h-auto max-h-[calc(100vh-165px)] overflow-y-auto flex-1">
          <div className="mt-2 mx-4 flex flex-col">
            <div className="product-list space-y-2">
              {loading ? (
                <div className="text-center text-gray-600 mt-8">Loading trips...</div>
              ) : sortedAndFilteredTrips.length === 0 ? (
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
                        <div className="text-md font-bold text-gray-800">{trip.vehicleNumber}</div>
                        <div className="text-sm font-medium text-gray-700">
                          <i className="ri-map-pin-line text-gray-500"></i> From:{" "}
                          {trip.fromPlace.charAt(0).toUpperCase() + trip.fromPlace.slice(1)}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          <i className="ri-map-pin-line text-gray-500"></i> To:{" "}
                          {trip.toPlace.charAt(0).toUpperCase() + trip.toPlace.slice(1)}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-semibold text-gray-600">{trip.date}</div>
                        <div className="text-sm text-gray-600 font-semibold">Qty: <span className="text-gray-800">{trip.totalQty}</span></div>
                        <div className="text-sm font-semibold text-gray-600">
                          Total: <span className="text-green-600">₹{Number(trip.netTotal).toLocaleString("en-IN")}</span>
                        </div>

                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(trip.id, 1)}
                        className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(trip.id, 2)}
                        className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>

                    <Toast />

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Sort Off-canvas --- */}
      <div
        id="sort-offcanvas"
        ref={sortOffcanvasRef}
        className={`fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-30 transition-opacity duration-300 ${isSortOffcanvasOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => {
          setIsSortOffcanvasOpen(false);
        }}
      >
        <div
          className={`w-full max-w-md bg-white custom-rounded-t shadow-lg transform transition-transform duration-300 ${isSortOffcanvasOpen ? "translate-y-0" : "translate-y-full"
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
              "Total - Low to High",
              "Total - High to Low",
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
                    setIsSortOffcanvasOpen(false);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* --- Filter Overlay --- */}
      <div
        ref={filterOverlayRef}
        className={`fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)] ${isFilterOffcanvasOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-300`}
        onClick={closeFilterOffcanvas} // Click on overlay to close filter
      ></div>



      {/* --- Filter Off-canvas --- */}
      <div
        id="Filter-offcanvas"
        ref={filterOffcanvasRef}
        className={`w-full max-w-md mx-auto bg-white rounded-t-2xl shadow-lg fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${isFilterOffcanvasOpen ? "translate-y-0" : "translate-y-full"
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
              onClick={closeFilterOffcanvas}
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col px-5 py-6">
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Vehicle Number
            </label>
            <div
              className="relative cursor-pointer"
              id="categoryTrigger"
              onClick={openCategoryOffcanvas}
            >
              <input
                type="text"
                className=" w-full focus:outline-none focus:ring-0 border border-gray-300 rounded-lg py-2 px-4"
                value={pendingVehicleNumber || ""}
                placeholder="Select Vehicle Number"
                readOnly
              />

              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <i className="ri-arrow-down-s-fill text-gray-800 text-lg"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between px-6 py-3 border-t-[1px] border-gray-200 text-lg ">
          <button
            className="text-gray-800 font-semibold"
            onClick={() => {
              setPendingVehicleNumber(null);
              closeFilterOffcanvas();
            }}
          >
            Clear
          </button>
          <button
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
            onClick={() => {
              setSelectedVehicleNumber(pendingVehicleNumber);
              closeFilterOffcanvas();
            }}
          >
            Apply
          </button>
        </div>
      </div>


      <div
        ref={categoryOverlayRef}
        className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50 ${isCategoryOffcanvasOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-300`}
        onClick={closeCategoryOffcanvas}
      ></div>
      {/* --- Category Off-canvas (Vehicle Number Selection) --- */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-60 shadow-lg flex flex-col transform ${isCategoryOffcanvasOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-200`}
        ref={categoryOffcanvasRef}
      >
        <div className="py-2 px-5 border-b-2 border-gray-200">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-1 bg-gray-400 rounded-full mt-2"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">Select Vehicle Number</div>
            <button
              id="closecategoryBtn"
              className="text-gray-500"
              onClick={closeCategoryOffcanvas}
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
              ref={categoryInputRef}
              className="w-full pr-4 py-2 border border-gray-300 rounded-lg pl-10 
             focus:outline-none focus:ring-1 focus:ring-[#009333] focus:border-[#009333]"
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
                  className={`px-2 py-3 flex items-center cursor-pointer rounded-md hover:bg-gray-100 ${pendingVehicleNumber === number ? "bg-gray-100 font-semibold" : ""
                    }`}
                  onClick={() => {
                    setPendingVehicleNumber(number);
                    closeCategoryOffcanvas();
                  }}
                >
                  <span>{number}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
