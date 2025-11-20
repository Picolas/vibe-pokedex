import { PokemonCard } from '@/components/pokemon/pokemon-card'
import { PokemonSearch } from '@/components/pokemon/pokemon-search'
import { pokemonApiClient } from '@/lib/api/pokemon'
import type { PokemonDetails } from '@/lib/types/pokemon'

export const revalidate = 1800

const FEATURED_LIMIT = 12
const FEATURED_FALLBACK: readonly string[] = [
	'bulbasaur',
	'ivysaur',
	'charmander',
	'charmeleon',
	'squirtle',
	'wartortle',
	'pikachu',
	'raichu',
	'eevee',
	'snorlax',
	'gengar',
	'dragonite',
]

async function resolvePokemons(names: readonly string[]): Promise<PokemonDetails[]> {
	const entries = await Promise.allSettled(
		names.map((name) => pokemonApiClient.getPokemon(name))
	)

	return entries
		.filter(
			(entry): entry is PromiseFulfilledResult<PokemonDetails> =>
				entry.status === 'fulfilled'
		)
		.map((entry) => entry.value)
}

async function getFeaturedPokemons(): Promise<PokemonDetails[]> {
	try {
		const list = await pokemonApiClient.getPokemonList(FEATURED_LIMIT, 0)
		return resolvePokemons(list.results.map((entry) => entry.name))
	} catch (error) {
		console.error('Impossible de récupérer la sélection de Pokémons', error)
		return resolvePokemons(FEATURED_FALLBACK)
	}
}

export default async function HomePage() {
	const featuredPokemons = await getFeaturedPokemons()

	return (
		<div className="space-y-8">
			<section className="rounded-2xl border bg-card p-6 md:p-8">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="space-y-3">
						<p className="text-sm font-medium text-primary">Pokedex</p>
						<h1 className="text-3xl font-semibold md:text-4xl">
							Explorez les Pokémons et comparez leurs forces
						</h1>
						<p className="text-muted-foreground max-w-2xl text-base">
							Recherchez un Pokémon par nom ou identifiant, consultez ses
							statistiques détaillées et comparez-le rapidement avec un autre.
						</p>
					</div>
				</div>
			</section>

			<section>
				<PokemonSearch />
			</section>

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-semibold">Sélection du moment</h2>
						<p className="text-sm text-muted-foreground">
							Les premiers Pokémons de la liste officielle
						</p>
					</div>
				</div>
				{featuredPokemons.length === 0 ? (
					<div className="rounded-lg border p-6 text-center text-muted-foreground">
						La sélection du moment est temporairement indisponible. Essayez de
						réactualiser plus tard ou utilisez la recherche ci-dessus.
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{featuredPokemons.map((pokemon) => (
							<PokemonCard key={pokemon.id} pokemon={pokemon} />
						))}
					</div>
				)}
			</section>
		</div>
	)
}
