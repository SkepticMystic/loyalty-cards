import { Check } from "$lib/auth/checks";
import { Brands } from "$lib/models/Brands";
import { LoyaltyCards } from "$lib/models/LoyaltyCards";
import { MemberLoyaltyCards } from "$lib/models/MemberLoyaltyCards";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.validate();
  const user = session?.user;

  const [brands, loyalty_cards, member_loyalty_cards] = await Promise.all([
    user?.kind === "buyer" ? Brands.find().lean() : Promise.resolve([]),

    user?.kind === "buyer" ? LoyaltyCards.find().lean() : Promise.resolve([]),

    user?.kind === "buyer"
      ? MemberLoyaltyCards.find({ user_id: user.userId }).lean()
      : Promise.resolve([]),
  ]);

  return json({
    user,

    brands: brands.filter((r) => Check.admin_or_owned_or_visible(r, user)),
    member_loyalty_cards: member_loyalty_cards.filter((c) => !c.redeemed_at),
    loyalty_cards: loyalty_cards.filter((r) =>
      Check.admin_or_owned_or_visible(r, user),
    ),
  });
};
