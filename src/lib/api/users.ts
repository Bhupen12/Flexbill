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

  create(data: UserInsertType): Promise<UserSelectType> {
    return apiFetch<UserSelectType>(`/api/admin/user`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UserUpdateType): Promise<UserSelectType> {
    return apiFetch<UserSelectType>(`${base}/${id}`, {
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