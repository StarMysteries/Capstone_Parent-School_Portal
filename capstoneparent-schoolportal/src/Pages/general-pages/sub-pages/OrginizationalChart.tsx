import { EditOrganizationalChartModal } from "@/components/admin/EditOrganizationalChartModal";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { getAuthUser } from "@/lib/auth";
import { type OrganizationalChartItem } from "@/lib/organizationalChartContent";
import { pagesApi } from "@/lib/api/pagesApi";
import { resolveMediaUrl } from "@/lib/api/base";
import { Pencil, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const fabClassName =
  "inline-flex h-20 w-20 items-center justify-center rounded-full bg-(--button-green) text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-(--button-green)/40";

const ChartPreview = ({
  imageUrl,
  year,
}: {
  imageUrl: string;
  year: string;
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError || !imageUrl) {
    return (
      <div className="flex min-h-130 w-full items-center justify-center rounded-sm bg-white p-8 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-700">
            Chart file not found
          </p>
          <p className="mt-2 text-lg text-gray-600">
            School Year {year} has no organizational chart image uploaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={resolveMediaUrl(imageUrl)}
      alt={`Organizational Chart ${year}`}
      onError={() => setHasImageError(true)}
      className="h-auto w-full rounded-sm bg-white object-contain"
    />
  );
};

export const OrginizationalChart = () => {
  const user = getAuthUser();
  const isAdmin = user?.role === "admin" || user?.role === "principal";

  const [charts, setCharts] = useState<OrganizationalChartItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const loadCharts = () =>
    pagesApi.getOrgCharts().then((data) => {
      setCharts(data);
      if (data.length > 0) {
        setSelectedYear((prev) => {
          if (prev && data.some((c) => c.year === prev)) {
            return prev;
          }
          return data[0].year;
        });
      } else {
        setSelectedYear(null);
      }
    });

  useEffect(() => {
    loadCharts().catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const selectedChart =
    charts.find((chart) => chart.year === selectedYear) ?? charts[0];

  const handleSaveOrgChart = async (
    chart: OrganizationalChartItem,
    file?: File,
  ) => {
    try {
      await pagesApi.updateOrgChart(chart, file);
      await loadCharts();
      setAddModalOpen(false);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save organizational chart", error);
    }
  };

  return (
    <div>
      <RoleAwareNavbar />
      <div className="mx-auto max-w-7xl px-4 py-12">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : !selectedChart ? (
          <>
            <h1 className="mb-8 text-4xl font-bold">Organizational Chart</h1>
            <p>No organizational chart data available.</p>
            {isAdmin && (
              <div className="fixed bottom-8 right-8 flex flex-col gap-3">
                <button
                  type="button"
                  className={fabClassName}
                  onClick={() => setAddModalOpen(true)}
                  aria-label="Add organizational chart"
                >
                  <Plus className="h-10 w-10" />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-8">Organizational Chart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="w-full rounded-sm bg-gray-300 p-8">
                  <ChartPreview
                    imageUrl={selectedChart.imageUrl}
                    year={selectedChart.year}
                  />
                </div>
                <p className="text-center font-bold mt-4">
                  School Year {selectedYear}
                </p>
              </div>

              <div className="lg:col-span-1 flex lg:block lg:w-full w-fit mx-auto">
                <div>
                  <h3 className="font-bold text-lg mb-4">Year</h3>
                  <div className="space-y-2">
                    {charts.map((chart: OrganizationalChartItem) => (
                      <button
                        key={chart.year}
                        type="button"
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
              <div className="fixed bottom-8 right-8 flex flex-col gap-3">
                <button
                  type="button"
                  className={fabClassName}
                  onClick={() => setAddModalOpen(true)}
                  aria-label="Add organizational chart"
                >
                  <Plus className="h-10 w-10" />
                </button>
                <button
                  type="button"
                  className={fabClassName}
                  onClick={() => setEditModalOpen(true)}
                  aria-label="Edit organizational chart"
                >
                  <Pencil className="h-10 w-10" />
                </button>
              </div>
            )}
          </>
        )}

        {isAdmin && (
          <EditOrganizationalChartModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            mode="add"
            charts={charts}
            onSave={handleSaveOrgChart}
          />
        )}
        {isAdmin && selectedChart && (
          <EditOrganizationalChartModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            mode="edit"
            charts={charts}
            editYear={selectedChart.year}
            onSave={handleSaveOrgChart}
          />
        )}
      </div>
    </div>
  );
};
