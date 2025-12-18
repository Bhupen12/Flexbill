import type { PaginatedResponse, ProductInsertType, ProductSelectType, ProductUpdateType, QueryParams } from "$lib/types";
import { apiFetch, buildQuery } from "./client";

const base = '/api/products';

export const productsApi = {
  list(params?: QueryParams): Promise<PaginatedResponse<ProductSelectType>> {
    return apiFetch<PaginatedResponse<ProductSelectType>>(
      `${base}${buildQuery(params)}`
    );
  },

  get(id: string): Promise<ProductSelectType> {
    return apiFetch<ProductSelectType>(`${base}/${id}`);
  },

  create(data: ProductInsertType): Promise<ProductSelectType> {
    return apiFetch<ProductSelectType>(`${base}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: ProductUpdateType): Promise<ProductSelectType> {
    return apiFetch<ProductSelectType>(`${base}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  remove(id: string): Promise<void> {
    return apiFetch<void>(`${base}/${id}`, {
      method: 'DELETE',
    });
  }
}