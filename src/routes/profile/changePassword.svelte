<script lang="ts">
  import { UserClient } from "$lib/client/user.client";
  import Fieldset from "$lib/components/daisyui/Fieldset.svelte";
  import Label from "$lib/components/daisyui/Label.svelte";
  import Loading from "$lib/components/daisyui/Loading.svelte";
  import { any_loading, Loader } from "$lib/utils/loader";
  import { toast } from "svelte-daisyui-toast";
  import { preventDefault } from "svelte/legacy";

  let form = $state({
    new: "",
    confirm: "",
  });

  const loader = Loader<"change-pwd">();

  const changePassword = async () => {
    if (form.new !== form.confirm) {
      return toast.warning("Passwords do not match");
    }

    loader.load("change-pwd");

    const res = await UserClient.change_password(form.new);
    if (res.ok) {
      form = {
        new: "",
        confirm: "",
      };
    }

    loader.reset();
  };
</script>

<form class="flex flex-col gap-3" onsubmit={preventDefault(changePassword)}>
  <Fieldset legend="Change password">
    <Label lbl="New Password">
      <input
        class="input"
        type="password"
        autocomplete="new-password"
        bind:value={form.new}
      />
    </Label>

    <Label lbl="Confirm Password">
      <input
        class="input"
        type="password"
        autocomplete="new-password"
        bind:value={form.confirm}
      />
    </Label>
  </Fieldset>

  <div class="flex flex-wrap items-center gap-3">
    <button
      class="btn btn-primary"
      type="submit"
      disabled={!form.new || !form.confirm || any_loading($loader)}
    >
      <Loading loading={$loader["change-pwd"]} />
      Change Password
    </button>
  </div>
</form>
