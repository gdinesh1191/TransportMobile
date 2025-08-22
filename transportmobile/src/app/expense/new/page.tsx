"use client";

import { postData } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";

// Define the shape of the form data
interface ExpenseFormData {
  date: string;
  category: string;
  description: string;
  amount: string;
  paymentType: string;
  attachment: string;
}


const mockFetchExpenseData = (id: string) => {
  const mockExpenses = {
    "1": {
      id: "1",
      tripSheetId: "TS-123",
      expenseCategory: "Fuel Charges",
      expenseDate: "21/08/2025",
      amount: "1500",
      paymentMethod: "UPI",
      remarks: "Fueling up for the trip.",
      fileAttachments: "fuel_receipt.jpg",
    },

  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = mockExpenses[id as keyof typeof mockExpenses];
      if (data) {
        resolve({ status: "success", data });
      } else {
        reject({ status: "error", message: "Expense not found" });
      }
    }, 500);
  });
};

// Toast message component for feedback
const ToastMessage = ({ message, type, onClose }: {
  message: string,
  type: "success" | "error",
  onClose: () => void
}) => {
  const color = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white shadow-md z-50 transition-opacity duration-300 ${color}`}>
      <span>{message}</span>
    </div>
  );
};

// Form errors component
const FormError = ({ message }: { message: string }) => {
  return <div className="form-error text-red-500 text-sm mt-1">{message}</div>;
};

const expenseCategories = [
  { value: "fuelCharges", label: "Fuel Charges" },
  { value: "tollCharges", label: "Toll Charges" },
  { value: "driverAllowance", label: "Driver Allowance" },
];

const paymentTypeColors: { [key: string]: string } = {
  Cash: "bg-green-100",
  UPI: "bg-purple-100",
  "Net Banking": "bg-yellow-100",
};

export default function CreateTripExpense() {
  // We'll use a local state variable to simulate the editId from the URL
  const [editId, setEditId] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: "",
    category: "",
    description: "",
    amount: "",
    paymentType: "Cash",
    attachment: "",
  });
  const [formKey, setFormKey] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const router = useRouter();
  // Fetch data for editing when the component loads or the ID changes
  useEffect(() => {
    if (editId) {
      // @ts-ignore
      mockFetchExpenseData(editId).then((response: any) => {
        if (response.status === "success") {
          const data = response.data;
          setFormData({
            date: data.expenseDate || "",
            category: data.expenseCategory || "",
            description: data.remarks || "",
            amount: data.amount || "",
            paymentType: data.paymentMethod || "Cash",
            attachment: data.fileAttachments || "",
          });
        } else {
          setToastMessage("Failed to load expense data.");
          setToastType("error");
          resetForm();
        }
      }).catch(err => {
        setToastMessage("Something went wrong while fetching data.");
        setToastType("error");
        resetForm();
      });
    } else {
      resetForm();
    }
  }, [editId]);

  // Set today's date on initial load or form reset
  useEffect(() => {
    if (!editId) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB');
      setFormData((prev) => ({ ...prev, date: formattedDate }));
    }
  }, [formKey, editId]);

  // Auto-hide toast message
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePaymentTypeClick = useCallback((type: string) => {
    setFormData((prev) => ({ ...prev, paymentType: type }));
    setErrors((prev) => ({ ...prev, paymentType: null }));
  }, []);

  const handleAttachment = useCallback((fileName: string) => {
    setFormData((prev) => ({ ...prev, attachment: fileName }));
    setErrors((prev) => ({ ...prev, attachment: null }));
  }, []);

  const handleBackButtonClick = useCallback(() => {
    setEditId(null);
  }, []);

  const openCategoryOffcanvas = useCallback(() => {
    setIsCategoryOffcanvasOpen(true);
  }, []);

  const closeCategoryOffcanvas = useCallback(() => {
    setIsCategoryOffcanvasOpen(false);
    setCategorySearchQuery("");
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setErrors((prev) => ({ ...prev, category: null }));
    closeCategoryOffcanvas();
  }, [closeCategoryOffcanvas]);

  const resetForm = useCallback(() => {
    setFormData({
      date: "",
      category: "",
      description: "",
      amount: "",
      paymentType: "Cash",
      attachment: "",
    });
    setErrors({});
    setCategorySearchQuery("");
    setFormKey(prevKey => prevKey + 1);
  }, []);

  const handleCreateTripExpense = useCallback(async () => {
    let newErrors: { [key: string]: string | null } = {};
    let isValid = true;

    // Validation logic
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Amount is required and must be a positive number";
      isValid = false;
    }
    if (!formData.paymentType) {
      newErrors.paymentType = "Please select a payment type";
      isValid = false;
    }



    setErrors(newErrors);

    if (isValid) {
      // Simulate API call using the mock postData function
      const payload = {
        token: "keepTripExpense",
        data: {
          id: editId || null,
          tripSheetId: "TRIP-001",
          expenseCategory: formData.category,
          expenseDate: formData.date,
          amount: formData.amount,
          paymentMethod: formData.paymentType,
          remarks: formData.description,
          fileAttachments: formData.attachment,
        },
      };

      try {
        const response: any = await postData(payload);
        if (response.status === "success") {
          setToastMessage("Expense saved successfully!");
          setToastType("success");
          router.push("/expense/list");
          resetForm();
        }
      } catch (error) {
        setToastMessage("Error saving expense. Please try again.");
        setToastType("error");
      }
    } else {
      setToastMessage("Please correct the form errors.");
      setToastType("error");
    }
  }, [formData, editId, resetForm]);

  const filteredCategories = expenseCategories.filter((cat) =>
    cat.label.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-20 flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button id="back-btn" className="text-gray-800 text-2xl mr-1" onClick={handleBackButtonClick}>
            <i className="ri-arrow-left-line"></i>
          </button>
          <span className="font-semibold text-gray-800 text-lg">{editId ? 'Edit Trip Expense' : 'Create Trip Expense'}</span>
        </div>
      </header>

      <main className="min-h-screen flex flex-col pt-16 pb-20 bg-gray-50">
        <form id="add-expense-form" onSubmit={(e) => e.preventDefault()} key={formKey}>
          <div className="mx-4 my-4 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date<span className="text-red-500">*</span></label>
              <div className="relative cursor-pointer">
                <input
                  type="text"
                  name="date"
                  className={`form-control pr-10 w-full expense ${errors.date ? 'border-red-500' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="ri-calendar-event-line text-gray-800 text-lg"></i>
                </div>
              </div>
              {errors.date && <FormError message={errors.date} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
              <div className="relative cursor-pointer" onClick={openCategoryOffcanvas}>
                <input
                  type="text"
                  name="category"
                  className={`form-control pr-10 w-full expense ${errors.category ? 'border-red-500' : ''}`}
                  placeholder="Select Category"
                  value={formData.category}
                  readOnly
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <i className="ri-arrow-down-s-fill text-gray-800 text-lg"></i>
                </div>
              </div>
              {errors.category && <FormError message={errors.category} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                className="form-control h-24"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="amount"
                className={`form-control expense ${errors.amount ? 'border-red-500' : ''} numbers-decimal`}
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && <FormError message={errors.amount} />}
            </div>

            <div>
              <h2 className="flex items-center font-semibold text-gray-800 mb-2">
                Select Type<span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {['Cash', 'UPI', 'Net Banking'].map((type) => (
                  <div
                    key={type}
                    className={`payment-type rounded-full py-1 px-3 font-medium font-semibold cursor-pointer ${formData.paymentType === type ? paymentTypeColors[type] : 'bg-gray-100'
                      } border border-gray-300 transition-all`}
                    onClick={() => handlePaymentTypeClick(type)}
                  >
                    <i className={`ri-checkbox-circle-fill mr-1 ${formData.paymentType !== type ? 'hidden' : ''}`}></i>
                    {type}
                  </div>
                ))}
              </div>
              {errors.paymentType && <FormError message={errors.paymentType} />}
            </div>

            <div>
              <h2 className="flex items-center font-semibold text-gray-800 mb-2">
                Attachments<span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-col w-full gap-2">
                <input type="hidden" name="attachment" id="attachmentInput" value={formData.attachment} />
                <div className={`text-sm text-green-600 ${formData.attachment ? 'block' : 'hidden'}`}>
                  Attached: {formData.attachment}
                </div>
                {errors.attachment && <FormError message={errors.attachment} />}
                <div className="flex gap-2">
                  <button type="button"
                    className="flex-1 camera-file flex items-center justify-center gap-2 font-semibold border border-gray-300 rounded-md bg-white text-green-600 px-4 py-2 text-sm"
                    onClick={() => handleAttachment("receipt_from_camera.jpg")}
                  >
                    <i className="ri-camera-line text-lg"></i> Camera
                  </button>
                  <button type="button"
                    className="flex-1 upload-file flex items-center justify-center gap-2 font-semibold border border-gray-300 rounded-md bg-white text-green-600 px-4 py-2 text-sm"
                    onClick={() => handleAttachment("uploaded_file.pdf")}
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
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-lg p-4 flex justify-between items-center">
        {/* Mock toggle for edit mode */}
        <div>
        {/* <button
          className="text-sm text-gray-500 underline"
          onClick={() => router.push("/expense/list")}
        >
          Switch to Expense List
        </button> */}
        </div>
        <button
          id="createBtn"
          type="button"
          className="bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
          onClick={handleCreateTripExpense}
        >
          {editId ? 'Save' : 'Create'} <i className="ri-arrow-right-s-line text-lg"></i>
        </button>
      </div>

      {/* Category Off-canvas / Bottom Sheet */}
      {isCategoryOffcanvasOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 transition-opacity duration-300"
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
        </>
      )}

      {/* Inline styles */}
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
        .form-control {
          @apply block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm;
        }
        .form-control.expense {
          background-color: transparent !important;
        }
        .custom-rounded-t {
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
      `}</style>

      {toastMessage && (
        <ToastMessage
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
}
