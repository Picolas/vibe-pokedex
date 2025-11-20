'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
			<AlertCircle className="size-10 text-destructive" />
			<div>
				<h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
				<p className="text-muted-foreground">
					Veuillez réessayer ou revenir à l’accueil.
				</p>
			</div>
			<div className="flex gap-2">
				<Button onClick={() => reset()}>Réessayer</Button>
				<Button variant="outline" asChild>
					<Link href="/">Accueil</Link>
				</Button>
			</div>
		</div>
	)
}
