import Image from "next/image";
import prisma from "@/lib/database";
import { notFound } from "next/navigation";
import Pagination from "../../../../components/pagination";
import AddUser from "./addUser";
import ImportUsers from "./importUsers";
import Search from "../../../../components/search";
import EditUser from "./editUser";
import DeleteUser from "./deleteUser";
import EditClass from "./editClass";

export default async function ClassDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const classId = (await params).id;

  const classData = await prisma.class
    .findUnique({
      where: { id: classId as string },
      select: {
        id: true,
        name: true,
        teacher: true,
        users: {
          select: {
            id: true,
            name: true,
            locker: {
              select: {
                id: true,
                code: true,
              },
            },
          },
        },
      },
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return null;
    });

  if (!classData) notFound();

  const studentsCount = await prisma.user.count({
    where: { classId: classId as string },
  });

  const paginationParams = await searchParams;
  const page = Number(paginationParams.page) || 1;
  const limit = Number(paginationParams.limit) || 20;
  const offset = (page - 1) * limit;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-3xl font-semibold">Klasa {classData.name}</span>
          <span className="text-lg">
            <span className="text-gray-500">Wychowawca:</span>&nbsp;
            {classData.teacher}
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <AddUser classId={classData.id} />
          <ImportUsers classId={classData.id} />
          <EditClass classData={classData} />
        </div>
      </div>
      <Search />
      {classData.users.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Imię</th>
                  <th>Nazwisko</th>
                  <th>Szafka</th>
                  <th className="text-end">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {classData.users
                  .sort((a, b) => {
                    const nameA = a.name
                      .toLowerCase()
                      .split(" ")
                      .reverse()
                      .join(" ");
                    const nameB = b.name
                      .toLowerCase()
                      .split(" ")
                      .reverse()
                      .join(" ");
                    return nameA.localeCompare(nameB);
                  })
                  .filter((user) => {
                    const searchQuery = paginationParams.search
                      ? (paginationParams.search as string).toLowerCase()
                      : "";
                    return (
                      user.name.toLowerCase().includes(searchQuery) ||
                      (user.locker?.code || "")
                        .toLowerCase()
                        .includes(searchQuery)
                    );
                  })
                  .slice(offset, offset + limit)
                  .map((user, index) => (
                    <tr key={user.id}>
                      <td>{offset + index + 1}</td>
                      <td>{user.name.split(" ")[0]}</td>
                      <td>{user.name.split(" ")[1]}</td>
                      <td>{user.locker?.code || "Brak"}</td>
                      <td className="flex flex-row justify-end gap-2">
                        <EditUser
                          userData={{
                            id: user.id,
                            name: user.name,
                            lockerCode: user.locker?.code || "",
                          }}
                        />
                        <DeleteUser userId={user.id} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-end mt-4">
            <Pagination itemCount={studentsCount} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Image
            src="/undraw_no-data_ig65.svg"
            alt="No users found"
            width={200}
            height={200}
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Brak uczniów</h1>
            <p className="text-lg">
              W tej klasie nie znajduje się żaden uczeń. <br />
              Zacznij dodawać uczniów, by móc przypisac im szafki.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
