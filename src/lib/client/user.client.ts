import type { Result } from "$lib/interfaces";
import ky from "ky";
import { Client } from "./index.client";

export const UserClient = {
  change_password: async (new_pass: string) =>
    Client.request(
      () =>
        ky
          .put<
            Result<undefined, string>
          >("/api/user/password", { json: { new_pass } })
          .json(),
      { toast: { suc_msg: "Password changed" } },
    ),
};
