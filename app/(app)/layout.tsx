import {
  Building,
  Flag,
  House,
  List,
  People,
  Person,
} from "react-bootstrap-icons";
import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="navigation-drawer" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col drawer-content h-screen max-h-screen">
        <div className="navbar bg-base-300 lg:pl-4 flex-shrink-0">
          <div className="flex-1">
            <label
              htmlFor="navigation-drawer"
              className="btn btn-square btn-ghost drawer-button lg:hidden"
            >
              <List className="text-xl" />
            </label>
          </div>
          <div className="flex-none">
            <div tabIndex={0} className="flex flex-row gap-2 items-center justify-center px-4">
              <Person className="text-3xl" />
              <span>Portiernia</span>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-auto p-4">{children}</div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="navigation-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-1">
          <li className="text-2xl text-center font-semibold">LockerMaster</li>
          <div className="divider"></div>
          <li>
            <Link href="/" className="flex flex-row items-center text-xl">
              <House />
              Strona główna
            </Link>
          </li>
          <li>
            <Link
              href="/classes"
              className="flex flex-row items-center text-xl"
            >
              <People />
              Klasy
            </Link>
          </li>
          <li>
            <Link href="/zones" className="flex flex-row items-center text-xl">
              <Flag />
              Strefy
            </Link>
          </li>
          <li>
            <Link href="/units" className="flex flex-row items-center text-xl">
              <Building />
              Jednostki
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
