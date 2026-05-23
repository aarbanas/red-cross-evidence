import { BookMarked, Building2, IdCard, Shirt, Users } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';
import Header from '~/components/organisms/Header';
import NewNavbar from '~/components/organisms/navbar/navbar';

type Props = {
  children: ReactNode;
  headerChildren: ReactNode;
};

enum AppRoutes {
  HOME = '/users',
  EDUCATIONS = '/educations',
  LICENSES = '/licenses',
  EQUIPMENT = '/equipment',
  SOCIETIES = '/societies',
}

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
  const currentPath = usePathname() as AppRoutes;

  return (
    <nav className="grid items-start font-medium text-sm lg:px-4">
      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent ${currentPath.includes(AppRoutes.HOME) ? 'text-primary' : ''}`}
        href={AppRoutes.HOME}
      >
        <Users />
        Korisnici
      </Link>

      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-sidebar-accent ${currentPath.includes(AppRoutes.EDUCATIONS) ? 'text-primary' : ''}`}
        href={`${AppRoutes.EDUCATIONS}/term`}
      >
        <BookMarked />
        Edukacije
      </Link>

      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-sidebar-accent ${currentPath.includes(AppRoutes.LICENSES) ? 'text-primary' : ''}`}
        href={AppRoutes.LICENSES}
      >
        <IdCard />
        Licence
      </Link>

      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-sidebar-accent ${currentPath.includes(AppRoutes.EQUIPMENT) ? 'text-primary' : ''}`}
        href={AppRoutes.EQUIPMENT}
      >
        <Shirt />
        Oprema
      </Link>

      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-sidebar-accent ${currentPath.includes(AppRoutes.SOCIETIES) ? 'text-primary' : ''}`}
        href={`${AppRoutes.SOCIETIES}/list`}
      >
        <Building2 />
        Društva
      </Link>
    </nav>
  );
};

export default MainLayout;
