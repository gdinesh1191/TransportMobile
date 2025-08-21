(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/utils/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// utils/api.ts
__turbopack_context__.s({
    "postData": (()=>postData)
});
// Helper function to create a delay promise
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
async function postData(// endpoint: string,
data, options) {
    const baseUrl = 'http://192.168.1.52/index.php'; // Updated base URL
    // const url = `${baseUrl}${endpoint}`;
    const MIN_LOADING_TIME = 2000; // Reduced to 2 seconds for a better user experience in most cases
    try {
        // 1. Create the API fetch promise
        const apiCallPromise = fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            ...options
        });
        const minDelayPromise = delay(MIN_LOADING_TIME);
        // 2. Wait for both the API call and the minimum delay to complete
        const [apiResponseResult, delayResult] = await Promise.allSettled([
            apiCallPromise,
            minDelayPromise
        ]);
        // 3. Handle the result of the API call promise
        if (apiResponseResult.status === 'rejected') {
            console.error('API call error:', apiResponseResult.reason);
            throw apiResponseResult.reason;
        }
        const response = apiResponseResult.value;
        if (!response.ok) {
            // Attempt to parse the error message from the response body
            const errorData = await response.json().catch(()=>({
                    message: `HTTP error! status: ${response.status}`
                }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error; // Re-throw to be handled by the calling component/function
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/approval/list/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TripApproval)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function TripApproval() {
    _s();
    const [trips, setTrips] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // --- Offcanvas states ---
    const [isSortOffcanvasOpen, setIsSortOffcanvasOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isFilterOffcanvasOpen, setIsFilterOffcanvasOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSort, setSelectedSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Default");
    const [selectedVehicleNumber, setSelectedVehicleNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchVehicleTerm, setSearchVehicleTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const sortOffcanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const filterOffcanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const categoryOffcanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🚀 Fetch trips from API
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TripApproval.useEffect": ()=>{
            const fetchTrips = {
                "TripApproval.useEffect.fetchTrips": async ()=>{
                    try {
                        const payload = {
                            token: "getTripSheet",
                            data: {}
                        };
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postData"])(payload);
                        if (result.status === "success" && Array.isArray(result.tripSheets)) {
                            // 🔑 Only keep trips where status === "0"
                            const filtered = result.tripSheets.filter({
                                "TripApproval.useEffect.fetchTrips.filtered": (t)=>t.status === "0"
                            }["TripApproval.useEffect.fetchTrips.filtered"]);
                            const mappedTrips = filtered.map({
                                "TripApproval.useEffect.fetchTrips.mappedTrips": (t)=>({
                                        id: t.id,
                                        vehicleNumber: t.vehicleNumber,
                                        fromPlace: t.fromPlace,
                                        toPlace: t.toPlace,
                                        date: t.tripDate,
                                        subtotal: t.subtotal,
                                        netTotal: t.netTotal,
                                        status: t.status
                                    })
                            }["TripApproval.useEffect.fetchTrips.mappedTrips"]);
                            setTrips(mappedTrips);
                        } else {
                            console.error("API did not return trips:", result);
                            setTrips([]);
                        }
                    } catch (error) {
                        console.error("Error fetching trips:", error);
                        setTrips([]);
                    } finally{
                        setLoading(false);
                    }
                }
            }["TripApproval.useEffect.fetchTrips"];
            fetchTrips();
        }
    }["TripApproval.useEffect"], []);
    // Dummy vehicle numbers list (you can also get from API if available)
    const DUMMY_VEHICLE_NUMBERS = [
        "MH 12 AB 1234",
        "MH 14 XY 5678",
        "DL 01 ZZ 4321",
        "KA 05 CD 8765",
        "TN 22 GH 2345",
        "GJ 01 KL 7890",
        "RJ 14 MN 4567",
        "PB 10 QR 1234",
        "UP 32 ST 5678",
        "WB 20 UV 9012"
    ];
    // Filtered vehicle numbers for the category off-canvas search
    const filteredVehicleNumbers = DUMMY_VEHICLE_NUMBERS.filter((number)=>number.toLowerCase().includes(searchVehicleTerm.toLowerCase()));
    // ✅ Filter + sort trips from API
    const sortedAndFilteredTrips = trips.filter((trip)=>{
        if (selectedVehicleNumber && trip.vehicleNumber !== selectedVehicleNumber) {
            return false;
        }
        return true;
    }).sort((a, b)=>{
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
    const handleClickOutside = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TripApproval.useCallback[handleClickOutside]": (event)=>{
            if (sortOffcanvasRef.current && !sortOffcanvasRef.current.contains(event.target)) {
                setIsSortOffcanvasOpen(false);
            }
            if (filterOffcanvasRef.current && !filterOffcanvasRef.current.contains(event.target)) {
                setIsFilterOffcanvasOpen(false);
            }
            if (categoryOffcanvasRef.current && !categoryOffcanvasRef.current.contains(event.target)) {
                setIsCategoryOffcanvasOpen(false);
            }
        }
    }["TripApproval.useCallback[handleClickOutside]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TripApproval.useEffect": ()=>{
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "TripApproval.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                }
            })["TripApproval.useEffect"];
        }
    }["TripApproval.useEffect"], [
        handleClickOutside
    ]);
    // Handlers for Approve/Reject
    const handleApprove = (tripId)=>{
        console.log(`Trip ${tripId} Approved!`);
    };
    const handleReject = (tripId)=>{
        console.log(`Trip ${tripId} Rejected!`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col pt-16 bg-gray-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 m-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 cursor-pointer",
                            onClick: ()=>setIsSortOffcanvasOpen(true),
                            id: "sort-btn",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-500 text-sm font-medium",
                                    children: "Sort"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    id: "sort-text",
                                    className: "text-gray-800 text-sm font-semibold",
                                    children: selectedSort
                                }, void 0, false, {
                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/approval/list/page.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: "openFilterBtn",
                            className: "text-gray-700 text-sm flex items-center gap-1",
                            onClick: ()=>setIsFilterOffcanvasOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "ri-filter-2-line"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-semibold",
                                    children: "Filter"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/approval/list/page.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/approval/list/page.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-auto max-h-[calc(100vh-165px)] overflow-y-auto flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 mx-4 flex flex-col",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "product-list space-y-2",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center text-gray-600 mt-8",
                                children: "Loading trips..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/approval/list/page.tsx",
                                lineNumber: 174,
                                columnNumber: 17
                            }, this) : sortedAndFilteredTrips.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center text-gray-600 mt-8",
                                children: "No trips found matching your criteria."
                            }, void 0, false, {
                                fileName: "[project]/src/app/approval/list/page.tsx",
                                lineNumber: 176,
                                columnNumber: 17
                            }, this) : sortedAndFilteredTrips.map((trip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative bg-white border border-gray-100 rounded-xl p-4 max-w-md mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-md font-bold text-gray-800",
                                                            children: trip.vehicleNumber
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                                            lineNumber: 187,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm font-medium text-gray-700",
                                                            children: [
                                                                "From: ",
                                                                trip.fromPlace
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                                            lineNumber: 190,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm font-medium text-gray-700",
                                                            children: [
                                                                "To: ",
                                                                trip.toPlace
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-right space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm font-semibold text-gray-600",
                                                            children: trip.date
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-green-600 font-semibold",
                                                            children: trip.product
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                                            lineNumber: 199,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm font-semibold text-gray-600",
                                                            children: [
                                                                "Qty: ",
                                                                trip.quantity
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                                            lineNumber: 200,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 flex justify-end gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleApprove(trip.id),
                                                    className: "bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700",
                                                    children: "Approve"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleReject(trip.id),
                                                    className: "bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-600",
                                                    children: "Reject"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/approval/list/page.tsx",
                                            lineNumber: 203,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, trip.id, true, {
                                    fileName: "[project]/src/app/approval/list/page.tsx",
                                    lineNumber: 181,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/approval/list/page.tsx",
                            lineNumber: 172,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/approval/list/page.tsx",
                        lineNumber: 171,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/approval/list/page.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/approval/list/page.tsx",
            lineNumber: 148,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_s(TripApproval, "prZXSuQwprerhphflxNO5V++HZw=");
_c = TripApproval;
var _c;
__turbopack_context__.k.register(_c, "TripApproval");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_b8caaf98._.js.map