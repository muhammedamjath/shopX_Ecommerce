const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  address: [
    {
      house: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
  ],
});

const addressCollection = new mongoose.model("address", schema);
module.exports = addressCollection;
 