import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { getAuthUser } from "@/lib/auth";
import {
  getOrganizationalCharts,
  type OrganizationalChartItem,
} from "@/lib/organizationalChartContent";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ChartPreview = ({ imageUrl, year }: { imageUrl: string; year: string }) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return (
      <div className="flex min-h-130 w-full items-center justify-center rounded-sm bg-white p-8 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-700">Chart file not found</p>
          <p className="mt-2 text-lg text-gray-600">
            Add the file for School Year {year} in public/ to display it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`Organizational Chart ${year}`}
      onError={() => setHasImageError(true)}
      className="h-auto w-full rounded-sm bg-white object-contain"
    />
  );
};

export const OrginizationalChart = () => {
  const user = getAuthUser();
  const isAdmin = user?.role === "admin";
  const charts = getOrganizationalCharts();

  const [selectedYear, setSelectedYear] = useState(charts[0]?.year ?? "2025");
  const selectedChart =
    charts.find((chart) => chart.year === selectedYear) ?? charts[0];

  if (!selectedChart) {
    return (
      <div>
        <RoleAwareNavbar />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="mb-8 text-4xl font-bold">Organizational Chart</h1>
          <p>No organizational chart data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <RoleAwareNavbar />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Organizational Chart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart - takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <div className="w-full rounded-sm bg-gray-300 p-8">
              <ChartPreview imageUrl={selectedChart.imageUrl} year={selectedChart.year} />
            </div>
            <p className="text-center font-bold mt-4">School Year {selectedYear}</p>
          </div>
          
          {/* Year selector - takes 1 column on large screens, full width on mobile */}
          <div className="lg:col-span-1 flex lg:block lg:w-full w-fit mx-auto">
            <div>
              <h3 className="font-bold text-lg mb-4">Year</h3>
              <div className="space-y-2">
                {charts.map((chart: OrganizationalChartItem) => (
                  <button
                    key={chart.year}
                    onClick={() => setSelectedYear(chart.year)}
                    className={`block w-full text-left py-2 px-3 rounded transition ${
                      selectedYear === chart.year
                        ? "bg-blue-500 text-white font-semibold"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {chart.year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Link
            to={`/editorganizationalchart?year=${selectedYear}`}
            className="fixed bottom-8 right-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-(--button-green) text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Add Organizational Chart"
          >
            <Plus className="h-10 w-10" />
          </Link>
        )}
      </div>
    </div>
  );
};