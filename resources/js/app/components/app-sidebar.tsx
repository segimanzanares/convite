import { Link, usePage } from '@inertiajs/react';
import { Globe, LayoutGrid, MailOpen, Package, Users } from 'lucide-react';
import { index as clientsIndex } from '@/actions/App/Http/Controllers/Admin/ClientController';
import {
    index as invitationsIndex,
    mine as invitationsMine,
} from '@/actions/App/Http/Controllers/Admin/InvitationController';
import { index as plansIndex } from '@/actions/App/Http/Controllers/Admin/PlanController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, landing } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Ver sitio',
        href: landing(),
        icon: Globe,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Panel',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(auth.user.role === 'admin'
            ? [
                  {
                      title: 'Clientes',
                      href: clientsIndex(),
                      icon: Users,
                  },
                  {
                      title: 'Invitaciones',
                      href: invitationsIndex(),
                      icon: MailOpen,
                  },
                  {
                      title: 'Planes',
                      href: plansIndex(),
                      icon: Package,
                  },
              ]
            : [
                  {
                      title: 'Mis invitaciones',
                      href: invitationsMine(),
                      icon: MailOpen,
                  },
              ]),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
