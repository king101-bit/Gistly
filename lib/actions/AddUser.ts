"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";

export async function createUser(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const notified = formData.get("notify") === "on";
    const source = formData.get("source") as string;

    await prisma.waitlist.create({
      data: {
        name,
        email,
        notified,
        source,
      },
    });

    // Optional but recommended
    revalidatePath("/");

    return { success: true, message: "Successfully added to waitlist!" };
  } catch (error) {
    return { success: false, message: "failed to add to waitlist." };
  }
}
