export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateBlogCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
}
