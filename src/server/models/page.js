import mongoose from "mongoose";

const slideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    }
  },
  {
    _id: true
  }
);


const pageSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    slides: {
      type: [slideSchema],
      default: []
    }
  },

  {
    timestamps: true
  }
);


const Page = mongoose.model(
  "Page",
  pageSchema
);


export default Page;