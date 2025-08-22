"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import RootLayout from "../../layout";
import { postData } from "@/app/utils/api";

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

export default function TripApproval() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Offcanvas states ---
  const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = useState(false);
  const [isFilterOffcanvasOpen, setIsFilterOffcanvasOpen] = useState(false);
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Default");
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState<string | null>(null);
  const [searchVehicleTerm, setSearchVehicleTerm] = useState("");

  const sortOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOffcanvasRef = useRef<HTMLDivElement>(null);
  const categoryOffcanvasRef = useRef<HTMLDivElement>(null);

  // 🚀 Fetch trips from API
 useEffect(() => {
  const fetchTrips = async () => {
    try {
      const payload = {
        token: "getTripSheet",
        data: {},
      };

      const result = await postData<any>(payload);

      if (result.status === "success" && Array.isArray(result.tripSheets)) {
        // 🔑 Only keep trips where status === "0"
        const filtered = result.tripSheets.filter((t: any) => t.status === "0");

        const mappedTrips: Trip[] = filtered.map((t: any) => ({
          id: t.id,
          vehicleNumber: t.vehicleNumber,
          fromPlace: t.fromPlace,
          toPlace: t.toPlace,
          date: t.tripDate,
          subtotal: t.subtotal,
          netTotal: t.netTotal,
          status: t.status, // still keep in case needed
        }));

        setTrips(mappedTrips);
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


  // Dummy vehicle numbers list (you can also get from API if available)
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

  // Filtered vehicle numbers for the category off-canvas search
  const filteredVehicleNumbers = DUMMY_VEHICLE_NUMBERS.filter((number) =>
    number.toLowerCase().includes(searchVehicleTerm.toLowerCase())
  );

  // ✅ Filter + sort trips from API
  const sortedAndFilteredTrips = trips
    .filter((trip) => {
      if (selectedVehicleNumber && trip.vehicleNumber !== selectedVehicleNumber) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (selectedSort === "Quantity - Low to High") {
        return parseFloat(a.quantity) - parseFloat(b.quantity);
      } else if (selectedSort === "Quantity - High to Low") {
        return parseFloat(b.quantity) - parseFloat(a.quantity);
      } else if (selectedSort === "Product Name - A to Z") {
        return a.product.localeCompare(b.product);
      } else if (selectedSort === "Product Name - Z to A") {
        return b.product.localeCompare(a.product);
      }
      return 0;
    });

  // Close offcanvas when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (sortOffcanvasRef.current && !sortOffcanvasRef.current.contains(event.target as Node)) {
      setIsSortOffcanvasOpen(false);
    }
    if (filterOffcanvasRef.current && !filterOffcanvasRef.current.contains(event.target as Node)) {
      setIsFilterOffcanvasOpen(false);
    }
    if (categoryOffcanvasRef.current && !categoryOffcanvasRef.current.contains(event.target as Node)) {
      setIsCategoryOffcanvasOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handlers for Approve/Reject
  const handleApprove = (tripId: string) => {
    console.log(`Trip ${tripId} Approved!`);
  };

  const handleReject = (tripId: string) => {
    console.log(`Trip ${tripId} Rejected!`);
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
            onClick={() => setIsFilterOffcanvasOpen(true)}
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
                        <div className="text-md font-bold text-gray-800">
                          {trip.vehicleNumber}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          From: {trip.fromPlace}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          To: {trip.toPlace}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-semibold text-gray-600">{trip.date}</div>
                        <div className="text-sm text-green-600 font-semibold">{trip.product}</div>
                        <div className="text-sm font-semibold text-gray-600">Qty: {trip.quantity}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(trip.id)}
                        className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(trip.id)}
                        className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-600"
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
    </>
  );
}
