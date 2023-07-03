import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ReservationsController } from "./reservations/reservations.controller";
import { ReservationsService } from "./reservations/reservations.service";

@Module({
  imports: [],
  controllers: [AppController, ReservationsController],
  providers: [AppService, ReservationsService]
})
export class AppModule {
}
