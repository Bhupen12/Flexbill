import type { UserInsertType, UserSelectType, UserUpdateType } from "$lib/types";
import { apiFetch } from "./client";

const base = '/api/users';

export const usersApi = {
  list(): Promise<UserSelectType[]> {
    return apiFetch<UserSelectType[]>(`${base}`);
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