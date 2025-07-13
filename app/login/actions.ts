"use server";

import { cookies } from "next/headers";

const validateLogin = async (initialState: unknown, formData: FormData) => {
  const password = formData.get("password");
  if (!password || password !== process.env.PASSWORD) return 1;
  const cookieStore = await cookies();
  const encodedPassword = Buffer.from(password.toString()).toString("base64");
  cookieStore.set("pswd", encodedPassword);
  return 2;
};

export { validateLogin };
