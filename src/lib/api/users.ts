import type { PaginatedResponse, UserInsertType, UserSelectType, UserUpdateType } from "$lib/types";
import { apiFetch } from "./client";

const base = '/api/users';

export const usersApi = {
  list(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<UserSelectType>> {
    const query = new URLSearchParams();

    if (params?.page) query.set('page', String(params.page));
    if (params?.size) query.set('size', String(params.size));

    return apiFetch<PaginatedResponse<UserSelectType>>(
      `${base}?${query.toString()}`
    );
  },

  get(id: string): Promise<UserSelectType> {
    return apiFetch<UserSelectType>(`${base}/${id}`);
  },

  create(data: UserInsertType) {
    return apiFetch(`${base}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UserUpdateType) {
    return apiFetch(`${base}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return apiFetch(`${base}/${id}`, {
      method: 'DELETE',
    });
  }
}