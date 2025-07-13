import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-8">
      <Image src="/undraw_lost_teip.svg" alt="Lost" width={400} height={400} />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Strona nie znaleziona</h1>
        <p className="text-lg mb-2">
          Te zakątki nie zostały jeszcze odkryte. Pora wrócić na szlak!
        </p>
      </div>
      <Link href="/" className="btn btn-primary">
        Wróć do strony głównej
      </Link>
    </div>
  );
}
