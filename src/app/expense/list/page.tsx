"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// Define a type for the form data
interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  imageUrl: string; 
}

const productData: Product[] = [
  {
    id: "1",
    name: "Chromebook (11.6\")",
    category: "Computers & Laptops",
    quantity: 508,
    unit: "SET",
    price: 25000.0,
    discount: 25.0,
    imageUrl: "/images/shoppingBag.PNG",
  },
  // Add more product data as needed for demonstration
  {
    id: "2",
    name: "Wireless Mouse",
    category: "Peripherals",
    quantity: 120,
    unit: "PCS",
    price: 800.0,
    discount: 10.0,
    imageUrl: "/images/shoppingBag.PNG",
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    category: "Peripherals",
    quantity: 30,
    unit: "PCS",
    price: 5500.0,
    discount: 15.0,
    imageUrl: "/images/shoppingBag.PNG",
  },
  {
    id: "4",
    name: "USB-C Hub",
    category: "Accessories",
    quantity: 0, // Example of zero quantity
    unit: "PCS",
    price: 1200.0,
    discount: 5.0,
    imageUrl: "/images/shoppingBag.PNG",
  },
  {
    id: "5",
    name: "External Hard Drive",
    category: "Storage",
    quantity: 75,
    unit: "PCS",
    price: 6000.0,
    discount: 20.0,
    imageUrl: "/images/shoppingBag.PNG",
  },
];

type SortOption =
  | "Default"
  | "Low to High"
  | "High to Low"
  | "A to Z"
  | "Z to A";

export default function ProductsAndServices() {
  const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = useState(false);
  const [isFilterOffcanvasOpen, setIsFilterOffcanvasOpen] = useState(false);
  const [isMoreOffcanvasOpen, setIsMoreOffcanvasOpen] = useState(false);
  const [sortText, setSortText] = useState<SortOption>("Default");
  const [hideZeroQuantity, setHideZeroQuantity] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);

  const sortOffcanvasRef = useRef<HTMLDivElement>(null);
  const filterOffcanvasRef = useRef<HTMLDivElement>(null);
  const moreOffcanvasRef = useRef<HTMLDivElement>(null);

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSortText(event.target.value as SortOption);
    setIsSortOffcanvasOpen(false);
  }, []);

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
      moreOffcanvasRef.current &&
      !moreOffcanvasRef.current.contains(event.target as Node)
    ) {
      setIsMoreOffcanvasOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const sortedAndFilteredProducts = [...productData]
    .filter((product) => {
      if (hideZeroQuantity && product.quantity === 0) {
        return false;
      }
      // Assuming "low stock" could be defined as quantity <= 50 for this example
      if (showLowStock && product.quantity > 50) {
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
          <a href="/product/product-search-list.php" className="text-gray-800">
            <i className="ri-search-line text-xl"></i>
          </a>
          <button
            className="text-gray-800"
            onClick={() => setIsMoreOffcanvasOpen(true)}
          >
            <i className="ri-more-fill text-xl"></i>
          </button>
        </div>
      </header>

      <main className="min-h-screen flex flex-col pt-16 bg-gray-50">
        {/* Search, Sort, Filter */}
        <div className="flex items-center justify-between px-4 m-1">
          <div
            className="flex items-center gap-4 cursor-pointer"
            id="sort-btn"
            onClick={() => setIsSortOffcanvasOpen(true)}
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
            onClick={() => setIsFilterOffcanvasOpen(true)}
          >
            <i className="ri-filter-2-line"></i>
            <span className="text-sm font-semibold">Filter</span>
          </button>
        </div>

        {/* Products Card */}
        <div className="mt-2 mx-4 flex flex-col">
          {/* Product List */}
          <div className="product-list overflow-y-auto space-y-2">
            {sortedAndFilteredProducts.length > 0 ? (
              sortedAndFilteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white py-5 px-3 rounded-lg"
                >
                  <div className="absolute top-0 right-0 bg-green-50 rounded-tr-lg rounded-bl-lg px-2 py-0.5">
                    <div className="text-xs text-green-800 font-semibold">
                      Qty: {product.quantity.toFixed(2)} {product.unit}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-md">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 font-semibold">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">
                          {product.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end mt-1">
                      <div className="font-semibold">
                        ₹{product.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-green-600">
                        ({product.discount.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No products found matching your criteria.
              </div>
            )}
          </div>
          {/* New Product Button */}
          <a
            href="/product/product-new.php"
            className="m-2 bg-green-600 transition text-white font-semibold rounded-full shadow w-auto px-4 py-2 ml-auto flex items-center gap-1"
          >
            <i className="ri-add-fill text-xl"></i>NEW PRODUCT
          </a>
        </div>

        {/* Sort Off-canvas */}
        <div
          id="sort-offcanvas"
          className={`fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-30 ${
            isSortOffcanvasOpen ? "" : "hidden"
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

        {/* More Off-canvas */}
        <div
          id="more-offcanvas"
          className={`fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-30 ${
            isMoreOffcanvasOpen ? "" : "hidden"
          }`}
        >
          <div
            ref={moreOffcanvasRef}
            className="w-full max-w-md bg-white custom-rounded-t shadow-sm pb-4 animate-slideUp"
          >
            <div className="flex justify-center mb-2 mt-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex flex-col m-5 bg-white border border-gray-200 rounded-lg">
              <button className="flex items-center gap-3 px-4 py-2 text-gray-800 font-medium border-b text-left w-full ">
                <i className="ri-add-box-line text-xl"></i>
                Add Product
              </button>
              <button className="flex items-center gap-3 px-4 py-2 text-gray-800 font-medium border-b text-left w-full ">
                <i className="ri-file-excel-2-line text-xl"></i>
                Download Low Stock Excel
              </button>
              <button className="flex items-center gap-3 px-4 py-2 text-gray-800 font-medium text-left w-full ">
                <i className="ri-file-pdf-2-line text-xl"></i>
                Download Low Stock PDF
              </button>
            </div>
          </div>
        </div>

        {/* Filter Off-canvas */}
        <div
          id="Filter-offcanvas"
          className={`fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-30 ${
            isFilterOffcanvasOpen ? "" : "hidden"
          }`}
        >
          <div
            ref={filterOffcanvasRef}
            className="w-full max-w-md bg-white rounded-t-2xl shadow-lg animate-slideUp"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Filter Products by
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
                Quantity
              </span>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4 mb-2">
                <label className="flex items-center pt-1 space-x-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 accent-green-600"
                    checked={hideZeroQuantity}
                    onChange={() => setHideZeroQuantity(!hideZeroQuantity)}
                  />
                  <span className="text-gray-800 font-medium">
                    Hide 0 Quantity Products
                  </span>
                </label>

                <label className="flex items-center pt-1 space-x-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 accent-green-600"
                    checked={showLowStock}
                    onChange={() => setShowLowStock(!showLowStock)}
                  />
                  <span className="text-gray-800 font-medium">
                    Low Stock Products
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-between px-6 py-3 border-t text-lg">
              <button
                className="text-gray-800 font-semibold"
                onClick={() => setIsFilterOffcanvasOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
                onClick={() => setIsFilterOffcanvasOpen(false)} // Apply filter logic here
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* No direct equivalent for PHP includes like header.php and footer.php in a single TSX file.
          In a full Next.js/React application, these would typically be separate components
          imported and used as <Header /> and <Footer /> within your layout or page components.
      */}
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