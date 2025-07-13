"use server";

import z from "zod/v4";
import prisma from "@/lib/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createLockerSchema = z.object({
  code: z.string("Podaj kod szafki"),
  zoneId: z.string("Podaj ID strefy"),
});

const createLocker = async (initialState: unknown, formData: FormData) => {
  const data = {
    code: formData.get("code"),
    zoneId: formData.get("zoneId"),
  };
  const parsedData = createLockerSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { code, zoneId } = parsedData.data;

  // Process mass syntax
  const detectedCodes = [];
  if (code.includes(",")) {
    const codes = code.split(",").map((c) => c.trim());
    for (const c of codes) {
      if (c) detectedCodes.push(c);
    }
  } else {
    detectedCodes.push(code);
  }

  for (const c of detectedCodes.filter((x) => x.match(/\d+\^\d+/))) {
    const range = c.match(/\d+\^\d+/);
    if (!range?.length) continue;
    const prefix = c.split(range[0])[0] || "";
    const suffix = c.split(range[0])[1] || "";
    const start = parseInt(range[0].split("^")[0], 10);
    const end = parseInt(range[0].split("^")[1], 10);
    for (let i = start; i <= end; i++) {
      const lockerCode = `${prefix}${i}${suffix}`;
      detectedCodes.push(lockerCode);
    }
    detectedCodes.splice(detectedCodes.indexOf(c), 1);
  }

  try {
    const newLockers = await prisma.locker.createMany({
      data: detectedCodes.map((c) => ({
        code: c,
        zoneId: zoneId as string,
      })),
    });
    revalidatePath(`/zones/${zoneId}`); // Revalidate the zones page to reflect the new lockers
    return {
      status: "success",
      message: "Szafki zostały pomyślnie utworzone",
      lockers: newLockers,
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return {
        status: "error",
        errors: [
          {
            path: ["code"],
            message: "Szafka o podanym kodzie już istnieje!",
          },
        ],
      };
    }
    console.error("Error creating locker:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas tworzenia szafki!",
        },
      ],
    };
  }
};

const deleteLockerSchema = z.object({
  id: z.string("Podaj ID szafki"),
});

const deleteLocker = async (initialState: unknown, formData: FormData) => {
  const data = {
    id: formData.get("id"),
  };
  const parsedData = deleteLockerSchema.safeParse(data);
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
    const deletedLocker = await prisma.locker.delete({
      where: { id },
    });
    revalidatePath(`/zones/${deletedLocker.zoneId}`); // Revalidate the classes page to reflect the deleted user
    return {
      status: "success",
      message: "Szafka została pomyślnie usunięta",
    };
  } catch (error: unknown) {
    console.error("Error deleting locker:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas usuwania szafki!",
        },
      ],
    };
  }
};

const editZoneSchema = z.object({
  name: z.string("To pole jest wymagane"),
  zoneId: z.string("Podaj ID strefy"),
});

const editZone = async (initialState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name"),
    zoneId: formData.get("zoneId"),
  };
  const parsedData = editZoneSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { name, zoneId } = parsedData.data;
  try {
    const newClass = await prisma.zone.update({
      where: { id: zoneId },
      data: {
        name,
      },
    });
    revalidatePath("/", "layout"); // Revalidate all pages to reflect the updated class
    return {
      status: "success",
      message: "Strefa została pomyślnie zaktualizowana",
      class: newClass,
    };
  } catch (error) {
    console.error("Error updating zone:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas aktualizowania strefy!",
        },
      ],
    };
  }
};

const deleteZoneSchema = z.object({
  zoneId: z.string("Podaj ID strefy"),
});

const deleteZone = async (initialState: unknown, formData: FormData) => {
  const data = {
    zoneId: formData.get("zoneId"),
  };
  const parsedData = deleteZoneSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { zoneId } = parsedData.data;
  try {
    await prisma.zone.delete({
      where: { id: zoneId },
    });
    revalidatePath("/", "layout"); // Revalidate the classes page to reflect the deleted class
  } catch (error) {
    console.error("Error deleting zone:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas usuwania strefy!",
        },
      ],
    };
  }
  redirect("/zones");
};

export {
  createLocker,
  deleteLocker,
  editZone,
  deleteZone,
};
