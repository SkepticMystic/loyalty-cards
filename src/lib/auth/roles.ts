export const ROLES = ["stamper", "admin", "owner"] as const;
export type Role = (typeof ROLES)[number];
