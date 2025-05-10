import { model, Schema } from 'mongoose';

// Schema
const tireSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['loader', 'industrial', 'agricultural', 'rims'],
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    producer: { type: String, required: false },
    modelTire: { type: String }, //required: true ???
    layering: { type: String, required: false },
    loadIndex: { type: String, required: false },
    tireType: { type: String, required: false, enum: ['tl', 'tt', ''] }, //прибрати з enum ''
    image: { type: String, default: null, required: false },
    // stock: { type: Number, default: 0 }, //кількість що залишилась?
    // diskDiameter: { type: Number, required: false },
    diskModel: { type: String, required: false },
    instock: { type: Boolean, default: false, required: false }, //в наявності?
  },
  {
    timestamps: true, //час створення та оновлення документа.
    versionKey: false,
  },
);

// Model
export const TiresCollection = model('tires', tireSchema);
