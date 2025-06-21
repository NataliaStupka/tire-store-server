import { Schema, model } from 'mongoose';
import { UserCollection } from './user.js';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.ObjectId, ref: UserCollection, unique: true }, //посилання на користувача
    accessToken: { type: String, required: true }, //токен
    refreshToken: { type: String, required: true }, //токен
    accessTokenValidUntil: { type: Date, required: true }, //час дії (15 minutes)
    refreshTokenValidUntil: { type: Date, required: true }, //час дії (30 days)
  },
  { timestamps: true, versionKey: false },
);

export const SessionCollection = model('session', sessionSchema);
