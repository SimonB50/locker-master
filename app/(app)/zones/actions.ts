"use server";

import z from "zod/v4";
import prisma from "@/lib/database";
import { revalidatePath } from "next/cache";

const createZoneSchema = z.object({
  name: z.string("Podaj nazwę strefy"),
  unitId: z.uuid("Podaj ID jednostki"),
});

const createClass = async (initialState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name"),
    unitId: formData.get("unitId"),
  };
  const parsedData = createZoneSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { name, unitId } = parsedData.data;
  try {
    const newZone = await prisma.zone.create({
      data: {
        name,
        unitId,
      },
    });
    revalidatePath("/zones"); // Revalidate the zones page to reflect the new zone
    return {
      status: "success",
      message: "Strefa została pomyślnie dodana",
      class: newZone,
    };
  } catch (error) {
    console.error("Error creating zone:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas tworzenia strefy!",
        },
      ],
    };
  }
};

export { createClass };
