const roomBookingService = require("../service/roomBookingService")

async function roomBooking(req, res) {
    try {
      const orderDetails = await roomBookingService.roomBooking(req.body);
      res.status(200);
      res.json({ message: "Room Booked Successfully", orderDetails });
    } catch (error) {
      res.status(404);
      res.json(error);
    }
  }

  async function roombooked(req, res) {
    try {
      const orderDetails = await roomBookingService.roombooked(req.body);
      res.status(200);
      res.json({ message: "Room Booked Successfully", orderDetails });
    } catch (error) {
      console.log(error)
      res.status(404);
      res.json(error);
    }
  }

  async function roomCheck(req, res) {
    try {
      const roomCheckRespone = await roomBookingService.roomCheck(req.body);
      res.status(200);
      res.json({ message: "Room are Available", roomCheckRespone });
    } catch (error) {
      console.log(error)
      res.status(404);
      res.json(error);
    }
  }


  module.exports = {
    roomBooking,
    roombooked,
    roomCheck
  };
