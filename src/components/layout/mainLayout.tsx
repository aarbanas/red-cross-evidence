'use client';

import {
  BookMarked,
  Building2,
  IdCard,
  LogOut,
  Settings,
  Shirt,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import type React from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '@/components/organisms/Header';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserRole } from '@/server/db/schema';

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

const navItems = [
  {
    href: AppRoutes.HOME,
    label: 'Korisnici',
    icon: Users,
    route: AppRoutes.HOME,
  },
  {
    href: `${AppRoutes.EDUCATIONS}/term`,
    label: 'Edukacije',
    icon: BookMarked,
    route: AppRoutes.EDUCATIONS,
  },
  {
    href: AppRoutes.LICENSES,
    label: 'Licence',
    icon: IdCard,
    route: AppRoutes.LICENSES,
  },
  {
    href: AppRoutes.EQUIPMENT,
    label: 'Oprema',
    icon: Shirt,
    route: AppRoutes.EQUIPMENT,
  },
  {
    href: `${AppRoutes.SOCIETIES}/list`,
    label: 'Društva',
    icon: Building2,
    route: AppRoutes.SOCIETIES,
  },
];

const MainLayout: React.FC<Readonly<Props>> = ({
  children,
  headerChildren,
}) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN;

  const onLogoutClick = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-14 items-center gap-2 px-2">
            <Image
              src="/red_cross.png"
              alt="Crveni Križ logo"
              width={28}
              height={28}
            />
            <span className="font-semibold text-sm">Evidencija DCK PGŽ</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(item.route)}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes('/config')}
                >
                  <Link href="/config">
                    <Settings />
                    <span>Konfiguracija</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onLogoutClick}>
                <LogOut />
                <span>Odjava</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Header>
          <SidebarTrigger className="-ml-1 lg:hidden" />
          {headerChildren}
        </Header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </SidebarInset>

      <ToastContainer />
    </SidebarProvider>
  );
};

export default MainLayout;
