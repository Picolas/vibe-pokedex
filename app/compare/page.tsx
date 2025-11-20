import { PokemonComparison } from '@/components/pokemon/pokemon-comparison'

export const metadata = {
	title: 'Comparer | Pokemon',
}

export default function ComparePage() {
	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold">Comparaison de Pokémons</h1>
				<p className="text-sm text-muted-foreground">
					Sélectionnez deux Pokémons dans la liste ou directement depuis leurs fiches
					pour visualiser leurs statistiques côte à côte.
				</p>
			</header>
			<PokemonComparison />
		</div>
	)
}
