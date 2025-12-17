import type { PaginatedResponse, QueryParams, UserInsertType, UserSelectType, UserUpdateType } from "$lib/types";
import { apiFetch, buildQuery } from "./client";

const base = '/api/users';

export const usersApi = {
  list(params?: QueryParams): Promise<PaginatedResponse<UserSelectType>> {
    return apiFetch<PaginatedResponse<UserSelectType>>(
      `${base}${buildQuery(params)}`
    );
  },

  get(id: string): Promise<UserSelectType> {
    return apiFetch<UserSelectType>(`${base}/${id}`);
  },

  create(data: UserInsertType) {
    return apiFetch(`/api/admin/user`, {
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