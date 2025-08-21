 "use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// Define a type for the form data
interface ExpenseFormData {
  date: string;
  category: string;
  description: string;
  amount: string; // Keep as string for input, convert to number for submission if needed
  paymentType: string;
  attachment: string;
}

// Define the available categories
const expenseCategories = [
  "Fuel Charges",
  "Toll Charges",
  "Parking Fees",
  "Driver Allowance",
  "Food Expenses",
  "Lodging / Stay Charges",
  "Vehicle Service on Trip",
  "Other Miscellaneous",
];

// Define colors for payment types (matching your CSS classes)
const typeColors: { [key: string]: string } = {
  cash: "bg-green-100",
  upi: "bg-purple-100",
  netbanking: "bg-yellow-100",
  // Add other payment types if needed:
  // card: "bg-pink-100",
  // cheque: "bg-blue-100",
  // emi: "bg-red-100",
};

export default function CreateTripExpense() {
  // State for form fields
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: "",
    category: "",
    description: "",
    amount: "",
    paymentType: "cash", // Default to cash as per original HTML
    attachment: "",
  });

  // State for form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // State for category off-canvas visibility
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Refs for input elements to programmatically show errors or focus
  const dateInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const paymentTypeSectionRef = useRef<HTMLDivElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null); // For the hidden input

  // Set initial date on component mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');
    setFormData((prev) => ({ ...prev, date: formattedDate }));
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field if user starts typing
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Handle payment type selection
  const handlePaymentTypeClick = useCallback((type: string) => {
    setFormData((prev) => ({ ...prev, paymentType: type }));
    setErrors((prev) => ({ ...prev, paymentType: null })); // Clear error
  }, []);

  // Handle attachment buttons (Camera / Upload File)
  const handleAttachment = useCallback((fileName: string) => {
    setFormData((prev) => ({ ...prev, attachment: fileName }));
    setErrors((prev) => ({ ...prev, attachment: null })); // Clear error
  }, []);

  // Handle back button click
  const handleBackButtonClick = useCallback(() => {
    window.history.back();
  }, []);

  // Handle category off-canvas open/close
  const openCategoryOffcanvas = useCallback(() => {
    setIsCategoryOffcanvasOpen(true);
  }, []);

  const closeCategoryOffcanvas = useCallback(() => {
    setIsCategoryOffcanvasOpen(false);
    setCategorySearchQuery(""); // Clear search when closing
  }, []);

  // Handle selecting a category from the off-canvas
  const handleCategorySelect = useCallback((category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setErrors((prev) => ({ ...prev, category: null })); // Clear error
    closeCategoryOffcanvas();
  }, [closeCategoryOffcanvas]);

  // Handle form submission and validation
  const handleCreateTripExpense = useCallback(() => {
    let newErrors: { [key: string]: string | null } = {};
    let isValid = true;

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    // Amount validation
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Amount is required and must be a positive number";
      isValid = false;
    }

    // Payment Type validation
    if (!formData.paymentType) {
      newErrors.paymentType = "Please select a payment type";
      isValid = false;
    }

    // Attachment validation
    if (!formData.attachment) {
      newErrors.attachment = "Attachment is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Form Data:", formData);
      alert("Form is valid. Check console for data.");
      // In a real app, you'd send formData to your backend here
    }
  }, [formData]);

  // Filter categories based on search query
  const filteredCategories = expenseCategories.filter((cat) =>
    cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-20 flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button id="back-btn" className="text-gray-800 text-2xl mr-1" onClick={handleBackButtonClick}>
            <i className="ri-arrow-left-line"></i>
          </button>
          <span className="font-semibold text-gray-800 text-lg">Create Trip Expense</span>
        </div>
      </header>

      <main className="min-h-screen flex flex-col pt-16 pb-20">
        <form id="add-expense-form" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
          <div className="mx-4 my-2 flex flex-col">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date<span className="text-red-500">*</span></label>
              <div className="relative cursor-pointer">
                <input
                  type="text"
                  name="date"
                  className={`form-control pr-10 w-full expense ${errors.date ? 'border-red-500' : ''}`}
                  value={formData.date}
                  readOnly
                  ref={dateInputRef}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="ri-calendar-event-line text-gray-800 text-lg"></i>
                </div>
              </div>
              {errors.date && <div className="form-error text-red-500 text-sm mt-1">{errors.date}</div>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
              <div className="relative cursor-pointer" onClick={openCategoryOffcanvas}>
                <input
                  type="text"
                  name="category"
                  className={`form-control pr-10 w-full expense ${errors.category ? 'border-red-500' : ''}`}
                  placeholder="Select Category"
                  value={formData.category}
                  readOnly
                  ref={categoryInputRef}
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <i className="ri-arrow-down-s-fill text-gray-800 text-lg"></i>
                </div>
              </div>
              {errors.category && <div className="form-error text-red-500 text-sm mt-1">{errors.category}</div>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                className="form-control h-24"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="amount"
                className={`form-control expense ${errors.amount ? 'border-red-500' : ''} numbers-decimal`}
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleChange}
                required
                ref={amountInputRef}
              />
              {errors.amount && <div className="form-error text-red-500 text-sm mt-1">{errors.amount}</div>}
            </div>

            <div id="paymentSections">
              <h2 className="flex items-center font-semibold text-gray-800 mb-2">
                Select Type<span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2" ref={paymentTypeSectionRef}>
                {['cash', 'upi', 'netbanking'].map((type) => (
                  <div
                    key={type}
                    className={`payment-type rounded-full py-1 px-3 font-medium font-semibold cursor-pointer ${
                      formData.paymentType === type ? typeColors[type] : 'bg-gray-100'
                    }`}
                    onClick={() => handlePaymentTypeClick(type)}
                    data-type={type}
                  >
                    <i className={`ri-checkbox-circle-fill mr-1 ${formData.paymentType !== type ? 'hidden' : ''}`}></i>
                    {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
                  </div>
                ))}
              </div>
              {errors.paymentType && <div className="form-error text-red-500 text-sm mt-1">{errors.paymentType}</div>}
            </div>

            <div className="mb-3">
              <h2 className="flex items-center font-semibold text-gray-800 mb-2">
                Attachments<span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-col w-full gap-2">
                {/* Hidden input */}
                <input type="hidden" name="attachment" id="attachmentInput" value={formData.attachment} ref={attachmentInputRef} />

                {/* Attached file name (above buttons) */}
                <div className={`text-sm text-green-600 ${formData.attachment ? '' : 'hidden'}`}>
                  Attached: {formData.attachment}
                </div>
                {errors.attachment && <div className="form-error text-red-500 text-sm mt-1">{errors.attachment}</div>}

                {/* Buttons in a row */}
                <div className="flex gap-2">
                  <button type="button"
                    className="camera-file flex items-center justify-center gap-2 font-semibold border border-gray-300 rounded-md bg-white text-green-600 px-4 py-2 text-sm w-full"
                    onClick={() => handleAttachment("receipt_from_camera.jpg")} // Simulate camera capture
                  >
                    <i className="ri-camera-line text-lg"></i> Camera
                  </button>
                  <button type="button"
                    className="upload-file flex items-center justify-center gap-2 font-semibold border border-gray-300 rounded-md bg-white text-green-600 px-4 py-2 text-sm w-full"
                    onClick={() => handleAttachment("uploaded_file.pdf")} // Simulate file upload
                  >
                    <i className="ri-upload-2-line text-lg"></i> Upload File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="py-2 px-5 bg-gray-200 rounded-t-3xl border-b border-gray-300"></div>
        <div className="bg-white flex justify-end items-center px-5 h-16">
          <button id="createBtn" type="button" className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-lg flex items-center gap-2"
            onClick={handleCreateTripExpense}
          >
            Create <i className="ri-arrow-right-s-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* Category Off-canvas / Bottom Sheet */}
      {isCategoryOffcanvasOpen && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-30 transition-opacity duration-300"
            onClick={closeCategoryOffcanvas}
          ></div>

          <div
            className="fixed bottom-0 left-0 right-0 bg-white custom-rounded-t z-40 shadow-lg flex flex-col transform translate-y-0 transition-transform duration-200"
            id="categoryOffcanvas"
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
                <input
                  type="text"
                  id="unitSearchInput"
                  className="form-control w-full search-input pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Search Expense Category"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400 text-lg"></i>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 custom-scroll"> {/* Added custom-scroll for styling if needed */}
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category}
                      className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span>{category}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No categories found.</div>
                )}
              </div>

              <div className="px-2 mt-2">
                {/* This button's functionality (Add Category) is not implemented as per original,
                    it would typically open another modal or navigate to an add category page. */}
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-center transition">Add Category</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Inline styles are moved to CSS modules or global CSS in a real app */}
      <style jsx global>{`
        .form-control {
          @apply block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
        }
        .form-control.expense {
          background-color: transparent !important;
        }
        .form-control.search-input {
          padding-left: 40px;
        }
        .h-79vh {
          height: 79vh;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        .switch input {
          display: none;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #fff;
          border: 1px solid #009333;
          transition: .5s;
          border-radius: 18px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          top: 2px;
          background-color: #009333;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #009333;
        }
        input:checked + .slider:before {
          transform: translateX(27px);
          background-color: #fff;
        }
        .custom-rounded-t {
          border-top-left-radius: 1.5rem; /* 24px */
          border-top-right-radius: 1.5rem; /* 24px */
        }
      `}</style>
    </>
  );
}