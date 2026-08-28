import type { Access, FieldAccess } from 'payload'

// Declared locally rather than imported from the generated payload-types so that
// access control still type-checks before the first `generate:types` run.
type MaybeUser = { id: number | string; role?: 'admin' | 'editor' | null } | null | undefined

export const isAdmin = (user: MaybeUser): boolean => user?.role === 'admin'

/** Anyone may read published documents; authenticated staff may read drafts too. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

/** Admins manage everyone; editors may only read and update their own record. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true

  return {
    id: {
      equals: user.id,
    },
  }
}

export const adminFieldOnly: FieldAccess = ({ req: { user } }) => isAdmin(user)

export const anyone: Access = () => true
