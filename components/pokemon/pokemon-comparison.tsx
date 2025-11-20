'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAtomValue, useSetAtom } from 'jotai'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { POKEMON_STAT_LABELS, POKEMON_STAT_ORDER } from '@/lib/constants/pokemon-stats'
import {
	comparisonPokemonsAtom,
	removeFromComparisonAtom,
} from '@/lib/store/comparison'

import { PokemonStatsChart } from './pokemon-stats-chart'
import { PokemonTypeBadge } from './pokemon-type-badge'
import { cn } from '@/lib/utils'

const detailLabels: Record<string, string> = {
	height: 'Taille',
	weight: 'Poids',
}

const formatMeasurement = (value: number, unit: string) => {
	return `${(value / 10).toFixed(1)} ${unit}`
}

export function PokemonComparison() {
	const pokemons = useAtomValue(comparisonPokemonsAtom)
	const removePokemon = useSetAtom(removeFromComparisonAtom)

	const canCompare = pokemons.length === 2
	const statRows = canCompare
		? POKEMON_STAT_ORDER.map((stat) => {
				const values = pokemons.map(
					(pokemon) =>
						pokemon.stats.find((entry) => entry.name === stat)?.baseStat ?? 0
				)
				const bestValue = Math.max(...values)
				const isTie = values.every((value) => value === bestValue)

				return {
					stat,
					values,
					bestValue,
					isTie,
				}
		  })
		: []

	const totals = pokemons.map((pokemon) =>
		pokemon.stats.reduce((acc, stat) => acc + stat.baseStat, 0)
	)
	const maxTotal = Math.max(...totals)
	const totalWinnerIndices = totals
		.map((value, index) => ({ value, index }))
		.filter(({ value }) => value === maxTotal)
	const hasTotalTie = totalWinnerIndices.length !== 1
	const totalWinner = hasTotalTie ? null : totalWinnerIndices[0].index

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-semibold">Comparaison</h2>
				<p className="text-sm text-muted-foreground">
					Ajoutez deux Pokémons pour comparer leurs statistiques et attributs.
				</p>
			</div>
			{pokemons.length === 0 ? (
				<Card>
					<CardContent className="py-10 text-center text-muted-foreground">
						Commencez par ajouter des Pokémons via les cartes de la liste ou les
							fiches détaillées.
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{pokemons.map((pokemon) => (
						<Card key={pokemon.id} className="flex flex-col">
							<CardHeader className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold capitalize">
										{pokemon.name}
									</h3>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removePokemon(pokemon.id)}
									>
										Retirer
									</Button>
								</div>
								<div className="flex gap-2">
									{pokemon.types.map((type) => (
										<PokemonTypeBadge key={type.type.name} type={type} />
									))}
								</div>
							</CardHeader>
							<CardContent className="flex flex-1 flex-col gap-4">
								<div className="flex flex-col items-center gap-2">
									<div className="relative h-40 w-40">
										<Image
											src={
												pokemon.sprites.officialArtwork ??
												pokemon.sprites.frontDefault ??
												'/next.svg'
											}
											alt={pokemon.name}
											fill
											sizes="160px"
											className="object-contain"
										/>
									</div>
									<Button variant="outline" size="sm" className="w-full" asChild>
										<Link
											href={`/pokemon/${pokemon.id}`}
											className="flex items-center justify-center"
										>
											Détails
										</Link>
									</Button>
								</div>
								<div className="rounded-lg border p-3 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											{detailLabels.height}
										</span>
										<span>{formatMeasurement(pokemon.height, 'm')}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											{detailLabels.weight}
										</span>
										<span>{formatMeasurement(pokemon.weight, 'kg')}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
			{canCompare ? (
				<Card>
					<CardHeader>
						<h3 className="text-lg font-semibold">Statistiques comparées</h3>
					</CardHeader>
					<CardContent>
						<PokemonStatsChart
							datasets={pokemons.map((pokemon, index) => ({
								id: pokemon.name,
								label: pokemon.name,
								stats: pokemon.stats,
								color: index === 0 ? '#2563eb' : '#f97316',
							}))}
						/>
						<div className="mt-6 space-y-4">
							<div className="grid gap-2 text-sm">
								{statRows.map(({ stat, values, bestValue, isTie }) => (
									<div
										key={stat}
										className="grid gap-4 rounded-md border px-3 py-2 md:grid-cols-[1fr_1fr_1fr]"
									>
										<span className="text-muted-foreground text-xs uppercase">
											{POKEMON_STAT_LABELS[stat]}
										</span>
										{values.map((value, index) => {
											const isBest = !isTie && value === bestValue
											return (
												<span
													key={`${stat}-${pokemons[index].id}`}
													className={cn(
														'font-medium capitalize',
														isBest ? 'text-primary font-semibold' : undefined
													)}
												>
													{pokemons[index].name}: {value}
												</span>
											)
										})}
									</div>
								))}
							</div>
							<div className="rounded-md bg-muted/40 p-4 text-sm">
								{hasTotalTie || totalWinner === null ? (
									<p>
										Égalité parfaite : les deux Pokémons totalisent{' '}
										<span className="font-semibold">{totals[0]}</span> points
										de stats.
									</p>
								) : (
									<p>
										<span className="font-semibold capitalize">
											{pokemons[totalWinner].name}
										</span>{' '}
										prend l’avantage avec{' '}
										<span className="font-semibold">{totals[totalWinner]}</span>{' '}
										points contre{' '}
										<span className="font-semibold">
											{totals[totalWinner === 0 ? 1 : 0]}
										</span>
										.
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			) : null}
		</div>
	)
}
