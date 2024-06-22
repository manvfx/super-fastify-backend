import { config } from "../../../config.mjs";
import paseto from "paseto";
const {
  V4: { sign },
} = paseto;
import { nanoid } from "nanoid";

export const tokenGenerator = async (email) => {
  try {
    let payload = {
      email,
      plan: "regular",
      role: "Operator",
      ts: new Date().toISOString(),
      _id: nanoid(),
      entity: "operator",
    };
    // sign token
    const token = await sign({ payload }, config.pasetoSecret);
    return token;
  } catch (error) {
    console.log(error);
  }
};
