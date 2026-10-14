import { model, Schema } from 'mongoose';

// Schema
const tireSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['loader', 'industrial', 'agricultural', 'car', 'rims'],
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    producer: { type: String, required: false },
    modelTire: { type: String, required: false }, //required: true ???
    layering: { type: String, required: false },
    loadIndex: { type: String, required: false },
    tireType: { type: String, required: false, enum: ['tl', 'tt', ''] }, //прибрати з enum '' - лдя диску, бо  внього немає такого типу
    image: { type: String, default: null, required: false }, //шлях де зберігається
    imagePublicId: { type: String, default: null, required: false }, //індифікатор в Cloudinary, для видалення зображення ❌ 🏞️
    // stock: { type: Number, default: 0 }, //кількість що залишилась?
    // diskDiameter: { type: Number, required: false },
    diskModel: { type: String, required: false },
    instock: { type: Boolean, required: false }, //в наявності?
  },
  {
    timestamps: true, //час створення та оновлення документа.
    versionKey: false,
  },
);

// Model
export const TiresCollection = model('tires', tireSchema);
