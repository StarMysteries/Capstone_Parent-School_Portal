export interface HistoryContent {
  title: string;
  imageUrl: string;
  imageFileName?: string;
  body: string;
}

export const DEFAULT_HISTORY_CONTENT: HistoryContent = {
  title: "",
  imageUrl: "",
  imageFileName: "",
  body: "",
};