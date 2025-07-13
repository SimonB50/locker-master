import Image from "next/image";
import prisma from "@/lib/database";
import { notFound } from "next/navigation";
import Pagination from "../../../../components/pagination";
import AddLocker from "./addLocker";
import Search from "../../../../components/search";
import EditLocker from "./editLocker";
import DeleteLocker from "./deleteLocker";
import EditZone from "./editZone";

export default async function ClassDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const zoneId = (await params).id;

  const zoneData = await prisma.zone
    .findUnique({
      where: { id: zoneId as string },
      select: {
        id: true,
        name: true,
        lockers: {
          select: {
            id: true,
            code: true,
            user: {
              select: {
                id: true,
                name: true,
                class: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return null;
    });

  if (!zoneData) notFound();

  const lockersCount = await prisma.locker.count({
    where: { zoneId: zoneId as string },
  });

  const paginationParams = await searchParams;
  const page = Number(paginationParams.page) || 1;
  const limit = Number(paginationParams.limit) || 20;
  const offset = (page - 1) * limit;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-3xl font-semibold">Stefa {zoneData.name}</span>
          <span className="text-lg">
            <span className="text-gray-500">Jednostka:</span>&nbsp;
            {zoneData.unit.name}
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <AddLocker zoneId={zoneData.id} />
          <EditZone zoneData={zoneData} />
        </div>
      </div>
      <Search />
      {zoneData.lockers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kod</th>
                  <th>Właściciel</th>
                  <th>Klasa</th>
                  <th className="text-end">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {zoneData.lockers
                  .sort((a, b) => {
                    // Split codes into parts (letters and numbers)
                    const aParts = a.code.match(/\d+|\D+/g) || [a.code];
                    const bParts = b.code.match(/\d+|\D+/g) || [b.code];

                    const maxLength = Math.max(aParts.length, bParts.length);

                    for (let i = 0; i < maxLength; i++) {
                      const aPart = aParts[i] || "";
                      const bPart = bParts[i] || "";

                      // Compare numerically if both parts are numbers
                      if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
                        const diff = parseInt(aPart) - parseInt(bPart);
                        if (diff !== 0) return diff;
                      } else {
                        // String comparison for non-numeric parts
                        const diff = aPart.localeCompare(bPart);
                        if (diff !== 0) return diff;
                      }
                    }

                    return 0;
                  })
                  .filter((locker) => {
                    const searchQuery = paginationParams.search
                      ? (paginationParams.search as string).toLowerCase()
                      : "";
                    return (
                      locker.code.toLowerCase().includes(searchQuery) ||
                      locker.user?.name.toLowerCase().includes(searchQuery) ||
                      locker.user?.class.name
                        .toLowerCase()
                        .includes(searchQuery)
                    );
                  })
                  .slice(offset, offset + limit)
                  .map((locker, index) => (
                    <tr key={locker.id}>
                      <td>{offset + index + 1}</td>
                      <td>{locker.code}</td>
                      <td>{locker.user?.name || "Brak"}</td>
                      <td>{locker.user?.class.name || "Brak"}</td>
                      <td className="flex flex-row justify-end gap-2">
                        <EditLocker lockerData={locker} />
                        <DeleteLocker lockerId={locker.id} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-end mt-4">
            <Pagination itemCount={lockersCount} />
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
            <h1 className="text-2xl font-bold mb-2">Brak szafek</h1>
            <p className="text-lg">
              Do tej strefy nie zostały dodane żadne szafki. <br />
              Dodaj szafki do strefy, by móc zacząć przypisywać je do uczniów.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
