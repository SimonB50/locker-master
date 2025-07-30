"use server";

import z from "zod/v4";
import prisma from "@/lib/database";
import { revalidatePath } from "next/cache";

const createClassSchema = z.object({
  name: z
    .string("Podaj nazwę klasy")
    .length(2, "Nazwa klasy może mieć tylko 2 znaki")
    .regex(/^[0-9][A-Z]$/, "Nazwa klasy musi być w formacie np. 1A, 2B"),
  teacher: z
    .string("Podaj imię i nazwisko wychowawcy")
    .min(1, "Imię i nazwisko nauczyciela jest wymagane")
    .regex(
      /^[A-Za-z]+(?:-[A-Za-z]+)? [A-Za-z]+(?:-[A-Za-z]+)?$/,
      "Imię i nazwisko nauczyciela musi być w formacie np. Jan Kowalski lub Jan Nowak-Nowicki"
    ),
  unitId: z.uuid("Podaj ID jednostki"),
});

const createClass = async (initialState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name"),
    teacher: formData.get("teacher"),
    unitId: formData.get("unitId"),
  };
  const parsedData = createClassSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { name, teacher, unitId } = parsedData.data;
  try {
    const newClass = await prisma.class.create({
      data: {
        name,
        teacher,
        unitId,
      },
    });
    revalidatePath("/classes"); // Revalidate the classes page to reflect the new class
    return {
      status: "success",
      message: "Klasa została pomyślnie dodana",
      class: newClass,
    };
  } catch (error) {
    console.error("Error creating class:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas tworzenia klasy!",
        },
      ],
    };
  }
};

export { createClass };
