import type { SID, Timestamps } from "$lib/interfaces";
import { get, type Writable } from "svelte/store";

const get_by_id = <R extends SID<{}>>(
  store: Writable<R[]>,
  _id: string | undefined,
) => (_id ? get(store).find((s) => s._id === _id) : undefined);

export const Stores = {
  get_by_id,

  create: <R extends SID<{}>>(store: Writable<R[]>, resource: R) =>
    store.set([...get(store), resource]),

  patch: <R extends SID<{}>>(
    store: Writable<R[]>,
    resource: SID<Partial<R & Timestamps>>,
  ) => {
    const old = get_by_id(store, resource._id);
    if (!old) {
      throw new Error("Resource not found");
    }

    store.set(
      get(store).map((s) =>
        s._id === resource._id ? { ...old, ...resource } : s,
      ),
    );
  },

  delete: <R extends SID<{}>>(store: Writable<R[]>, _id: string) =>
    store.set(get(store).filter((s) => s._id !== _id)),
};
