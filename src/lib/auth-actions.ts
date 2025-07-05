'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '../../utils/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  return redirect('/')
}
export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const signupData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    displayName: formData.get('displayName') as string,
    username: formData.get('username') as string,
  }

  // 1. Check username availability
  const { data: existingUser, error: usernameError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', signupData.username.toLowerCase())
    .maybeSingle()

  if (usernameError || existingUser) {
    return redirect('/signup?error=' + encodeURIComponent('Username taken'))
  }

  // 2. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: signupData.email,
    password: signupData.password,
    options: {
      data: {
        display_name: signupData.displayName,
        username: signupData.username,
      },
    },
  })

  if (authError) {
    return redirect('/signup?error=' + encodeURIComponent(authError.message))
  }

  // 3. Create profile
  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      username: signupData.username.toLowerCase(),
      display_name: signupData.displayName,
      email: signupData.email,
    })

    if (profileError) {
      // Attempt to clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return redirect(
        '/signup?error=' + encodeURIComponent('Profile creation failed'),
      )
    }
  }

  revalidatePath('/', 'layout')
  return redirect('/verify-email')
}
