export type Hymn = {
  id: number;
  category: string;
  category_id: number;
  name: string;
  verses: { text: string }[];
  file_name?: string; // Optional field for audio file name
};