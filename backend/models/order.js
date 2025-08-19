const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: Number, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, maxlength: 500 },
     zipcode: { type: Number, required: true },
    tele: { type: Number, required: true },

  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Order",orderSchema);