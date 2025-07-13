import Image from "next/image";
import prisma from "@/lib/database";
import AddUnit from "./addUnit";
import EditUnit from "./editUnit";
import DeleteUnit from "./deleteUnit";

export default async function Classes() {
  const units = await prisma.unit
    .findMany({
      select: {
        id: true,
        name: true,
      },
    })
    .catch((error) => {
      console.error("Error fetching units:", error);
      return [];
    });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-3xl font-semibold">Jednostki</span>
          <span className="text-lg">
            Lista jednostek wśród których rozdzielone są utworzone zasoby
          </span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <AddUnit />
        </div>
      </div>
      <div className="divider my-1"></div>
      {units.length > 0 ? (
        <div className="flex flex-col gap-4">
          {units.map((unt) => (
            <div
              key={unt.id}
              className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
            >
              <div className="card-body flex-row items-center justify-between">
                <h2 className="card-title text-xl">{unt.name}</h2>
                <div className="card-actions">
                  <EditUnit unitData={unt} />
                  <DeleteUnit unitId={unt.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Image
            src="/undraw_no-data_ig65.svg"
            alt="No classes found"
            width={200}
            height={200}
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Brak jednostek</h1>
            <p className="text-lg">
              Nie znaleziono żadnych jednostek. <br />
              Dodaj pierwszą jednostkę, aby rozpocząć pracę z systemem.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
