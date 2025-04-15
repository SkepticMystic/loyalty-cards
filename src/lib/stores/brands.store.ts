import type { Brand } from "$lib/models/Brands";
import { writable } from "svelte/store";
import { Stores } from "./index.store";
import type { SID } from "$lib/interfaces";

const store = writable<SID<Brand>[]>([]);

export const brands = {
  ...store,

  get_by_id: (brand_id: string) => Stores.get_by_id(store, brand_id),
};
