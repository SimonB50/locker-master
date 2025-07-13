import Image from "next/image";
import prisma from "@/lib/database";
import AddClass from "./addZone";
import Link from "next/link";

export default async function Zones() {
  const units = await prisma.unit
    .findMany({
      select: {
        id: true,
        name: true,
        zones: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                lockers: true,
              },
            },
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
          <span className="text-3xl font-semibold">Strefy</span>
          <span className="text-lg">Wyznaczone strefy dla szafek</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <AddClass availableUnits={units} />
        </div>
      </div>
      <div className="divider my-1"></div>
      {units.length > 0 && units.some((x) => x.zones.length) ? (
        units
          .filter((x) => x.zones.length)
          .map((unit) => (
            <div key={unit.id} className="collapse collapse-arrow mb-6">
              <input type="checkbox" defaultChecked />
              <h2 className="collapse-title text-2xl font-semibold mb-2">
                {unit.name}
              </h2>
              <div className="collapse-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {unit.zones
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((zn) => (
                    <Link
                      key={zn.id}
                      href={`/zones/${zn.id}`}
                      className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="card-body items-center justify-center">
                        <span className="card-title text-2xl">{zn.name}</span>
                        <p className="text-sm text-gray-500">
                          {zn._count.lockers} szafek
                        </p>
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
            <h1 className="text-2xl font-bold mb-2">Brak stref</h1>
            <p className="text-lg">
              Nie znaleziono żadnych stref w systemie. <br />
              Dodaj pierwszą strefę, aby móc tworzyć w niej nowe szafki.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
