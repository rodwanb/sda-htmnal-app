export type Hymn = {
  id: number;
  category: string;
  category_id: number;
  name: string;
  verses: { text: string }[];
};