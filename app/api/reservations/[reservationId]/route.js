import { getBooking } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
    const { reservationId } = params;
    try {
        const reservation = await getBooking(reservationId);
        return Response.json(reservation);
    }
    catch {
        return Response.json({ message: "Cabin not found" } );
    }
}
