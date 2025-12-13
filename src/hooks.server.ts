import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname === '/super-admin') {
        redirect(307, '/super-admin/organizations');
    }
    return resolve(event);
}