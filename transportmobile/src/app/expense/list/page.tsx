"use client";

import { postData } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";

// Define a type for the form data
interface Expense {
  id: string;
  tripSheetId: string;
  expenseCategory: string;
  amount: number;
  expenseDate: string;
  paymentMethod: string;
  remarks: string;
}


type SortOption =
  | "Default"
  | "Low to High"
  | "High to Low"
  | "A to Z"
  | "Z to A";

export default function ExpenseList() {
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = useState(false);
  const [isFilterOffcanvasOpen, setIsFilterOffcanvasOpen] = useState(false);
  const [sortText, setSortText] = useState<SortOption>("Default");
  const [hideZeroQuantity, setHideZeroQuantity] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [pendingExpenseCategory, setPendingExpenseCategory] = useState("");
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  const sortOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOffcanvasRef = useRef<HTMLDivElement>(null);
  const moreOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const categoryOverlayRef = useRef<HTMLDivElement>(null);
  const categoryOffcanvasRef = useRef<HTMLDivElement>(null);

  const expenseCategories = [
    { value: "fuelCharges", label: "Fuel Charges" },
    { value: "tollCharges", label: "Toll Charges" },
    { value: "driverAllowance", label: "Driver Allowance" },
  ];
  const router = useRouter();
  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSortText(event.target.value as SortOption);
    setIsSortOffcanvasOpen(false);
  }, []);



  useEffect(() => {
    fetchExpense();
  }, []);




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

  const filteredCategories = expenseCategories.filter((cat) =>
    cat.label.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );
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
    setCategorySearchQuery("");
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

  const handleCategorySelect = (category: string) => {
    setPendingExpenseCategory(category);
    closeCategoryOffcanvas();
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Sort Off-canvas
      if (
        sortOffcanvasRef.current &&
        !sortOffcanvasRef.current.contains(event.target as Node)
      ) {
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

  

  const fetchExpense = async () => {
    try {


      const payload = {
        token: "getTripExpense",
      };

      const response = await postData<any>(payload);

      if (response.status === "success") {
        const fetchedData = response?.tripExpenses ?? [];
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setExpenseList(fetchedData);

        } else {
          setExpenseList([]);
        }

      } else {
        setExpenseList([]);

      }
    } catch (error) {
      console.log(error);
    }
  };
  const filteredExpenseList = expenseList.filter((expense) =>
    expense.expenseCategory.toLowerCase().includes(expenseCategory.toLowerCase())
  );
  const sortedAndFilteredExpenseList = filteredExpenseList
  .filter((expense) => {
    if (expenseCategory && expense.expenseCategory !== expenseCategory) {
      return false;
    }
    return true;
  })
  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-20 flex items-center justify-between px-4 bg-white border-b border-gray-200 shadow-sm h-14">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="text-gray-800 text-2xl mr-1"
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          <span className="font-semibold text-gray-800 text-lg">
            Products & Services
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a className="text-gray-800">
            <i className="ri-search-line text-xl"></i>
          </a>
          <button
            className="text-gray-800"
          // onClick={() => setIsMoreOffcanvasOpen(true)}
          >
            <i className="ri-more-fill text-xl"></i>
          </button>
        </div>
      </header>

      <main className="min-h-screen flex flex-col pt-16 bg-gray-50">
       
        <div className="flex items-center justify-between px-4 m-1">
          <div
            className="flex items-center gap-4 cursor-pointer"
            id="sort-btn"
          // onClick={() => setIsSortOffcanvasOpen(true)}
          >
            <span className="text-gray-500 text-sm font-medium">Sort</span>
            <span
              id="sort-text"
              className="text-gray-800 text-sm font-semibold focus:outline-none"
            >
              {sortText}
            </span>
          </div>
          <button
            id="filter-btn"
            className="text-gray-700 text-sm flex items-center gap-1"
            onClick={openFilterOffcanvas}
          >
            <i className="ri-filter-2-line"></i>
            <span className="text-sm font-semibold">Filter</span>
          </button>
        </div>

        {/* Products Card */}
        <div className="mt-2 mx-4 flex flex-col">
          {/* Product List */}
          <div className="product-list overflow-y-auto space-y-2">
            {sortedAndFilteredExpenseList.length > 0 ? (
              sortedAndFilteredExpenseList.map((expense) => (
                <div
                  key={expense.id}
                  className="relative bg-white py-5 px-3 rounded-lg"
                >
                  <div className="absolute top-0 right-0 bg-green-50 rounded-tr-lg rounded-bl-lg px-2 py-0.5">
                    <div className="text-xs text-green-800 font-semibold">
                      Trip Sheet: {expense.tripSheetId}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-md">
                        <img
                          src={expense.expenseCategory}
                          alt={expense.expenseCategory}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 font-semibold">
                          {expense.expenseCategory}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">
                          {expense.expenseDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end mt-1">
                      <div className="font-semibold">
                        ₹{expense.amount}
                      </div>
                      <div className="text-xs text-green-600">
                        ({expense.paymentMethod})
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No Expense found matching your criteria.
              </div>
            )}
          </div>
        
          <a
            onClick={() => router.push("/expense/new")}
            className="m-2 bg-green-600 transition text-white font-semibold rounded-full shadow w-auto px-4 py-2 ml-auto flex items-center gap-1"
          >
            <i className="ri-add-fill text-xl"></i>NEW EXPENSE
          </a>
        </div>

        
        <div
          id="sort-offcanvas"
          className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 bg-opacity-30 ${isSortOffcanvasOpen ? "" : "hidden"
            }`}
        >
          <div
            ref={sortOffcanvasRef}
            className="w-full max-w-md bg-white custom-rounded-t shadow-lg animate-slideUp"
          >
            <div className="flex items-center justify-between pl-6 pr-5 py-3 border-b-2">
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
              <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
                <span>Default</span>
                <input
                  type="radio"
                  name="sort"
                  value="Default"
                  className="custom-green accent-green-600"
                  checked={sortText === "Default"}
                  onChange={handleSortChange}
                />
              </label>
              <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
                <span>Quantity - Low to High</span>
                <input
                  type="radio"
                  name="sort"
                  value="Low to High"
                  className="custom-green accent-green-600"
                  checked={sortText === "Low to High"}
                  onChange={handleSortChange}
                />
              </label>
              <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
                <span>Quantity - High to Low</span>
                <input
                  type="radio"
                  name="sort"
                  value="High to Low"
                  className="custom-green accent-green-600"
                  checked={sortText === "High to Low"}
                  onChange={handleSortChange}
                />
              </label>
              <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
                <span>Product Name - A to Z</span>
                <input
                  type="radio"
                  name="sort"
                  value="A to Z"
                  className="custom-green accent-green-600"
                  checked={sortText === "A to Z"}
                  onChange={handleSortChange}
                />
              </label>
              <label className="flex items-center justify-between px-6 py-3 text-gray-800 font-semibold cursor-pointer">
                <span>Product Name - Z to A</span>
                <input
                  type="radio"
                  name="sort"
                  value="Z to A"
                  className="custom-green accent-green-600"
                  checked={sortText === "Z to A"}
                  onChange={handleSortChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div
          ref={categoryOverlayRef}
          className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50 ${isCategoryOffcanvasOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-300`}
          onClick={closeCategoryOffcanvas}
        ></div>


        
        <div ref={categoryOffcanvasRef}
          className={`fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-60 shadow-lg flex flex-col transform ${isCategoryOffcanvasOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-200`}
        >
          <div className="py-2 px-5 border-b-2 border-gray-200">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-1 bg-gray-400 rounded-full mt-2"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-gray-800">Select Category</div>
              <button id="closecategoryBtn" className="text-gray-500" onClick={closeCategoryOffcanvas}>
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 max-h-[460px] min-h-[460px] flex flex-col">
            <div className="mb-2 relative">
              <i className="ri-search-line absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg pointer-events-none"></i>
              <input
                type="text"
                id="unitSearchInput"
                className="form-control w-full search-input pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Search Expense Category"
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto flex-1 custom-scroll">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.value}
                    className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleCategorySelect(category.value)}
                  >
                    <span>{category.label}</span>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No categories found.</div>
              )}
            </div>
            <div className="px-2 mt-2">
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-center transition hover:bg-green-700">Add Category</button>
            </div>
          </div>
        </div>



        <div
          ref={filterOverlayRef}
          className={`fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)] ${isFilterOffcanvasOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-300`}
          onClick={closeFilterOffcanvas} // Click on overlay to close filter
        ></div>


        <div
          ref={filterOffcanvasRef}
          className={`fixed bottom-0 left-0 right-0 w-full max-w-md bg-white rounded-t-2xl shadow-lg z-50 transform ${isFilterOffcanvasOpen ? 'translate-y-0' : 'translate-y-full hidden'}`}
        >
          <div className="py-2 px-5 border-b-2 border-gray-200">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-1 bg-gray-400 rounded-full mt-2"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-gray-800">Filter by</div>
              <button

                className="text-gray-500 text-2xl focus:outline-none"
                onClick={closeFilterOffcanvas}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
          <div className="flex flex-col px-5 py-6">
            {/* Label */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Expense Category</label>
              <div className="relative cursor-pointer" onClick={openCategoryOffcanvas}>
                <input
                  type="text"
                  name="category"
                  className={`form-control pr-10 w-full expense `}
                  placeholder="Select Category"
                  value={pendingExpenseCategory}
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
            <button className="text-gray-800 font-semibold" onClick={() => {
              closeFilterOffcanvas();
              setExpenseCategory("");
            }}>Cancel</button>
            <button className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg" onClick={()=>{
              setExpenseCategory(pendingExpenseCategory);
              closeFilterOffcanvas();
            }}>Submit</button>
          </div>
        </div>

        {/* Filter Off-canvas
        {isFilterOffcanvasOpen && (
          <div

            className={`fixed bottom-0 left-0 right-0 inset-0 z-50 flex items-end justify-center  bg-opacity-30 `}

          >
            <div
              ref={filterOffcanvasRef}
              className="w-full max-w-md bg-white rounded-t-2xl shadow-lg animate-slideUp"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Filter Expense by
                </h3>
                <button
                  id="close-Filter"
                  className="text-gray-500 text-2xl focus:outline-none"
                  onClick={() => setIsFilterOffcanvasOpen(false)}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="flex flex-col px-6 py-4">
                <span className="font-semibold text-gray-600 mb-3">
                  Expense Category
                </span>

                <div className="relative cursor-pointer" onClick={openCategoryOffcanvas}>
                  <input
                    type="text"
                    name="category"
                    className={`form-control pr-10 w-full expense `}
                    placeholder="Select Category"
                    value={expenseCategory}
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <i className="ri-arrow-down-s-fill text-gray-800 text-lg"></i>
                  </div>
                </div>

              </div>

              <div className="flex justify-between px-6 py-3 border-t text-lg">
                <button
                  className="text-gray-800 font-semibold"
                  onClick={() => {
                    setIsFilterOffcanvasOpen(false);
                    setExpenseCategory("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={handleFilterSubmit} // Apply filter logic here
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )} */}
      </main>

      
      <style jsx>{`
        .product-list {
          height: auto;
          max-height: calc(100vh - 225px);
        }

        #sort-offcanvas,
        #Filter-offcanvas,
        #more-offcanvas {
          transition: background 0.3s;
        }

        .animate-slideUp {
          animation: slideUp 0.3s forwards;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .custom-rounded-t {
          border-top-left-radius: 1rem; /* Equivalent to rounded-t-2xl */
          border-top-right-radius: 1rem; /* Equivalent to rounded-t-2xl */
        }
      `}</style>
    </>
  );
}