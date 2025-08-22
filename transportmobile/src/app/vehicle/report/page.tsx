"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Chart from 'chart.js/auto'; // Import Chart.js

// Define a type for chart data for better type safety, if needed
interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    borderColor?: string;
    backgroundColor: string | string[];
    borderWidth?: number;
    tension?: number;
    pointRadius?: number;
    pointBackgroundColor?: string;
    cutout?: string; 
  }[];
}

// Ensure Chart.js is not animated by default, if desired globally
// This is typically done once at the application entry point, but placed here for direct translation.
// Chart.defaults.animation = false; // Uncomment if you want to apply this globally

export default function VehicleReport() {
  // Refs for the canvas elements
  const tripsLineChartRef = useRef<HTMLCanvasElement>(null);
  const expenseRentChartRef = useRef<HTMLCanvasElement>(null);
  const optimizedChart1Ref = useRef<HTMLCanvasElement>(null);
  const optimizedChart2Ref = useRef<HTMLCanvasElement>(null);
  const optimizedChart3Ref = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);

  // Data for the charts (can be fetched from API or managed by state in a real app)
  const tripData = {
    vehicleNumber: "TN 20 SN 1298",
    tripReport: {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      data: [120, 150, 180, 100, 200, 170],
    },
    profitReport: {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      expenseData: [50000, 60000, 55000, 70000, 75000, 72000],
      rentData: [40000, 45000, 47000, 50000, 52000, 53000],
    },
    dueDaysReport: [
      { id: 'optimizedChart1', percent: 20, color: '#f97316', label: 'Permit Due', days: '20 Days' },
      { id: 'optimizedChart2', percent: 43, color: '#3b82f6', label: 'FC Permit', days: '43 Days' },
      { id: 'optimizedChart3', percent: 72, color: '#10b981', label: 'Pollution', days: '72 Days' },
    ],
    ownershipReport: {
      labels: ['Ramesh', 'Suresh', 'Ganesh'],
      data: [30, 40, 30],
      colors: ['#f97316', '#3b82f6', '#10b981'],
    },
  };

  // Function to create an optimized Doughnut Chart
  const makeOptimizedDoughnut = useCallback((canvas: HTMLCanvasElement, percent: number, color: string) => {
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: [color, '#e5e7eb'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '70%',
        responsive: false, // Disable responsive behavior for fixed size
        maintainAspectRatio: false,
        animation: {
          duration: 0 // Disable animations
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        interaction: {
          intersect: false,
          mode: 'nearest'
        }
      }
    });
  }, []); // Empty dependency array as this function doesn't depend on props/state that change

  // Effect to render charts after component mounts
  useEffect(() => {
    // Trip Report Line Chart
    if (tripsLineChartRef.current) {
      new Chart(tripsLineChartRef.current, {
        type: 'line',
        data: {
          labels: tripData.tripReport.labels,
          datasets: [{
            label: 'Trips',
            data: tripData.tripReport.data,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#10b981'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: '#f3f4f6' } },
            y: { beginAtZero: true, grid: { color: '#f3f4f6' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // Profit Report Line Chart
    if (expenseRentChartRef.current) {
      new Chart(expenseRentChartRef.current, {
        type: 'line',
        data: {
          labels: tripData.profitReport.labels,
          datasets: [
            {
              label: 'Expense',
              data: tripData.profitReport.expenseData,
              borderColor: '#ef4444',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 3,
              pointBackgroundColor: '#ef4444'
            },
            {
              label: 'Rent',
              data: tripData.profitReport.rentData,
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 3,
              pointBackgroundColor: '#10b981'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: '#f3f4f6' } },
            y: { beginAtZero: true, grid: { color: '#f3f4f6' } }
          },
          plugins: {
            legend: { labels: { font: { size: 12 } } }
          }
        }
      });
    }

    // Due Days Report Doughnut Charts
    if (optimizedChart1Ref.current) {
      makeOptimizedDoughnut(optimizedChart1Ref.current, tripData.dueDaysReport[0].percent, tripData.dueDaysReport[0].color);
    }
    if (optimizedChart2Ref.current) {
      makeOptimizedDoughnut(optimizedChart2Ref.current, tripData.dueDaysReport[1].percent, tripData.dueDaysReport[1].color);
    }
    if (optimizedChart3Ref.current) {
      makeOptimizedDoughnut(optimizedChart3Ref.current, tripData.dueDaysReport[2].percent, tripData.dueDaysReport[2].color);
    }

    // Ownership Report Pie Chart
    if (pieChartRef.current) {
      new Chart(pieChartRef.current, {
        type: 'pie',
        data: {
          labels: tripData.ownershipReport.labels,
          datasets: [{
            data: tripData.ownershipReport.data,
            backgroundColor: tripData.ownershipReport.colors,
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: false, // For fixed size as per original
          maintainAspectRatio: false,
          animation: { duration: 0 },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 14
                }
              }
            }
          }
        }
      });
    }

    // Cleanup function for charts (important to prevent memory leaks)
    return () => {
      // Destroy existing chart instances on component unmount
      Chart.getChart(tripsLineChartRef.current!)?.destroy();
      Chart.getChart(expenseRentChartRef.current!)?.destroy();
      Chart.getChart(optimizedChart1Ref.current!)?.destroy();
      Chart.getChart(optimizedChart2Ref.current!)?.destroy();
      Chart.getChart(optimizedChart3Ref.current!)?.destroy();
      Chart.getChart(pieChartRef.current!)?.destroy();
    };
  }, [tripData, makeOptimizedDoughnut]); // Re-run effect if tripData or makeOptimizedDoughnut changes (though makeOptimizedDoughnut is memoized)

  const handleBackButtonClick = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <main>
      <header
        className="fixed top-0 left-0 right-0 w-full z-20 flex items-center px-4 bg-white border-b border-gray-200 shadow-sm h-14"
      >
        <button className="text-gray-800 mr-2" onClick={handleBackButtonClick}>
          <i className="ri-arrow-left-line text-2xl"></i>
        </button>
        <span className="font-semibold text-gray-800 text-lg">{tripData.vehicleNumber}</span>
      </header>
      <div className="min-h-screen flex flex-col pt-16 bg-[#f3f3f3]">
        <div className="h-auto max-h-[calc(100vh-100px)] overflow-y-auto flex-1">
          <div className="mt-2 mx-4 flex flex-col">

            <span className="m-2 text-gray-700 font-semibold">Trip Report</span>
            <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <canvas id="tripsLineChart" ref={tripsLineChartRef} className="w-full h-48"></canvas>
            </div>

            <span className="mt-2 text-gray-700 font-semibold">Profit Report</span>
            <div
              className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <canvas id="expenseRentChart" ref={expenseRentChartRef} className="w-full h-48"></canvas>
            </div>

            <span className="mt-2 text-gray-700 font-semibold">Due Days Report</span>
            <div className="mt-8 mb-8">
              <div className="grid grid-cols-3 gap-4 text-sm">
                {tripData.dueDaysReport.map((report, index) => (
                  <div key={report.id} className="flex flex-col items-center bg-white p-4 rounded-2xl shadow">
                    {/* Set width and height explicitly for Doughnut charts for consistent rendering */}
                    <canvas id={report.id} ref={
                      index === 0 ? optimizedChart1Ref :
                      index === 1 ? optimizedChart2Ref :
                      optimizedChart3Ref
                    } width="80" height="80"></canvas>
                    <span className="mt-2 text-center text-gray-700">{report.label}<br/><strong>{report.days}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            <span className="mt-2 text-gray-700 font-semibold">Ownership Report</span>
            <div className="product-list mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <center><canvas id="pieChart" ref={pieChartRef} width="300" height="300"></canvas></center>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}