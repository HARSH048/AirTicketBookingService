const axios = require("axios");
const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require("../config/serverconifg");
const { ServiceError } = require("../utils/errors");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightid = data.flightId;
      const getflightreqURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightid}`;
      const response = await axios.get(getflightreqURL);
      const flightdata = response.data.data;
      let priceofFlight = flightdata.price;
      if (data.noofSeats > flightdata.totalSeats) {
        throw new ServiceError(
          "something went wrong in booking process",
          "insufficient seats"
        );
      }
      const totalCost = priceofFlight * data.noofSeats;
      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);
      const updateflightreqURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${data.flightId}`;
      console.log(updateflightreqURL);
      const k = await axios
        .patch(updateflightreqURL, {
          totalSeats: flightdata.totalSeats - data.noofSeats,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      const finalbooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });
      return finalbooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
