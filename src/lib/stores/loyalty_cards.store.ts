import type { SID } from "$lib/interfaces";
import type { LoyaltyCard } from "$lib/models/LoyaltyCards";
import { get, writable } from "svelte/store";
import { Stores } from "./index.store";

const store = writable<SID<LoyaltyCard>[]>([]);

export const loyalty_cards = {
  ...store,

  get_by_id: (loyalty_card_id: string) =>
    Stores.get_by_id(store, loyalty_card_id),

  get_by_brand_id: (brand_id: string) =>
    get(store).filter((c) => c.brand_id === brand_id),
};
