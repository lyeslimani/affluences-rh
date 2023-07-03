import { BadRequestException, Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
export class ReservationsController {

  constructor(private readonly reservationsService: ReservationsService) {
  }

  @Get("available")
  getAvailable(@Req() request: Request) {
    const ressourceId = request.query.ressourceId as string;
    if (!ressourceId) {
      throw new BadRequestException({ error: "ressourceId is required" });
    }
    const requiredTime = request.query.time as string;
    if (!requiredTime) {
      throw new BadRequestException({ error: "time is required" });
    }

    const time = Date.parse(requiredTime);
    if (!time) {
      throw new BadRequestException({ error: "time is not a valid date" });
    }

    const available = this.reservationsService.isAvailable(ressourceId, requiredTime);

    return { available, time:new Date(requiredTime) };
  }
}
