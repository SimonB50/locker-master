import Image from "next/image";
import prisma from "@/lib/database";
import AddClass from "./addClass";
import Link from "next/link";

export default async function Classes() {
  const units = await prisma.unit
    .findMany({
      select: {
        id: true,
        name: true,
        classes: {
          select: {
            id: true,
            name: true,
            teacher: true,
          },
        },
      },
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return [];
    });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-3xl font-semibold">Klasy</span>
          <span className="text-lg">Lista klas dodanych do systemu</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <AddClass availableUnits={units} />
        </div>
      </div>
      <div className="divider my-1"></div>
      {units.length > 0 && units.some((x) => x.classes.length) ? (
        units
          .filter((x) => x.classes.length)
          .map((unit) => (
            <div key={unit.id} className="collapse collapse-arrow mb-6">
              <input type="checkbox" defaultChecked />
              <h2 className="collapse-title text-2xl font-semibold mb-2">
                {unit.name}
              </h2>
              <div className="collapse-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {unit.classes
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((cls) => (
                    <Link
                      key={cls.id}
                      href={`/classes/${cls.id}`}
                      className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="card-body items-center justify-center">
                        <span className="card-title text-3xl">{cls.name}</span>
                        <p className="text-sm text-gray-500">{cls.teacher}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Image
            src="/undraw_no-data_ig65.svg"
            alt="No classes found"
            width={200}
            height={200}
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Brak klas</h1>
            <p className="text-lg">
              Nie znaleziono żadnych klas w systemie. <br />
              Dodaj pierwszą klasę, aby rozpocząć.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
