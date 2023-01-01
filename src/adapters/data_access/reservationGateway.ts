import { Reservation } from "../../entities/reservation";
import { AddReservationParameter } from "./parameters/addReservationParameter";
import { SearchReservationParameter } from "./parameters/searchReservationParameter";

export interface ReservationGateway {
    find(parameter: SearchReservationParameter): Promise<Reservation>
    addReservation(parameter: AddReservationParameter): Promise<Reservation>
}