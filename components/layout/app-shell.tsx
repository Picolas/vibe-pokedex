'use client'

import Link from 'next/link'
import { Scale } from 'lucide-react'
import { useAtomValue } from 'jotai'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { comparisonCountAtom } from '@/lib/store/comparison'

import { AppSidebar } from './app-sidebar'

export interface AppShellProps {
	readonly children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
	const comparisonCount = useAtomValue(comparisonCountAtom)

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 items-center gap-4 border-b px-4">
					<SidebarTrigger />
					<Separator orientation="vertical" className="h-6" />
					<div className="flex flex-1 items-center justify-end gap-3 text-sm text-muted-foreground">
						<Button variant="outline" size="sm" asChild>
							<Link href="/compare" className="flex items-center gap-2">
								<Scale className="size-4" />
								<span>Comparaison</span>
								{comparisonCount ? (
									<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
										{comparisonCount}/2
									</span>
								) : null}
							</Link>
						</Button>
					</div>
				</header>
				<div className="flex-1 p-4 md:p-6">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
