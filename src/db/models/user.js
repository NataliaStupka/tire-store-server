import { model, Schema } from 'mongoose';
import { ROLES } from '../../constants/role.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [ROLES.ADMIN],
      default: ROLES.ADMIN,
    },
  },
  { timestamps: true, versionKey: false }, //timestamps автоматичне створення createdAt та updatedAt
);

// ?????
// usersSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

export const UserCollection = model('users', userSchema);
