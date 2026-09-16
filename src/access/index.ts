import type { Access, FieldAccess } from 'payload'

type StaffUser = {
  id?: number | string
  role?: 'admin' | 'editor' | null
}

export const isAdmin = (user: StaffUser | null | undefined): boolean => user?.role === 'admin'

export const isStaff = (user: StaffUser | null | undefined): boolean =>
  user?.role === 'admin' || user?.role === 'editor'

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user as StaffUser)

export const staffOnly: Access = ({ req: { user } }) => isStaff(user as StaffUser)

export const anyone: Access = () => true

export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (isStaff(user as StaffUser)) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

export const adminField: FieldAccess = ({ req: { user } }) => isAdmin(user as StaffUser)

export const staffField: FieldAccess = ({ req: { user } }) => isStaff(user as StaffUser)

export const authenticatedSelfOrAdmin: Access = ({ req: { user } }) => {
  if (isAdmin(user as StaffUser)) return true
  if (user?.id) {
    return {
      id: {
        equals: user.id,
      },
    }
  }
  return false
}
