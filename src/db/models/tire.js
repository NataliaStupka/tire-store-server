import { model, Schema } from 'mongoose';

// Schema
const tireSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    producer: { type: String, required: true },
    model: { type: String, required: true },
    layering: { type: String, required: true },
  },
  {
    timestamps: true, //час створення та оновлення документа.
    versionKey: false,
  },
);

// Model
export const TiresCollection = model('tires', tireSchema);
