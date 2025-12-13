import type { OrganizationInsert, OrganizationSelect, OrganizationUpdate } from "$lib/types";
import { apiFetch } from "./client";

const base = '/api/organizations';

export const organizationsApi = {
  list(): Promise<OrganizationSelect[]> {
    return apiFetch<OrganizationSelect[]>(`${base}`);
  },

  get(id: string): Promise<OrganizationSelect> {
    return apiFetch<OrganizationSelect>(`${base}/${id}`);
  },

  create(data: OrganizationInsert) {
    return apiFetch(`${base}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: OrganizationUpdate) {
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