 "use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface CashbookEntry {
  id: string;
  date: string;
  credit: number;
  debit: number;
}
const cashbookData: CashbookEntry[] = [
    { id: "1", date: "08-01-2025", credit: 50000.0, debit: 0.0 },
    { id: "2", date: "08-01-2025", credit: 0.0, debit: 2500.0 },
    { id: "3", date: "08-02-2025", credit: 15000.0, debit: 0.0 },
    { id: "4", date: "08-02-2025", credit: 0.0, debit: 350.0 },
    { id: "5", date: "08-02-2025", credit: 7500.0, debit: 0.0 },
    { id: "6", date: "08-01-2025", credit: 0.0, debit: 2500.0 },
    { id: "7", date: "08-02-2025", credit: 15000.0, debit: 0.0 },
    { id: "8", date: "08-02-2025", credit: 0.0, debit: 350.0 },
    { id: "9", date: "08-02-2025", credit: 7500.0, debit: 0.0 },
    { id: "10", date: "08-02-2025", credit: 15000.0, debit: 0.0 },
    { id: "11", date: "08-02-2025", credit: 0.0, debit: 350.0 },
   { id: "12", date: "08-02-2025", credit: 15000.0, debit: 0.0 },
    { id: "13", date: "08-02-2025", credit: 0.0, debit: 350.0 },
    { id: "14", date: "08-01-2025", credit: 0.0, debit: 2500.0 },
    { id: "15", date: "08-02-2025", credit: 15000.0, debit: 0.0 },
    { id: "16", date: "08-02-2025", credit: 7500.0, debit: 0.0 },
  ];
  

type SortOption = "Default" | "Credit" | "Debit";

export default function Cashbook() {
  const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = useState(false);
  const [sortText, setSortText] = useState<SortOption>("Default");

  const sortOffcanvasRef = useRef<HTMLDivElement>(null);

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSortText(event.target.value as SortOption);
    setIsSortOffcanvasOpen(false);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (sortOffcanvasRef.current && !sortOffcanvasRef.current.contains(event.target as Node)) {
      setIsSortOffcanvasOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const sortedData = [...cashbookData].sort((a, b) => {
    switch (sortText) {
      case "Credit":
        return b.credit - a.credit;
      case "Debit":
        return b.debit - a.debit;
      case "Default":
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  const totalCredit = sortedData.reduce((sum, entry) => sum + entry.credit, 0);
  const totalDebit = sortedData.reduce((sum, entry) => sum + entry.debit, 0);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-20 flex items-center justify-between px-4 bg-white border-b border-gray-200 shadow-sm h-14">
        <div className="flex items-center gap-2">
          <button onClick={() => window.history.back()} className="text-gray-800 text-2xl mr-1">
            <i className="ri-arrow-left-line"></i>
          </button>
          <span className="font-semibold text-gray-800 text-lg">Cashbook</span>
        </div>
      </header>

      <main className=" flex flex-col pt-16 bg-gray-50">
        {/* Sort Button */}
        <div className="flex items-center justify-between px-4 m-1">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setIsSortOffcanvasOpen(true)}
          >
            <span className="text-gray-500 text-sm font-medium">Sort</span>
            <span className="text-gray-800 text-sm font-semibold">{sortText}</span>
          </div>
        </div>

        {/* Table */}
        <div className="relative mx-4 mt-3 bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-y-auto max-h-[80vh]">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-green-700 border-b">
                    Credit (₹)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-red-700 border-b">
                    Debit (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((entry, idx) => (
                    <tr key={entry.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 border-b">{entry.date}</td>
                      <td className="px-4 py-3 border-b text-right  ">
                        {entry.credit > 0 ? entry.credit.toFixed(2) : "-"}
                      </td>
                      <td className="px-4 py-3 border-b text-right ">
                        {entry.debit > 0 ? entry.debit.toFixed(2) : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-6">
                      No cashbook entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sticky Totals Footer */}
          <div className="sticky bottom-0 bg-gray-100 border-t font-semibold">
            <table className="min-w-full text-sm">
              <tfoot>
                <tr>
                  <td className="px-4 py-3 text-right">Totals:</td>
                  <td className="px-4 py-3 text-right text-green-700">
                    ₹{totalCredit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-700">
                    ₹{totalDebit.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Sort Off-canvas */}
        <div
          id="sort-offcanvas"
          className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
            isSortOffcanvasOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            ref={sortOffcanvasRef}
            className={`w-full max-w-md bg-white custom-rounded-t shadow-lg transform transition-transform duration-300 ${
              isSortOffcanvasOpen ? "translate-y-0" : "translate-y-full"
            }`}
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
              <label className="flex items-center justify-between px-6 py-3 cursor-pointer">
                <span>Default (by Date)</span>
                <input
                  type="radio"
                  name="sort"
                  value="Default"
                  className="accent-green-600"
                  checked={sortText === "Default"}
                  onChange={handleSortChange}
                />
              </label>
              <label className="flex items-center justify-between px-6 py-3 cursor-pointer">
                <span>Credit - High to Low</span>
                <input
                  type="radio"
                  name="sort"
                  value="Credit"
                  className="accent-green-600"
                  checked={sortText === "Credit"}
                  onChange={handleSortChange}
                />
              </label>
              <label className="flex items-center justify-between px-6 py-3 cursor-pointer">
                <span>Debit - High to Low</span>
                <input
                  type="radio"
                  name="sort"
                  value="Debit"
                  className="accent-green-600"
                  checked={sortText === "Debit"}
                  onChange={handleSortChange}
                />
              </label>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-rounded-t {
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
      `}</style>
    </>
  );
}
