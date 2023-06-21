const { BookingService } = require("../service/index");
const { StatusCodes } = require("http-status-codes");
const bookingService = new BookingService();
const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverconifg");

class BookingController {
  constructor() {}
  async sendMessagetoQueue(req, res) {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: "this is notification msg",
        content: "used with rabbitmq",
        recipentEmail: "coder9011@gmail.com",
        notificationTime: "2018-03-29T13:34:00.000",
      },
      service: "CREATE_TICKET",
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(200).json({
      message: "successfully publish the message",
    });
  }
  async create(req, res) {
    try {
      console.log(req.body);
      const response = await bookingService.createBooking(req.body);
      return res.status(StatusCodes.OK).json({
        message: "successfully completed booking",
        success: true,
        err: {},
        data: response,
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        message: error.message,
        success: false,
        err: error.explanation,
        data: {},
      });
    }
  }
}

module.exports = BookingController;
