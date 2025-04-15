import { dev } from "$app/environment";
import { mongoose as luciaMongooseAdapter } from "@lucia-auth/adapter-mongoose";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import mongoose from "mongoose";
import type { SID } from "../interfaces";
import { ROLES } from "./roles";

export const Users: mongoose.Model<SID<Lucia.DatabaseUserAttributes>> =
  mongoose.models["auth_user"] ||
  mongoose.model(
    "auth_user",
    new mongoose.Schema(
      {
        _id: String,

        email: {
          type: String,
          required: true,
        },
        team_id: {
          type: String,
          required: true,
          ref: "Teams",
        },
        role: {
          type: String,
          required: true,
          enum: ROLES,
        },
        email_verified: {
          type: Boolean,
          required: true,
        },
        admin: {
          type: Boolean,
          required: true,
        },
      },
      { _id: false },
    ),
  );

const Sessions =
  mongoose.models["auth_session"] ||
  mongoose.model(
    "auth_session",
    new mongoose.Schema(
      {
        _id: {
          type: String,
        },
        user_id: {
          type: String,
          required: true,
        },
        active_expires: {
          type: Number,
          required: true,
        },
        idle_expires: {
          type: Number,
          required: true,
        },
      },
      { _id: false },
    ),
  );

const Keys =
  mongoose.models["auth_key"] ||
  mongoose.model(
    "auth_key",
    new mongoose.Schema(
      {
        _id: {
          type: String,
        },
        user_id: {
          type: String,
          required: true,
        },
        hashed_password: {
          type: String,
        },
      },
      { _id: false },
    ),
  );

export const auth = lucia({
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),

  adapter: luciaMongooseAdapter({
    User: Users,
    Session: Sessions,
    Key: Keys,
  }),

  getUserAttributes: (u) => u,
});

export type Auth = typeof auth;
