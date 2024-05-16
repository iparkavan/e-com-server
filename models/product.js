const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema(
  {
    productTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    imageUrl: [
      {
        publicId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// productSchema.methods.save = function()

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
