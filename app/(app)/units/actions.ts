"use server";

import z from "zod/v4";
import prisma from "@/lib/database";
import { revalidatePath } from "next/cache";

const createUnitSchema = z.object({
  name: z.string("Podaj nazwę jednostki"),
});

const createUnit = async (initialState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name"),
  };
  const parsedData = createUnitSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { name } = parsedData.data;
  try {
    const newUnit = await prisma.unit.create({
      data: {
        name,
      },
    });
    revalidatePath("/", "layout"); // Revalidate all pages to reflect the new unit
    return {
      status: "success",
      message: "Jednostka została pomyślnie dodana",
      unit: newUnit,
    };
  } catch (error) {
    console.error("Error creating unit:", error);
    return {
      status: "error",
      errors: [
        { path: [], message: "Wystąpił błąd podczas tworzenia jednostki" },
      ],
    };
  }
};

const editUnitSchema = z.object({
  name: z.string("Podaj nazwę jednostki"),
  unitId: z.string("Podaj ID jednostki"),
});

const editUnit = async (initialState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name"),
    unitId: formData.get("id"),
  };
  const parsedData = editUnitSchema.safeParse(data);
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
    const updatedUnit = await prisma.unit.update({
      where: { id: unitId },
      data: { name },
    });
    revalidatePath("/", "layout"); // Revalidate all pages to reflect the updated unit
    return {
      status: "success",
      message: "Jednostka została pomyślnie zaktualizowana",
      unit: updatedUnit,
    };
  } catch (error) {
    console.error("Error updating unit:", error);
    return {
      status: "error",
      errors: [
        { path: [], message: "Wystąpił błąd podczas aktualizacji jednostki" },
      ],
    };
  }
};

const deleteUnitSchema = z.object({
  id: z.string("ID jednostki jest wymagane"),
});

const deleteUnit = async (initialState: unknown, formData: FormData) => {
  const data = {
    id: formData.get("id"),
  };
  const parsedData = deleteUnitSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { id } = parsedData.data;
  try {
    await prisma.unit.delete({
      where: { id },
    });
    revalidatePath("/", "layout"); // Revalidate all pages to reflect the deleted unit
    return {
      status: "success",
      message: "Jednostka została pomyślnie usunięta",
    };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return {
      status: "error",
      errors: [
        { path: [], message: "Wystąpił błąd podczas usuwania jednostki" },
      ],
    };
  }
};

export { createUnit, editUnit, deleteUnit };
