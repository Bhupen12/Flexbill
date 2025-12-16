import { redirect, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ locals }) => {
  try {
    await locals.supabase.auth.signOut()
  } catch (err) {
    console.error('Failed to sign out:', err)
  }
  throw redirect(303, '/signin')
}
