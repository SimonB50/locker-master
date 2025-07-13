import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-8">
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
    </div>
  );
}
