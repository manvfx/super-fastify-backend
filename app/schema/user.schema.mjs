const userSchema = {
  type: "object",
  required: ["username", "email", "password"],
  properties: {
    username: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
};

export default userSchema;
