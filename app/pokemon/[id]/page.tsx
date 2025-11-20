import Image from 'next/image'
import { notFound } from 'next/navigation'

import { AddToComparisonButton } from '@/components/pokemon/add-to-comparison-button'
import { PokemonStatsChart } from '@/components/pokemon/pokemon-stats-chart'
import { PokemonTypeBadge } from '@/components/pokemon/pokemon-type-badge'
import { pokemonApiClient, PokemonApiError } from '@/lib/api/pokemon'
import type { PokemonDetails } from '@/lib/types/pokemon'

type PokemonPageParams = Promise<{ id: string }>

const statColors = ['#2563eb'] as const

async function getPokemonDetails(param: string): Promise<PokemonDetails> {
	try {
		return await pokemonApiClient.getPokemon(param)
	} catch (error) {
		if (error instanceof PokemonApiError && error.status === 404) {
			notFound()
		}

		throw error
	}
}

export async function generateMetadata({ params }: { params: PokemonPageParams }) {
	const { id: pokemonId } = await params
	try {
		const pokemon = await pokemonApiClient.getPokemon(pokemonId)
		return {
			title: `${pokemon.name} | Pokemon`,
			description: `Statistiques et informations complètes pour ${pokemon.name}.`,
		}
	} catch {
		return {
			title: 'Pokémon introuvable',
		}
	}
}

export default async function PokemonDetailPage({
	params,
}: {
	params: PokemonPageParams
}) {
	const { id } = await params
	const pokemon = await getPokemonDetails(id)

	const imageSrc =
		pokemon.sprites.officialArtwork ??
		pokemon.sprites.dreamWorld ??
		pokemon.sprites.frontDefault ??
		'/next.svg'

	return (
		<div className="space-y-8">
			<section className="grid gap-6 rounded-2xl border bg-card p-6 md:grid-cols-[320px_1fr]">
				<div className="flex flex-col items-center gap-4">
					<div className="relative h-64 w-64">
						<Image
							src={imageSrc}
							alt={pokemon.name}
							fill
							sizes="256px"
							className="object-contain"
						/>
					</div>
					<AddToComparisonButton pokemon={pokemon} className="w-full" />
				</div>
				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground">#{pokemon.id}</p>
						<h1 className="text-4xl font-semibold capitalize">{pokemon.name}</h1>
					</div>
					<div className="flex flex-wrap gap-2">
						{pokemon.types.map((type) => (
							<PokemonTypeBadge key={type.type.name} type={type} />
						))}
					</div>
					<div className="grid gap-3 text-sm md:grid-cols-2">
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground text-xs uppercase">
								Taille
							</p>
							<p className="text-lg font-semibold">
								{(pokemon.height / 10).toFixed(1)} m
							</p>
						</div>
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground text-xs uppercase">
								Poids
							</p>
							<p className="text-lg font-semibold">
								{(pokemon.weight / 10).toFixed(1)} kg
							</p>
						</div>
					</div>
					<div>
						<h2 className="text-lg font-semibold">Capacités</h2>
						<ul className="mt-2 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
							{pokemon.abilities.map((ability) => (
								<li key={ability.ability.name} className="capitalize">
									{ability.ability.name} {ability.isHidden ? '(talent caché)' : ''}
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
			<section className="rounded-2xl border bg-card p-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold">Statistiques</h2>
					<p className="text-sm text-muted-foreground">
						Représentation radar des stats de base
					</p>
				</div>
				<PokemonStatsChart
					datasets={[
						{
							id: pokemon.name,
							label: pokemon.name,
							stats: pokemon.stats,
							color: statColors[0],
						},
					]}
				/>
			</section>
		</div>
	)
}
