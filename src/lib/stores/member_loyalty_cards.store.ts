import type { MemberLoyaltyCard } from "$lib/models/MemberLoyaltyCards";
import { get, writable } from "svelte/store";

const store = writable<MemberLoyaltyCard[]>([]);

export const member_loyalty_cards = {
  ...store,

  get_by_brand_id: (brand_id: string) =>
    get(store).filter((c) => c.brand_id === brand_id),
};
