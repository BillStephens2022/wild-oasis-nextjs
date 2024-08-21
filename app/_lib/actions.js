"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";

export async function updateGuest(formData) {
  const session = await auth();
  console.log('Session from updateGuest action:', session);
  if (!session)
    throw new Error("You need to be signed in to update your profile");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");
  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)

  if (error) {
    console.error('Supabase error:', error);
    throw new Error('Guest could not be updated');
  } 
  // cache revalidation so that UI gets updated with selected country
  revalidatePath('/account/profile');
  
  return data;
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}


