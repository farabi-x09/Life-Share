import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME); 

export const auth = betterAuth({
      emailAndPassword: { 
    enabled: true, 
  }, 
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  user: {
    additionalFields: {
      bloodGroup: { type: "string", required: true },
      district: { type: "string", required: true },
      upazila: { type: "string", required: true },
      role: { type: "string", defaultValue: "donor" },
      status: { type: "string", defaultValue: "active" },
    },
  },
  // jwt
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30,
    },
  },
  plugins: [jwt()],
  // this
});