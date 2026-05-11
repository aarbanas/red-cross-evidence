import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/**
 * Generate a random password and return the hashed version
 * @returns Promise<{password: string, hashedPassword: string}>
 */
export const generateRandomHashedPassword = async (): Promise<{
  password: string
  hashedPassword: string
}> => {
  // Generate a random password (16 characters, alphanumeric + special chars)
  const password = crypto.randomBytes(12).toString('base64')

  // Hash the password
  const hashedPassword = await hashPassword(password)

  return { password, hashedPassword }
}

/**
 * Hash a password
 * @param password - The password to hash
 * @returns Promise<string> - The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a password with a hashed password
 * @param password - The plain password
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}
