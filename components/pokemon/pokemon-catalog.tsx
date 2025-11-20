'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'
import { pokemonApiClient } from '@/lib/api/pokemon'
import type { PokemonDetails } from '@/lib/types/pokemon'

import { PokemonCard } from './pokemon-card'

const PAGE_LIMIT = 12

interface CatalogPage {
	items: PokemonDetails[]
	nextOffset: number | null
}

export function PokemonCatalog() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isFetching,
	} = useInfiniteQuery<CatalogPage>({
		queryKey: ['pokemon', 'catalog'],
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
		queryFn: async ({ pageParam }) => {
			const list = await pokemonApiClient.getPokemonList(PAGE_LIMIT, pageParam as number)
			const items = await Promise.all(
				list.results.map((entry) => pokemonApiClient.getPokemon(entry.name))
			)

			return {
				items,
				nextOffset: list.next ? (pageParam as number) + PAGE_LIMIT : null,
			}
		},
	})

	const pokemons = useMemo(() => {
		return data?.pages.flatMap((page) => page.items) ?? []
	}, [data])

	const sentinelRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const node = sentinelRef.current
		if (!node || !hasNextPage) {
			return
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries
				if (entry.isIntersecting && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{
				rootMargin: '200px',
			}
		)

		observer.observe(node)

		return () => observer.disconnect()
	}, [hasNextPage, fetchNextPage, isFetchingNextPage])

	const isInitialLoading = status === 'pending'

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{isInitialLoading && pokemons.length === 0
					? Array.from({ length: PAGE_LIMIT }).map((_, index) => (
							<Skeleton key={index} className="h-64 w-full" />
					  ))
					: pokemons.map((pokemon) => (
						<PokemonCard key={pokemon.id} pokemon={pokemon} />
					  ))}
				{!isInitialLoading && pokemons.length === 0 ? (
					<div className="col-span-full rounded-lg border p-6 text-center text-muted-foreground">
						Aucun Pokémon disponible.
					</div>
				) : null}
			</div>
			<div ref={sentinelRef} />
			<div className="flex items-center justify-center py-4">
				{isFetchingNextPage ? (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" />
						<span>Chargement de la page suivante...</span>
					</div>
				) : null}
				{!hasNextPage && pokemons.length > 0 ? (
					<p className="text-xs text-muted-foreground">
						Vous avez atteint la fin de la liste.
					</p>
				) : null}
				{isFetching && !isFetchingNextPage ? (
					<Loader2 className="size-4 animate-spin" />
				) : null}
			</div>
		</div>
	)
}
