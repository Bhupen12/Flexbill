import { createServerClient } from "@supabase/ssr";
import { error, type Handle } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";

export const handle: Handle = async ({ event, resolve }) => {

  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return event.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          event.cookies.set(name, value, { ...options, path: '/' })
        )
      },
    }
  })

   event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      return { session: null, user: null }
    }
    return { session, user }
  }

  const { user } = await event.locals.safeGetSession();
  if(user){
    const dbUser = await db.query.users.findFirst({
      where: and(
        eq(users.auth_uid, user.id),
        eq(users.is_active, true),
        eq(users.is_deleted, false)
      ),
      columns: {
        id: true,
        role: true,
        email: true,
        organization_id: true
      }
    })
    event.locals.userProfile = dbUser || null;
  } else {
    event.locals.userProfile = null
  }

  const { pathname } = event.url;
  if (pathname.startsWith('/api/')){
    if(!event.locals.userProfile){
      return error(401, 'Unauthorized')
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}