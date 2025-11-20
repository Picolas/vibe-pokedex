import { PokemonCatalog } from '@/components/pokemon/pokemon-catalog'
import { PokemonSearch } from '@/components/pokemon/pokemon-search'

export const metadata = {
	title: 'Recherche | Pokemon',
}

export default function SearchPage() {
	return (
		<div className="space-y-8">
			<section className="space-y-4">
				<div>
					<h1 className="text-3xl font-semibold">Recherche avancée</h1>
					<p className="text-sm text-muted-foreground">
						Filtrez un Pokémon par nom ou identifiant, puis parcourez le catalogue.
					</p>
				</div>
				<PokemonSearch />
			</section>
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold">Catalogue</h2>
					{/* <p className="text-sm text-muted-foreground">
						Pagination côté client alimentée par React Query.
					</p> */}
				</div>
				<PokemonCatalog />
			</section>
		</div>
	)
}
