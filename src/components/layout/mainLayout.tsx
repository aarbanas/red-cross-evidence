import React, { type ReactNode } from "react";
import { BookMarked, Users, IdCard } from "lucide-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewNavbar from "~/components/organisms/navbar/navbar";
import Header from "~/components/organisms/Header";
import { usePathname } from "next/navigation";

type Props = {
  children: ReactNode;
  headerChildren: ReactNode;
};

const MainLayout: React.FC<Readonly<Props>> = ({
  children,
  headerChildren,
}) => {
  return (
    <>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <NewNavbar title="Evidencija DCK PGŽ">
          <Navigation />
        </NewNavbar>

        <div className="flex flex-col">
          <Header>{headerChildren}</Header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

const Navigation = () => {
  const currentPath = usePathname();

  return (
    <nav className="grid items-start text-sm font-medium lg:px-4">
      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-red-100 ${currentPath === "/" ? "text-red-600" : ""}`}
        href="/"
      >
        <Users />
        Volonteri
      </Link>

      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-red-100 ${currentPath === "/educations" ? "text-red-600" : ""}`}
        href="/educations"
      >
        <BookMarked />
        Edukacije
      </Link>

      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-red-100 ${currentPath === "/licenses" ? "text-red-600" : ""}`}
        href="/licenses"
      >
        <IdCard />
        Licence
      </Link>
    </nav>
  );
};

export default MainLayout;
