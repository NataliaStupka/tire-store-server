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
    image: { type: String, default: null, required: false },
    // stock: { type: Number, default: 0 }, //кількість що залишилась?
    //instock: { type: Boolean, default: false, required: true }, //в наявності?
  },
  {
    timestamps: true, //час створення та оновлення документа.
    versionKey: false,
  },
);

// Model
export const TiresCollection = model('tires', tireSchema);
