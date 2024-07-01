const db = require("../model/index");
const Razorpay = require("razorpay");
const axios = require("axios");
const path = require("path");
const fs = require("node:fs");
const sendEmail = require("./mailer");

const razorpay = new Razorpay({
  key_id: "rzp_live_miuq50dflMActu",
  key_secret: "RoDC5o1uUqCUD3ziRCRuXrDi",
});

const roomBooking = async (jsonBody) => {
  const { userId, checkInDate, checkOutDate, room, total } = jsonBody;
  try {
    const payment_capture = 1;
    const currency = "INR";
    const options = {
      amount: total * 100,
      currency,
      receipt: "receipt1",
      payment_capture,
    };
    const response = await razorpay.orders.create(options);
    return response;
  } catch (error) {
    return error;
  }
};

const roomCheck = async (jsonBody) => {
  const { startDate, endDate } = jsonBody;
  try {
    const roomData = [
      {
        roomId: 1,
        roomType: "Non-AC Room",
        discription: "Best for Couple, 2 Adules",
        price: 1199,
        rating: 4.5,
        isAvailable: true,
      },
      {
        roomId: 2,
        roomType: "AC Room",
        discription: "Best for Couple, 2 Adules",
        price: 1499,
        rating: 4.8,
        isAvailable: false,
      },
      {
        roomId: 3,
        roomType: "Non-AC Room",
        discription: "Best for Family, 2 Adules",
        price: 1299,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 4,
        roomType: "AC Room",
        discription: "Best for Family, 2 Adules",
        price: 1599,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 5,
        roomType: "Non-AC Room",
        discription: "Best For Carporate, 2 Adules",
        price: 1399,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 6,
        roomType: "AC Room",
        discription: "Best For Corporate, 2 Adules",
        price: 1699,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 7,
        roomType: "Non-AC Room",
        discription: "Best For Singles, 2 Adules",
        price: 999,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 8,
        roomType: "AC Room",
        discription: "Best For Singles, 2 Adules",
        price: 1299,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 9,
        roomType: "Non-AC Room",
        discription: "Pets Friendly , 2 Adules",
        price: 1699,
        rating: 5.0,
        isAvailable: true,
      },
    ];
    return roomData;
  } catch (error) {
    return error;
  }
};

const roombooked = async (jsonBody) => {
  const {
    userId,
    checkInDate,
    checkOutDate,
    room,
    numberOfDays,
    total,
    customer,
    email,
    address,
    phone,
    onlinepayment,
    payathotel
  } = jsonBody;
  try {
    const roomBooked = {
      userId: userId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      numberOfDays: numberOfDays,
      amount: total,
      roomDescription: room.discription,
      roomType: room.roomType,
      customer: customer,
      email: email,
      address: address,
      phone: phone,
    };
    const roomDataSave = db.roomBooking(roomBooked);
    const roomEntry = await roomDataSave.save();

    try {
      const templatePathForRoomBooking = path.join(__dirname, "./roombooked.html");
      const templateForRoomBooking = fs.readFileSync(templatePathForRoomBooking, "utf8");
      const templatePathForBoNotify = path.join(__dirname, "./bonotify.html");
      const templateForBoNotify = fs.readFileSync(templatePathForBoNotify, "utf8");

      const emailSubjectForRoomBooking = "Room Confirmed";
      const emailSubjectForBoNotify = "Booking From Website";
      const date = new Date();
      const currentDate = date.toLocaleString();
      const templateVariables = {
        currentDate: currentDate,
        USER: customer,
        reservationnumber: roomEntry._id,
        guestname: customer,
        checkindate: checkInDate,
        checkoutdate: checkOutDate,
        roomtype: room.roomType,
        numberofdays: numberOfDays,
        onlinepayment: onlinepayment,
        payathotel: payathotel,
        number: phone
      };
      const dataForRoomBooking = renderTemplate(templateForRoomBooking, templateVariables);
      const dataForBoNotify = renderTemplate(templateForBoNotify, templateVariables);
      try {
        const responseOfRoomBooked = await sendEmail(email, emailSubjectForRoomBooking, dataForRoomBooking);
        const responseOfBoNotify = await sendEmail("midasreegency1131@gmail.com", emailSubjectForBoNotify, dataForBoNotify);

        return {
          valid: true,
          message: responseOfRoomBooked,
        };
      } catch (error) {
        return {
          valid: false,
          message: "Internal Server Error",
        };
      }
    } catch (error) {
      return {
        valid: false,
        message: "Internal Server Error",
      };
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

const renderTemplate = (template, variables) => {
  return template.replace(/{{(\w+)}}/g, (_, key) => variables[key] || "");
};

module.exports = {
  roomBooking,
  roombooked,
  roomCheck,
};
