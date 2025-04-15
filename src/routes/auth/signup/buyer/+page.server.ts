import { auth } from "$lib/auth/lucia";
import { OTP } from "$lib/models/OTPs";
import { password_schema } from "$lib/schema/index";
import { Parsers } from "$lib/schema/parsers";
import { type Actions, error, redirect } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const { email, password } = await Parsers.form(
      request,
      z.object({ email: z.string().email(), password: password_schema }),
    );

    try {
      const user = await auth.createUser({
        key: {
          password,
          providerId: "email",
          providerUserId: email,
        },
        attributes: {
          email,
          admin: false,
          kind: "buyer",
          email_verified: true,
        },
      });

      const promises: Promise<any>[] = [
        auth.createSession({ userId: user.userId, attributes: {} }),
      ];

      if (!user.email_verified) {
        promises.push(OTP.handleLinks["email-verification"]({ user }));
      }

      const [session] = await Promise.all(promises);
      locals.auth.setSession(session);
    } catch (e) {
      const { message } = e as Error;
      if (
        message === "AUTH_DUPLICATE_KEY_ID" ||
        message === "AUTH_DUPLICATE_USER_DATA"
      ) {
        error(400, "Email already in use");
      }

      error(500, "Something went wrong");
    }

    redirect(302, "/");
  },
};
