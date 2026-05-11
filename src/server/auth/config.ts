import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { compare } from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { DefaultSession, NextAuthConfig } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '~/server/db'
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from '~/server/db/schema'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (!user?.active || !user?.password) return null

        const isValid = await compare(password, user.password)
        if (!isValid) return null

        // Return user object with required fields for NextAuth
        return {
          id: user.id,
          email: user.email,
          name: user.email, // Use email as name if no name field exists
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users as any,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id
      }

      return token
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
      },
    }),
  },
} satisfies NextAuthConfig
