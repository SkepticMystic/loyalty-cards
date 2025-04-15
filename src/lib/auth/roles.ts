export const ROLES = [
  /** Regular user, _gets_ stamps */
  "member",
  "stamper",
  "admin",
  "owner",
] as const;
export type Role = (typeof ROLES)[number];
