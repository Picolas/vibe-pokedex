'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Scale, Search } from 'lucide-react'
import { useAtomValue } from 'jotai'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import { comparisonCountAtom } from '@/lib/store/comparison'

interface NavItem {
	readonly href: string
	readonly label: string
	readonly icon: React.ComponentType<{ className?: string }>
	readonly badge?: boolean
}

const navItems: readonly NavItem[] = [
	{
		href: '/',
		label: 'Accueil',
		icon: LayoutDashboard,
	},
	{
		href: '/search',
		label: 'Recherche',
		icon: Search,
	},
	{
		href: '/compare',
		label: 'Comparaison',
		icon: Scale,
		badge: true,
	},
]

export function AppSidebar() {
	const pathname = usePathname()
	const comparisonCount = useAtomValue(comparisonCountAtom)

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 p-2">
					<div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-base font-bold">
						P
					</div>
					<div>
						<p className="text-sm font-semibold">Pokemon</p>
						<p className="text-xs text-muted-foreground">Pokedex</p>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton asChild isActive={pathname === item.href}>
										<Link href={item.href}>
											<item.icon className="size-4" />
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
									{item.badge && comparisonCount ? (
										<SidebarMenuBadge>{comparisonCount}</SidebarMenuBadge>
									) : null}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<p className="text-xs text-muted-foreground">
					Données fournies par PokeAPI.
				</p>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
