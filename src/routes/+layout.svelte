<script lang="ts">
  import Loading from "$lib/components/daisyui/Loading.svelte";
  import Navbar from "$lib/components/daisyui/Navbar.svelte";
  import type { SID } from "$lib/interfaces";
  import type { Brand } from "$lib/models/Brands";
  import type { LoyaltyCard } from "$lib/models/LoyaltyCards";
  import type { MemberLoyaltyCard } from "$lib/models/MemberLoyaltyCards";
  import { brands } from "$lib/stores/brands.store";
  import { loyalty_cards } from "$lib/stores/loyalty_cards.store";
  import { member_loyalty_cards } from "$lib/stores/member_loyalty_cards.store";
  import { user } from "$lib/stores/user";
  import ky from "ky";
  import type { User } from "lucia";
  import { onMount } from "svelte";
  import { toast, Toaster } from "svelte-daisyui-toast";
  import "../app.css";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  toast.defaults.set({ clear_on_navigate: true, duration_ms: 10_000 });

  let loading = $state(true);
  onMount(async () => {
    const data = await ky
      .get<{
        user: User | undefined;

        brands: SID<Brand>[];
        loyalty_cards: SID<LoyaltyCard>[];
        member_loyalty_cards: SID<MemberLoyaltyCard>[];
      }>("/api/init")
      .json();

    user.set(data.user);

    brands.set(data.brands);
    loyalty_cards.set(data.loyalty_cards);
    member_loyalty_cards.set(data.member_loyalty_cards);

    loading = false;
  });
</script>

<header>
  <Navbar />
</header>

<main class="mx-14 my-4">
  <Loading {loading}>
    {@render children?.()}
  </Loading>
</main>

<Toaster />
