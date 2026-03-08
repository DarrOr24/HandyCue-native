const MIN_LENGTH = 8
const MAX_LENGTH = 72

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < MIN_LENGTH) {
    return { valid: false, message: `Password must be at least ${MIN_LENGTH} characters` }
  }
  if (password.length > MAX_LENGTH) {
    return { valid: false, message: `Password must be at most ${MAX_LENGTH} characters` }
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}
