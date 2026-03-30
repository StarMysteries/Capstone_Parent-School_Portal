export interface OrganizationalChartItem {
  year: string;
  imageUrl: string;
  fileName?: string;
}

const STORAGE_KEY = "organizational-chart-content";

export const DEFAULT_ORGANIZATIONAL_CHARTS: OrganizationalChartItem[] = [
  {
    year: "2025",
    imageUrl: "/organizational-chart-2025.png",
    fileName: "organizational-chart-2025.png",
  },
  {
    year: "2024",
    imageUrl: "/organizational-chart-2024.png",
    fileName: "organizational-chart-2024.png",
  },
  {
    year: "2023",
    imageUrl: "/organizational-chart-2023.png",
    fileName: "organizational-chart-2023.png",
  },
  {
    year: "2022",
    imageUrl: "/organizational-chart-2022.png",
    fileName: "organizational-chart-2022.png",
  },
  {
    year: "2021",
    imageUrl: "/organizational-chart-2021.png",
    fileName: "organizational-chart-2021.png",
  },
];

function getFileNameFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] || "organizational-chart-image";
}

function normalizeItem(
  item: Partial<OrganizationalChartItem>,
  fallback: OrganizationalChartItem,
): OrganizationalChartItem {
  return {
    year: typeof item.year === "string" && item.year ? item.year : fallback.year,
    imageUrl:
      typeof item.imageUrl === "string" && item.imageUrl
        ? item.imageUrl
        : fallback.imageUrl,
    fileName:
      typeof item.fileName === "string" && item.fileName
        ? item.fileName
        : getFileNameFromUrl(
            typeof item.imageUrl === "string" && item.imageUrl
              ? item.imageUrl
              : fallback.imageUrl,
          ),
  };
}

function normalizeCharts(raw: unknown): OrganizationalChartItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_ORGANIZATIONAL_CHARTS;
  }

  return DEFAULT_ORGANIZATIONAL_CHARTS.map((defaultItem) => {
    const maybeItem = raw.find(
      (item) =>
        typeof item === "object" &&
        item != null &&
        "year" in item &&
        (item as { year?: unknown }).year === defaultItem.year,
    ) as Partial<OrganizationalChartItem> | undefined;

    return normalizeItem(maybeItem ?? defaultItem, defaultItem);
  });
}

export function getOrganizationalCharts(): OrganizationalChartItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_ORGANIZATIONAL_CHARTS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_ORGANIZATIONAL_CHARTS),
      );
      return DEFAULT_ORGANIZATIONAL_CHARTS;
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeCharts(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_ORGANIZATIONAL_CHARTS),
    );
    return DEFAULT_ORGANIZATIONAL_CHARTS;
  }
}

export function updateOrganizationalChart(
  updatedItem: OrganizationalChartItem,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const charts = getOrganizationalCharts();
  const next = charts.map((chart) =>
    chart.year === updatedItem.year ? normalizeItem(updatedItem, chart) : chart,
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}