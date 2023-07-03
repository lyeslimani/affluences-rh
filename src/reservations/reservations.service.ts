import { Injectable } from "@nestjs/common";
import axios from "axios";

interface Timetables {
  open: string,
  timetables: Timetable[];
}

interface Timetable {
  "opening": string,
  "closing": string
}

interface Reservations {
  reservations: Reservation[];
}

interface Reservation {
  "reservationStart": string,
  "reservationEnd": string
}

@Injectable()
export class ReservationsService {
  private readonly reservations_api_url;

  constructor() {
    this.reservations_api_url = process.env.RESERVATIONS_API;
  }

  async isAvailable(resourceId: string, isoDate: string): Promise<boolean> {
    const date = isoDate.split("T")[0];
    const response = await axios.get<Timetables>(this.reservations_api_url + "/timetables", {
      params: {
        resourceId,
        date
      }
    });
    const timetable = response.data;
    if (!timetable.open) {
      return false;
    }

    const availableSlots = timetable.timetables.filter(slot => {
      const opening = new Date(slot.opening);
      const closing = new Date(slot.closing);
      return opening <= new Date(isoDate) && closing >= new Date(isoDate);
    });
    if (availableSlots.length === 0) {
      return false;
    }

    const reservationsResponse = await axios.get<Reservations>(this.reservations_api_url + "/reservations", {
      params: {
        resourceId,
        date
      }
    });
    const reservations = reservationsResponse.data;
    const conflictingReservations = reservations.reservations.filter(reservation => {
      const start = new Date(reservation.reservationStart);
      const end = new Date(reservation.reservationEnd);
      return start <= new Date(isoDate) && end >= new Date(isoDate);
    });
    return conflictingReservations.length <= 0;

  }
}
