<script lang="ts">
  import IconCheckCircleSolid from "$lib/components/icons/IconCheckCircleSolid.svelte";
  import IconGift from "$lib/components/icons/IconGift.svelte";
  import { brands } from "$lib/stores/brands.store";
  import { loyalty_cards } from "$lib/stores/loyalty_cards.store";
  import { member_loyalty_cards } from "$lib/stores/member_loyalty_cards.store";

  let table = $derived(
    $brands.flatMap((brand) => {
      const loyalty_card = loyalty_cards.get_by_brand_id(brand._id).at(0);

      const member_cards = member_loyalty_cards.get_by_brand_id(brand._id);
      const unfilled_card = member_cards.find(
        (c) => !c.filled_at && !c.redeemed_at,
      );

      if (!loyalty_card) {
        return [];
      } else {
        return [
          {
            brand,
            loyalty_card,
            unfilled_card,
          },
        ];
      }
    }),
  );
</script>

<div class="flex flex-wrap gap-3">
  {#each table as row}
    <div class="my-card">
      <h3>{row.brand.name}</h3>

      <div class="my-1 flex w-fit flex-wrap gap-2">
        {#each Array.from( { length: row.loyalty_card.required_stamps }, ) as _stamp, stamp_i}
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black"
          >
            {#if row.unfilled_card && stamp_i < row.unfilled_card.stamps.length}
              <IconCheckCircleSolid class="size-10" />
            {/if}
          </div>
        {/each}

        <div
          class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black"
        >
          <IconGift />
        </div>
      </div>
    </div>
  {/each}
</div>
