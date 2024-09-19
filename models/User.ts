import mongoose, {Document, Model} from "mongoose";
import {getAddress} from "viem";

interface Contacts {
  [key: string]: string;
}

interface IUser extends Document {
  address: string;
  contacts: Contacts;
}

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    set: (address: string) => getAddress(address),
  },
  contacts: {
    type: Map,
    of: String,
    default: new Map(),

    validate: {
      validator: function (this: IUser, v: Map<string, string>) {
        return Array.from(v.entries()).every(
          ([key, value]) =>
            /^0x[a-fA-F0-9]{40}$/.test(key) && typeof value === "string"
        );
      },
      message: (props: any) =>
        `${JSON.stringify(
          Object.fromEntries(props.value)
        )} contains invalid Ethereum addresses or non-string names!`,
    },
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
