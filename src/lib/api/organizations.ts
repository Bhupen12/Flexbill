import type { OrganizationInsert, OrganizationSelect, OrganizationUpdate, PaginatedResponse, QueryParams } from "$lib/types";
import { apiFetch, buildQuery } from "./client";

const base = '/api/organizations';

export const organizationsApi = {
  list(params?: QueryParams): Promise<PaginatedResponse<OrganizationSelect>> {
    return apiFetch<PaginatedResponse<OrganizationSelect>>(
      `${base}${buildQuery(params)}`
    );
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