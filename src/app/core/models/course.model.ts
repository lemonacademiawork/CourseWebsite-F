export interface Course {
  id: string;
  title: string;
  category: string;
  categorySlug?: string;
  instructor: string;
  description: string;
  imageUrl: string;
  price: number;
  studentsCount?: number;
  progress?: number;
  lessonsCompleted?: number;
  totalLessons?: number;
}
