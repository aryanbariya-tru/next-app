import { Schema, model, models } from "mongoose";


const dataSchema = new Schema({
  name: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
});

export const Data = models.Data || model("Data", dataSchema);
