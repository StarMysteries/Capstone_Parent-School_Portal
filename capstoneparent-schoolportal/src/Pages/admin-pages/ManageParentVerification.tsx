import { useCallback, useEffect, useMemo, useState } from "react";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { StatusDropdown } from "../../components/general/StatusDropdown";
import {
  ParentsVerificationModal,
  type ParentVerificationRecord,
} from "@/components/admin/ParentsVerificationModal";
import {
  parentsApi,
  normalizeRegistration,
  type ParentRegistrationStatus,
} from "@/lib/api/parentsApi";

type VerificationStatus = ParentVerificationRecord["status"];

const isVerificationStatus = (
  value: ParentRegistrationStatus | "all",
): value is VerificationStatus => value !== "all";

export const ManageParentVerification = () => {
  const [verifications, setVerifications] = useState<ParentVerificationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParentRegistrationStatus | "all">("all");
  const [dateFilterDays, setDateFilterDays] = useState<3 | 7 | null>(null);
  const [selectedVerificationId, setSelectedVerificationId] = useState<number | null>(null);
  const [modalRemarks, setModalRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedVerification = useMemo(
    () =>
      verifications.find((verification) => verification.id === selectedVerificationId) ??
      null,
    [selectedVerificationId, verifications],
  );

  const formatDate = (value: string) => {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parsedDate);
  };

  const loadRegistrations = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await parentsApi.getRegistrations(statusFilter);
      setVerifications(response.data.map(normalizeRegistration));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load parent registrations",
      );
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void loadRegistrations();
  }, [loadRegistrations]);

  useEffect(() => {
    if (selectedVerificationId !== null && !selectedVerification) {
      setSelectedVerificationId(null);
      setModalRemarks("");
    }
  }, [selectedVerification, selectedVerificationId]);

  const filteredVerifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const now = Date.now();
    const cutoffMs =
      dateFilterDays !== null ? now - dateFilterDays * 24 * 60 * 60 * 1000 : null;

    let filtered = verifications.filter((verification) => {
      if (!query) return true;

      return [
        verification.parentName,
        verification.contactNumber,
        verification.address,
        verification.studentNames.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    if (cutoffMs !== null) {
      filtered = filtered.filter((verification) => {
        const submittedAt = new Date(verification.submittedAt).getTime();
        return !Number.isNaN(submittedAt) && submittedAt >= cutoffMs;
      });
    }

    return filtered;
  }, [verifications, searchQuery, dateFilterDays]);

  const getStatusColor = (status: VerificationStatus) => {
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

  const openVerification = (verification: ParentVerificationRecord) => {
    setSelectedVerificationId(verification.id);
    setModalRemarks(verification.remarks ?? "");
  };

  const closeVerification = () => {
    setSelectedVerificationId(null);
    setModalRemarks("");
  };

  const updateVerification = async (nextStatus: "VERIFIED" | "DENIED") => {
    if (!selectedVerification) return;

    try {
      await parentsApi.verifyRegistration(selectedVerification.id, {
        status: nextStatus,
        remarks: modalRemarks.trim() || undefined,
      });
      await loadRegistrations();
      closeVerification();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update verification",
      );
    }
  };

  return (
    <div className="min-h-screen">
      <RoleAwareNavbar />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Manage Parent Verification</h1>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <StatusDropdown
                value={isVerificationStatus(statusFilter) ? statusFilter : "all"}
                onChange={(value) =>
                  setStatusFilter(value === "all" ? "all" : (value as ParentRegistrationStatus))
                }
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDateFilterDays((current) => (current === 7 ? null : 7))}
                  className={`rounded-md px-4 py-2 font-semibold text-white transition-colors ${
                    dateFilterDays === 7
                      ? "bg-[#d8d42f] text-black hover:bg-[#e3df44]"
                      : "bg-(--button-green) hover:bg-(--button-hover-green)"
                  }`}
                >
                  7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilterDays((current) => (current === 3 ? null : 3))}
                  className={`rounded-md px-4 py-2 font-semibold text-white transition-colors ${
                    dateFilterDays === 3
                      ? "bg-[#d8d42f] text-black hover:bg-[#e3df44]"
                      : "bg-(--button-green) hover:bg-(--button-hover-green)"
                  }`}
                >
                  3 Days
                </button>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Parent Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Date Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      Loading parent registrations...
                    </td>
                  </tr>
                ) : filteredVerifications.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      No verifications found
                    </td>
                  </tr>
                ) : (
                  filteredVerifications.map((verification) => (
                    <tr
                      key={verification.id}
                      className="cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                      onClick={() => openVerification(verification)}
                    >
                      <td className="px-6 py-4">{verification.parentName}</td>
                      <td className={`px-6 py-4 font-bold ${getStatusColor(verification.status)}`}>
                        {verification.status === "PENDING"
                          ? "Pending Verification"
                          : verification.status}
                      </td>
                      <td className="px-6 py-4">{formatDate(verification.submittedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ParentsVerificationModal
        isOpen={Boolean(selectedVerification)}
        verification={selectedVerification}
        remarks={modalRemarks}
        onRemarksChange={setModalRemarks}
        onApprove={() => void updateVerification("VERIFIED")}
        onDeny={() => void updateVerification("DENIED")}
        onClose={closeVerification}
      />
    </div>
  );
};
