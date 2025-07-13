"use server";

import z from "zod/v4";
import prisma from "@/lib/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createUserSchema = z.object({
  name: z
    .string("Podaj imię i nazwisko ucznia")
    .regex(
      /^[A-Za-z]+ [A-Za-z]+$/,
      "Imię i nazwisko ucznia musi być w formacie np. Jan Kowalski"
    ),
  lockerCode: z.string().optional(),
  classId: z.string("Podaj odpowiednią klasę"),
});

const createUser = async (initialState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name"),
    lockerCode: formData.get("lockerCode"),
    classId: formData.get("classId"),
  };
  const parsedData = createUserSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { name, lockerCode, classId } = parsedData.data;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        locker: lockerCode ? { connect: { code: lockerCode } } : undefined,
        classId,
      },
    });
    revalidatePath(`/classes/${classId}`); // Revalidate the classes page to reflect new user
    return {
      status: "success",
      message: "Użytkownik został pomyślnie dodany!",
      user: newUser,
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return {
        status: "error",
        errors: [
          {
            path: ["lockerCode"],
            message:
              "Szafka o podanym kodzie nie istnieje lub jest już zajęta!",
          },
        ],
      };
    }
    console.error("Error creating user:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas tworzenia użytkownika!",
        },
      ],
    };
  }
};

const editUserSchema = z.object({
  id: z.string("Podaj ID użytkownika"),
  name: z
    .string("Podaj imię i nazwisko ucznia")
    .regex(
      /^[A-Za-z]+ [A-Za-z]+$/,
      "Imię i nazwisko ucznia musi być w formacie np. Jan Kowalski"
    ),
  lockerCode: z.string().optional(),
});

const editUser = async (initialState: unknown, formData: FormData) => {
  const data = {
    id: formData.get("id"),
    name: formData.get("name"),
    lockerCode: formData.get("lockerCode"),
  };
  const parsedData = editUserSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { id, name, lockerCode } = parsedData.data;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        locker: lockerCode
          ? { connect: { code: lockerCode } }
          : { disconnect: true },
      },
    });
    revalidatePath(`/classes/${updatedUser.classId}`); // Revalidate the classes page to reflect the updated user
    return {
      status: "success",
      message: "Użytkownik został pomyślnie zaktualizowany",
      user: updatedUser,
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return {
        status: "error",
        errors: [
          {
            path: ["lockerCode"],
            message:
              "Szafka o podanym kodzie nie istnieje lub jest już zajęta!",
          },
        ],
      };
    }
    console.error("Error updating user:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas edycji użytkownika!",
        },
      ],
    };
  }
};

const deleteUserSchema = z.object({
  id: z.string("Podaj ID użytkownika"),
});

const deleteUser = async (initialState: unknown, formData: FormData) => {
  const data = {
    id: formData.get("id"),
  };
  const parsedData = deleteUserSchema.safeParse(data);
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
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    revalidatePath(`/classes/${deletedUser.classId}`); // Revalidate the classes page to reflect the deleted user
    return {
      status: "success",
      message: "Użytkownik został pomyślnie usunięty",
    };
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas usuwania użytkownika!",
        },
      ],
    };
  }
};

const importUsersSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type === "text/csv", {
    message: "Plik musi być w formacie CSV",
  }),
  classId: z.string("Podaj ID klasy"),
});

const importUsers = async (initialState: unknown, formData: FormData) => {
  const data = {
    file: formData.get("file"),
    classId: formData.get("classId"),
  };
  const parsedData = importUsersSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { file, classId } = parsedData.data;
  try {
    // Decode file content from windows 1250 encoding to UTF-8
    const fileContent = await file.arrayBuffer();
    const decodedContent = new TextDecoder("windows-1250").decode(fileContent);
    const rows = decodedContent.split("\n").map((row) => row.split(";"));
    const mapping = {
      name: rows[0].indexOf("imię"),
      surname: rows[0].indexOf("nazwisko"),
    };
    const usersData = rows
      .slice(1)
      .map((row) => {
        if (row.length < 2) return null; // Skip empty rows
        const name = row[mapping.name].trim();
        const surname = row[mapping.surname].trim();
        return {
          name: `${name} ${surname}`,
          classId,
        };
      })
      .filter((x) => x !== null);

    const createdUsers = await prisma.user.createMany({
      data: usersData,
    });

    revalidatePath(`/classes/${classId}`); // Revalidate the classes page to reflect imported users
    return {
      status: "success",
      message: `Pomyślnie zaimportowano ${createdUsers.count} użytkowników`,
    };
  } catch (error: unknown) {
    console.error("Error importing users:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas importowania użytkowników!",
        },
      ],
    };
  }
};

const editClassSchema = z.object({
  name: z
    .string("Podaj nazwę klasy")
    .length(2, "Nazwa klasy może mieć tylko 2 znaki")
    .regex(/^[0-9][A-Z]$/, "Nazwa klasy musi być w formacie np. 1A, 2B"),
  teacher: z
    .string("Podaj imię i nazwisko wychowawcy")
    .min(1, "Imię i nazwisko nauczyciela jest wymagane")
    .regex(
      /^[A-Za-z]+ [A-Za-z]+$/,
      "Imię i nazwisko nauczyciela musi być w formacie np. Jan Kowalski"
    ),
  classId: z.string("Podaj ID klasy"),
});

const editClass = async (initialState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name"),
    teacher: formData.get("teacher"),
    classId: formData.get("classId"),
  };
  const parsedData = editClassSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { name, teacher, classId } = parsedData.data;
  try {
    const newClass = await prisma.class.update({
      where: { id: classId },
      data: {
        name,
        teacher,
      },
    });
    revalidatePath("/", "layout"); // Revalidate all pages to reflect the updated class
    return {
      status: "success",
      message: "Klasa została pomyślnie zaktualizowana",
      class: newClass,
    };
  } catch (error) {
    console.error("Error updating class:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas aktualizowania klasy!",
        },
      ],
    };
  }
};

const deleteClassSchema = z.object({
  classId: z.string("Podaj ID klasy"),
});

const deleteClass = async (initialState: unknown, formData: FormData) => {
  const data = {
    classId: formData.get("classId"),
  };
  const parsedData = deleteClassSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      status: "error",
      errors: parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  const { classId } = parsedData.data;
  try {
    await prisma.class.delete({
      where: { id: classId },
    });
    revalidatePath("/", "layout"); // Revalidate the classes page to reflect the deleted class
  } catch (error) {
    console.error("Error deleting class:", error);
    return {
      status: "error",
      errors: [
        {
          path: [],
          message: "Wystąpił błąd podczas usuwania klasy!",
        },
      ],
    };
  }
  redirect("/classes");
};

export {
  createUser,
  editUser,
  deleteUser,
  importUsers,
  editClass,
  deleteClass,
};
