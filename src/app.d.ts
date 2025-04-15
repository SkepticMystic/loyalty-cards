/// <reference types="@sveltejs/kit" />
declare global {
  namespace App {
    interface Locals {
      auth: import("lucia").AuthRequest;
    }

    interface PageData {}
  }
}

/// <reference types="lucia" />
declare global {
  namespace Lucia {
    type Auth = import("$lib/auth/lucia").Auth;

    type DatabaseUserAttributes = {
      admin: boolean;

      email: string;
      email_verified: boolean;

      team_id: string;
      role: import("$lib/auth/roles").Role;
    };

    type DatabaseSessionAttributes = {};
  }
}

// THIS IS IMPORTANT!!!
export {};
