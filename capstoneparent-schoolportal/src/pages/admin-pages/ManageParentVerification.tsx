import { useState, useMemo } from "react";
import { NavbarAdmin } from "../../components/admin/NavbarAdmin";
import { StatusDropdown } from "../../components/general/StatusDropdown";

interface ParentVerification {
  id: number;
  parentName: string;
  status: "PENDING" | "DENIED" | "VERIFIED";
  dateSubmitted: string;
}

export const ManageParentVerification = () => {
  // Sample data - replace with actual data from your backend
  const [verifications] = useState<ParentVerification[]>([
    { id: 1, parentName: "Jane Doe", status: "PENDING", dateSubmitted: "03/12/2025" },
    { id: 2, parentName: "John Bramble", status: "DENIED", dateSubmitted: "03/12/2025" },
    { id: 3, parentName: "Jina Ling", status: "VERIFIED", dateSubmitted: "03/7/2025" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateSort, setDateSort] = useState<"asc" | "desc" | null>(null);

  // Filtered and sorted verifications
  const filteredVerifications = useMemo(() => {
    let filtered = verifications.filter((verification) =>
      verification.parentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    // Sort by date if applicable
    if (dateSort) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.dateSubmitted);
        const dateB = new Date(b.dateSubmitted);
        return dateSort === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  }, [verifications, searchQuery, statusFilter, dateSort]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-(--status-pending)";
      case "DENIED":
        return "text-(--status-denied)";
      case "VERIFIED":
        return "text-(--status-verified)";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div className="min-h-screen">
      <NavbarAdmin />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Parent Verification</h1>
            <div className="flex gap-4 items-center">
              <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              <StatusDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "Status" },
                  {
                    value: "PENDING",
                    label: "Pending",
                    className: "text-(--status-pending)",
                  },
                  {
                    value: "DENIED",
                    label: "Denied",
                    className: "text-(--status-denied)",
                  },
                  {
                    value: "VERIFIED",
                    label: "Verified",
                    className: "text-(--status-verified)",
                  },
                ]}
              />
              <button
              onClick={() => setDateSort(dateSort === "asc" ? "desc" : "asc")}
              className="bg-(--button-green) text-white font-semibold px-6 py-2 rounded-md hover:bg-(--button-hover-green) transition-colors"
            >
              Date
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Parent Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Date Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      No verifications found
                    </td>
                  </tr>
                ) : (
                  filteredVerifications.map((verification) => (
                    <tr key={verification.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6">{verification.parentName}</td>
                      <td className={`py-4 px-6 font-bold ${getStatusColor(verification.status)}`}>
                        {verification.status}
                      </td>
                      <td className="py-4 px-6">{verification.dateSubmitted}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};