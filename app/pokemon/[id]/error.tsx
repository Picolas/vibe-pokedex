'use client'

import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function PokemonError({ reset }: { reset: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
			<AlertTriangle className="size-10 text-destructive" />
			<div>
				<h2 className="text-2xl font-semibold">Impossible de charger ce Pokémon</h2>
				<p className="text-muted-foreground">
					Vérifiez votre connexion ou réessayez dans quelques instants.
				</p>
			</div>
			<Button onClick={() => reset()}>Réessayer</Button>
		</div>
	)
}
