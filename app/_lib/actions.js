"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getBookings } from "@/app/_lib/data-service";
import { redirect } from "next/navigation";

export async function updateBooking(formData) {
  console.log("formData", formData);
  const bookingId = Number(formData.get("bookingId"));

  const session = await auth();
  if (!session)
    throw new Error("You need to be logged in to update your reservation");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are not authorized to update this booking");
  }

  const updatedFields = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  // cache revalidation so that UI gets updated with selected country
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  // redirect to reservations page after updating
  redirect("/account/reservations");
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session)
    throw new Error("You need to be logged in to update your profile");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");
  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  // cache revalidation so that UI gets updated with selected country
  revalidatePath("/account/profile");

  return data;
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  // get all bookings for the current user(guest) and save as an array of ids
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  // check if the bookingId is in the array of guestBookingIds - prevents unauthorized deletion
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not authorized to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");

  return data;
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
