'use server';

import { AuthError } from 'next-auth';
import { signIn } from '~/server/auth';

export async function loginAction(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/users',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Email ili lozinka nisu ispravni.';
    }

    throw error;
  }

  return null;
}
