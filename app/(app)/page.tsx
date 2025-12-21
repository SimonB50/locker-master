import Image from "next/image";
import {checkUpdates} from "@/lib/git";

export default async function Home() {
  const updates = await checkUpdates();
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full gap-8">
      <Image
        src="/undraw_mornings_kmib.svg"
        alt="Welcome"
        width={500}
        height={500}
      />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Witaj w LockerMaster!</h1>
        <p className="text-lg mb-4">
          Twoje centrum zarządzania szafkami szkolnymi.
        </p>
      </div>
      <div className="absolute bottom-4 text-center text-sm text-gray-500">
        {updates ? (
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Dostępna jest nowa wersja aplikacji!</span>
            <div className="flex justify-end gap-4">
              <span>Obecna wersja: {updates.local.hash.substring(0, 7)} - {new Date(updates.local.date).toLocaleDateString()}</span>
              <span>→</span>
              <span>Najnowsza wersja: {updates.remote.hash.substring(0, 7)} - {new Date(updates.remote.date).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <p>Posiadasz najnowszą wersję aplikacji.</p>
        )}
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour