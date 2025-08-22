"use client";

import { postData } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
// Assuming you have a Layout component at "../../layout"
// import Layout from "../../layout";

interface Trip {
  id: string;
  vehicleNumber: string;
  fromPlace: string;
  toPlace: string;
  date: string;
  product: string;
  quantity: string;
}

interface Vehicle {
  id: number;
  registrationNumber: string;
  ownerName: string;
  modelYear: string;
  chasisNumber: string;
  npExpiryDate: string;
  truckType: string;
  classOfTruck: string;
  truckStatus: string;
}

export default function VehicleSearch() {
  const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = useState(false);
  const [isFilterOffcanvasOpen, setIsFilterOffcanvasOpen] = useState(false);
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false);
  const [isVehicleInfoCanvasOpen, setIsVehicleInfoCanvasOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("Default");
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState("");
  const [pendingVehicleNumber, setPendingVehicleNumber] = useState("");
  const [vehicleInfoDetails, setVehicleInfoDetails] = useState({
    number: "",
    type: "",
    year: "",
    chassis: "",
    engine: "",
    owner: "",
    regDate: "",
    vehicleWeight: "",
    vehicleClass: "",
  });
  const [searchVehicleInput, setSearchVehicleInput] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle[]>([]);

  const route = useRouter()

  // Refs for off-canvas elements to manage their visibility directly if needed,
  // though state-based rendering is generally preferred in React.
  // Here, they are mainly used for direct manipulation of classes as in the original jQuery.
  const sortOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const categoryOffcanvasRef = useRef<HTMLDivElement>(null);
  const categoryOverlayRef = useRef<HTMLDivElement>(null);
  const vehicleInfoCanvasRef = useRef<HTMLDivElement>(null);

  // Example vehicle numbers for the category select
  const vehicleNumbers = [
    "MH 12 AB 1234", "MH 14 XY 5678", "DL 01 ZZ 4321", "KA 05 CD 8765",
    "TN 22 GH 2345", "GJ 01 KL 7890", "RJ 14 MN 4567", "PB 10 QR 1234",
    "UP 32 ST 5678", "WB 20 UV 9012", "MH 12 AB 1234", "MH 14 XY 5678",
    "DL 01 ZZ 4321", "KA 05 CD 8765", "TN 22 GH 2345", "GJ 01 KL 7890",
    "RJ 14 MN 4567", "PB 10 QR 1234", "UP 32 ST 5678", "WB 20 UV 9012",
  ];

  // Search input for vehicle numbers
  const filteredVehicleNumbers = vehicle.filter((vehicle) =>
    vehicle.registrationNumber.toLowerCase().includes(searchVehicleInput.toLowerCase())
  );

  // Handlers for opening/closing off-canvases
  const openSortOffcanvas = useCallback(() => setIsSortOffcanvasOpen(true), []);
  const closeSortOffcanvas = useCallback(() => setIsSortOffcanvasOpen(false), []);

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
    // Hide filter overlay when category opens
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


  const openVehicleInfoCanvas = useCallback((vehicle: any) => {
    setVehicleInfoDetails({ ...vehicleInfoDetails, number: vehicle.registrationNumber, type: vehicle.truckType, year: vehicle.modelYear, chassis: vehicle.chasisNumber, engine: vehicle.engineNumber, owner: vehicle.ownerName, regDate: vehicle.registrationDate, vehicleWeight: vehicle.vehicleWeight, vehicleClass: vehicle.classOfTruck });
    console.log(vehicleInfoDetails);
    setIsVehicleInfoCanvasOpen(true);
  }, [vehicleInfoDetails, vehicle]);

  const closeVehicleInfoCanvas = useCallback(() => setIsVehicleInfoCanvasOpen(false), []);

  // Handle sort option change
  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSortOption(event.target.value);
    closeSortOffcanvas();
  }, [closeSortOffcanvas]);

  // Handle vehicle number selection in category off-canvas
  const handleVehicleNumberSelect = useCallback((number: string) => {
    setPendingVehicleNumber(number);
    closeCategoryOffcanvas();
  }, [closeCategoryOffcanvas]);

  // Effect to handle clicks outside the off-canvases to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Sort Off-canvas
      if (sortOffcanvasRef.current && !sortOffcanvasRef.current.contains(event.target as Node) && isSortOffcanvasOpen) {
        closeSortOffcanvas();
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
      if (vehicleInfoCanvasRef.current && !vehicleInfoCanvasRef.current.contains(event.target as Node) && isVehicleInfoCanvasOpen) {
        closeVehicleInfoCanvas();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOffcanvasOpen, closeSortOffcanvas, isFilterOffcanvasOpen, closeFilterOffcanvas, isCategoryOffcanvasOpen, closeCategoryOffcanvas, isVehicleInfoCanvasOpen, closeVehicleInfoCanvas]);

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const payload = {
        token: "getVehicle",
        data: {

          filters: {
            registrationNumber: selectedVehicleNumber,

          },
        },
      };

      const response = await postData<any>(payload);

      if (response.status === 'success') {
        const fetchedData = response?.vehicles ?? [];

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setVehicle(fetchedData);
        } else {
          setVehicle([]);
        }
      }
      else {
        setVehicle([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredVehicleList = vehicle.filter((vehicle) =>
    vehicle.registrationNumber.toLowerCase().includes(searchVehicleInput.toLowerCase())
  );
  const sortedAndFilteredVehicleList = filteredVehicleList
  .filter((vehicle) => {
    if (selectedVehicleNumber && vehicle.registrationNumber !== selectedVehicleNumber) {
      return false;
    }
    return true;
  })

  return (
    <main>
      <header
        className="fixed top-0 left-0 right-0 w-full z-20 flex items-center justify-between px-4 bg-white border-b border-gray-200 shadow-sm h-14"
      >
        <div className="flex items-center gap-2">
          <button
            id="back-btn"
            onClick={() => window.history.back()}
            className="text-gray-800 text-2xl mr-1"
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          <span className="font-semibold text-gray-800 text-lg">Vehicle Search</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Assuming ri-more-fill is for a 'more' off-canvas, which wasn't fully implemented in original code. */}
          {/* <button className="text-gray-800"><i className="ri-more-fill text-xl"></i></button> */}
        </div>
      </header>

      <div className="max-h-screen flex flex-col pt-16">
        {/* Search, Sort, Filter */}
        <div className="flex items-center justify-between px-1 m-1">
          <div className="flex items-center gap-4 cursor-pointer" >
            <span className="text-gray-500 text-sm font-medium">Sort</span>
            <span id="sort-text" className="text-gray-800 text-sm font-semibold focus:outline-none">
              {selectedSortOption}
            </span>
          </div>
          <button
            onClick={openFilterOffcanvas}
            className="text-gray-700 text-sm flex items-center gap-1"
          >
            <i className="ri-filter-2-line"></i>
            <span className="text-sm font-semibold">Filter</span>
          </button>
        </div>

        <div className="h-autoflex-1">
          <div className="mt-2 mx-1 flex flex-col">
            {sortedAndFilteredVehicleList.length > 0 ? (
              <div
                className="product-list space-y-2 bg-white p-4 rounded-lg shadow max-h-[calc(100vh-130px)]"
                style={{ overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* This is a static example of a vehicle card. In a real app, you'd map over an array of vehicles. */}
                {sortedAndFilteredVehicleList.map((vehicle) => (
                  <div className="flex items-center justify-between text-sm w-full" style={{ borderBottom: "1px solid #c2c2c2", paddingBottom: "15px" }} key={vehicle.id}>
                    {/* Vehicle Icon + Info */}
                    <div className="flex items-center gap-3">
                      {/* Vehicle Icon */}
                      <i className="ri-truck-line text-xl text-green-600"></i>

                      {/* Truck Info */}
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{vehicle.registrationNumber}</span>
                        <span className="text-gray-500">{vehicle.truckType} - Truck · {vehicle.modelYear}</span>
                      </div>
                    </div>

                    {/* Eye Icon */}
                    <i
                      className="ri-information-line text-lg text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => openVehicleInfoCanvas(vehicle)}
                    ></i>
                  </div>
                ))}

                {/* More static vehicle entries would go here, or dynamic rendering via map() */}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-500">No vehicle found</h1>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Sort Off-canvas */}
      <div
        ref={sortOffcanvasRef}
        className={`fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-30 ${isSortOffcanvasOpen ? "" : "hidden"}`}
        onClick={(e) => { if (e.target === sortOffcanvasRef.current) closeSortOffcanvas(); }}
      >
        <div className="w-full max-w-md bg-white custom-rounded-t shadow-lg">
          <div className="flex items-center justify-between pl-6 pr-5 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Sort By</h3>
            <button onClick={closeSortOffcanvas} className="text-gray-500 text-2xl focus:outline-none">
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="flex flex-col">
            <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
              <span>Default</span>
              <input type="radio" name="sort" value="Default" className="custom-green accent-green-600" checked={selectedSortOption === "Default"} onChange={handleSortChange} />
            </label>
            <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
              <span>Quantity - Low to High</span>
              <input type="radio" name="sort" value="Low to High" className="custom-green accent-green-600" checked={selectedSortOption === "Low to High"} onChange={handleSortChange} />
            </label>
            <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
              <span>Quantity - High to Low</span>
              <input type="radio" name="sort" value="High to Low" className="custom-green accent-green-600" checked={selectedSortOption === "High to Low"} onChange={handleSortChange} />
            </label>
            <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
              <span>Product Name - A to Z</span>
              <input type="radio" name="sort" value="A to Z" className="custom-green accent-green-600" checked={selectedSortOption === "A to Z"} onChange={handleSortChange} />
            </label>
            <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
              <span>Product Name - Z to A</span>
              <input type="radio" name="sort" value="Z to A" className="custom-green accent-green-600" checked={selectedSortOption === "Z to A"} onChange={handleSortChange} />
            </label>
          </div>
        </div>
      </div>

      {/* Filter Overlay */}
      <div
        ref={filterOverlayRef}
        className={`fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)] ${isFilterOffcanvasOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-300`}
        onClick={closeFilterOffcanvas} // Click on overlay to close filter
      ></div>

      {/* Filter Off-canvas */}
      <div
        ref={filterOffcanvasRef}
        className={`fixed bottom-0 left-0 right-0 w-full max-w-md bg-white rounded-t-2xl shadow-lg z-50 transform ${isFilterOffcanvasOpen ? 'translate-y-0' : 'translate-y-full hidden'}`}
      >
        <div className="py-2 px-5 border-b-2 border-gray-200">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-1 bg-gray-400 rounded-full mt-2"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">Applied by</div>
            <button onClick={closeFilterOffcanvas} className="text-gray-500">
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="flex flex-col px-5 py-6">
          {/* Label */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">Vehicle Number</label>
            <div className="relative cursor-pointer" onClick={openCategoryOffcanvas}>
              <input
                type="text"
                className="form-control pr-10 w-full expense"
                value={pendingVehicleNumber}
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
          <button className="text-gray-800 font-semibold" onClick={() => { closeFilterOffcanvas(); setSelectedVehicleNumber("") }}>Cancel</button>
          <button className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg" onClick={() => { closeFilterOffcanvas(); setSelectedVehicleNumber(pendingVehicleNumber) }}>Submit</button>
        </div>
      </div>

      {/* Category Off-canvas Overlay */}
      <div
        ref={categoryOverlayRef}
        className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50 ${isCategoryOffcanvasOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-300`}
        onClick={closeCategoryOffcanvas}
      ></div>

      {/* Category Off-canvas */}
      <div
        ref={categoryOffcanvasRef}
        className={`fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-60 shadow-lg flex flex-col transform ${isCategoryOffcanvasOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-200`}
      >
        <div className="py-2 px-5 border-b-2 border-gray-200">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-1 bg-gray-400 rounded-full mt-2"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">Select Vehicle Number</div>
            <button onClick={closeCategoryOffcanvas} className="text-gray-500">
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="mb-2 relative">
            <i className="ri-search-line absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg pointer-events-none"></i>
            <input
              type="text"
              id="unitSearchInput"
              className="form-control w-full search-input pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Search Vehicle number"
              value={searchVehicleInput}
              onChange={(e) => setSearchVehicleInput(e.target.value)}
            />

          </div>

          <div className="h-80 overflow-y-auto">
            {filteredVehicleNumbers.map((vehicle, index) => (
              <div
                key={index}
                className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                onClick={() => handleVehicleNumberSelect(vehicle.registrationNumber)}
              >
                <span>{vehicle.registrationNumber}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Info Off-canvas */}

      <div
        ref={vehicleInfoCanvasRef}
        className={`fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.5)] ${isVehicleInfoCanvasOpen ? "" : "hidden"}`}
        onClick={(e) => { if (e.target === vehicleInfoCanvasRef.current) closeVehicleInfoCanvas(); }}
      >
        <div className="w-full max-w-md bg-white rounded-t-2xl shadow-lg flex flex-col relative font-[14px]">

          <button onClick={closeVehicleInfoCanvas} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors">
            <i className="ri-close-line text-2xl"></i>
          </button>


          <div className="px-4 py-4 border-b border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-800">Vehicle Details</h3>
          </div>


          <div className="p-4 space-y-3 text-gray-700 flex-1">

            <div className="flex justify-between">
              <span className="font-medium">Vehicle Number:</span>
              <span id="vehicleNumber" className="text-[#009333]">{vehicleInfoDetails.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Type:</span>
              <span id="vehicleType">{vehicleInfoDetails.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Year:</span>
              <span id="vehicleYear">{vehicleInfoDetails.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Chassis Number:</span>
              <span id="vehicleChassis">{vehicleInfoDetails.chassis}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Engine Number:</span>
              <span id="vehicleEngine">{vehicleInfoDetails.engine}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Owner Name:</span>
              <span id="vehicleOwner" className="text-[#009333]">{vehicleInfoDetails.owner}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Registration Date:</span>
              <span id="vehicleRegDate">{vehicleInfoDetails.regDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Vehicle Weight in Kg:</span>
              <span id="vehicleWeight">{vehicleInfoDetails.vehicleWeight}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Vehicle Class:</span>
              <span id="vehicleClass">{vehicleInfoDetails.vehicleClass}</span>
            </div>


            {/* <div className="grid grid-cols-2 gap-3 mt-5">
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-300 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="ri-file-download-line"></i> RC
              </button>
              <button className="bg-green-50 hover:bg-green-100 text-green-600 border border-green-300 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="ri-file-download-line"></i> FC
              </button>
              <button className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border border-yellow-300 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="ri-file-download-line"></i> Insurance
              </button>
              <button className="bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-300 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="ri-file-download-line"></i> Pollution
              </button>
              <button className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-300 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="ri-file-download-line"></i> Permit
              </button>
              <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-300 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="ri-file-download-line"></i> Tax
              </button>
            </div>

            <div className="mt-6 flex space-x-4">
              <a  onClick={()=>route.push("/vehicle/report")}
                className="flex-1 text-center bg-[#009333] text-white hover:bg-[#007a29] transition-colors font-medium py-2 rounded-xl">
                Vehicle Report
              </a>
              <a  onClick={()=>route.push("/vehicle/history")}
                className="flex-1 text-center bg-[#c2c2c2] text-black hover:bg-[#007a29] transition-colors font-medium py-2 rounded-xl">
                Trip History
              </a>
            </div> */}
          </div>
        </div>
      </div>

    </main>
    // </Layout>
  );
}