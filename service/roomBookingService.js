const db = require("../model/index");
const Razorpay = require("razorpay");
const axios = require("axios");

const razorpay = new Razorpay({
  key_id: "rzp_live_miuq50dflMActu",
  key_secret: "RoDC5o1uUqCUD3ziRCRuXrDi",
});

const roomBooking = async (jsonBody) => {
  const { userId, checkInDate, checkOutDate, room, total } = jsonBody;
  console.log(jsonBody);
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
    console.log(response);
    return response;
  } catch (error) {
    return error;
  }
};

const roomCheck = async (jsonBody) => {
  const { startDate, endDate } = jsonBody;
  console.log(jsonBody);
  try {
   const roomData =  [
      {
        roomId: 1,
        roomType: "Non-AC Room",
        discription: "Best for Couple, 2 Adules",
        price: 999,
        rating: 4.5,
        isAvailable: true,
      },
      {
        roomId: 2,
        roomType: "AC Room",
        discription: "Best for Couple, 2 Adules",
        price: 1299,
        rating: 4.8,
        isAvailable: false,
      },
      {
        roomId: 3,
        roomType: "Non-AC Room",
        discription: "Best for Family, 2 Adules",
        price: 1099,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 4,
        roomType: "AC Room",
        discription: "Best for Family, 2 Adules",
        price: 250,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 5,
        roomType: "Non-AC Room",
        discription: "Best For Carporate, 2 Adules",
        price: 250,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 6,
        roomType: "AC Room",
        discription: "Best For Carporate, 2 Adules",
        price: 250,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 7,
        roomType: "Non-AC Room",
        discription: "Best For Singles, 2 Adules",
        price: 799,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 8,
        roomType: "AC Room",
        discription: "Best For Singles, 2 Adules",
        price: 879,
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
      {
        roomId: 10,
        roomType: "AC Room",
        discription: "Pets Friendly, 2 Adules",
        price: 1999,
        rating: 5.0,
        isAvailable: true,
      },
      {
        roomId: 11,
        roomType: "AC Room",
        discription: "Pets Friendly, 2 Adules",
        price: 1999,
        rating: 5.0,
        isAvailable: false,
      },
      {
        roomId: 12,
        roomType: "AC Room",
        discription: "Pets Friendly, 2 Adules",
        price: 1999,
        rating: 5.0,
        isAvailable: true,
      },
    ]
    console.log(roomData);
    return roomData;
  } catch (error) {
    return error;
  }
};


const roombooked = async (jsonBody) => {
  const { userId, checkInDate, checkOutDate, room, numberOfDays,total, customer, email, address,phone } = jsonBody;
  console.log('----123',userId, checkInDate, checkOutDate, room, numberOfDays, total, customer, email, address,phone);
  try {
    const roomBooked = {
      userId: userId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      numberOfDays: numberOfDays,
      amount: total,
      roomDescription: room.discription ,
      roomType: room.roomType,
      customer:customer,
      email:email,
      address:address,
      phone:phone
      
    };
    const amt = total.toString();
    const number = phone
    const apiPayload = {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzBmZGEyM2VmMTAxMGVhYmFhMTBjMSIsIm5hbWUiOiJIb3RlbCBNaWRhcyBSZWVnZW5jeSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NDMwZmRhMTNlZjEwMTBlYWJhYTEwYmMiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcwMjc5NjgzOH0.wOfn734COxFy0tApmZIbWxISCqtCUTGnV9aFmrW0wYU",
      campaignName: "roomBooked",
      destination: number,
      userName: "User", // Provide a default value if userName is not provided
      templateParams: [
        customer,
        checkInDate,
        checkOutDate,
        room.roomType,
        room.discription,
        amt,
      ]
    };

    const response = await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      apiPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const roomDataSave = db.roomBooking(roomBooked);
    const roomEntry = await roomDataSave.save();

    console.log('------',roomEntry, roomDataSave,response);
    return roomEntry;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  roomBooking,
  roombooked,
  roomCheck
};
