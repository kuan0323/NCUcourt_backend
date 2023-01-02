import { Reservation } from "../../entities/reservation";
import { AddReservationParameter } from "./parameters/addReservationParameter";
import { SearchReservationParameter } from "./parameters/searchReservationParameter";

export interface ReservationGateway {
    findById (id: string): Promise<Reservation>;
    find (parameter: SearchReservationParameter): Promise<Reservation[]>;
    addReservation (parameter: AddReservationParameter): Promise<Reservation>;
    deleteReservation (id: string): Promise<void>;
}