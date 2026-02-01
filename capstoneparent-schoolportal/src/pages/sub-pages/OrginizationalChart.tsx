import { Navbar } from "@/components/Navbar";
import { useState } from "react";

export const OrginizationalChart = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const years = ["2025", "2024", "2023", "2022", "2021"];

  {/*Placeholder for images */}
  const colorMap: Record<string, string> = {
    "2025": "bg-green-300",
    "2024": "bg-blue-300",
    "2023": "bg-purple-300",
    "2022": "bg-pink-300",
    "2021": "bg-yellow-300",
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Organizational Chart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart - takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <div className={`w-full h-170 ${colorMap[selectedYear]} transition-colors duration-300`}></div>
            <p className="text-center font-bold mt-4">School Year {selectedYear}</p>
          </div>
          
          {/* Year selector - takes 1 column on large screens, full width on mobile */}
          <div className="lg:col-span-1 flex lg:block lg:w-full w-fit mx-auto">
            <div>
              <h3 className="font-bold text-lg mb-4">Year</h3>
              <div className="space-y-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`block w-full text-left py-2 px-3 rounded transition ${
                      selectedYear === year
                        ? "bg-blue-500 text-white font-semibold"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};