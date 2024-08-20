"use server";

import { signIn } from "@/app/_lib/auth";

export async function signInAction() {
    await signIn("google", { redirectTo: "/account" });
}

export async function signoutAction() {
    await signOut({ redirectTo: "/" });
}