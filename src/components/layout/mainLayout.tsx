import React, { type ReactNode } from "react";
import { Building, CornerDownLeft, Users } from "lucide-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewNavbar from "~/components/ui/navbar/navbar";
import Header from "~/components/ui/Header";

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
          {children}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

const Navigation = () => {
  return (
    <nav className="grid items-start text-sm font-medium lg:px-4">
      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900`}
        href="/"
      >
        <Users />
        Lista volontera
      </Link>
      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900`}
        href="/admin/organisations"
      >
        <Building />
        Organisation list
      </Link>
      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900`}
        href="/dashboard"
      >
        <CornerDownLeft />
        Return to Dashboard
      </Link>
    </nav>
  );
};

export default MainLayout;
