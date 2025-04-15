import type { Result } from "$lib/interfaces";
import { err } from "$lib/utils";
import { get_http_error_msg } from "$lib/utils/errors";
import { toast } from "svelte-daisyui-toast";

export const Client = {
  request: async <D = unknown>(
    cb: () => Promise<Result<D, string>>,
    options?: { toast?: { suc_msg?: string } },
  ) => {
    toast.set([]);

    try {
      const res = await cb();

      if (res.ok) {
        if (options?.toast?.suc_msg) {
          toast.success(options.toast.suc_msg, {
            duration_ms: 7_000,
          });
        } else {
        }
      } else {
        toast.warning(res.error, {
          duration_ms: undefined,
        });
      }

      return res;
    } catch (error) {
      console.error(error);
      const msg = get_http_error_msg(error);
      toast.error(msg, {
        duration_ms: undefined,
      });
      return err(msg);
    }
  },
};
