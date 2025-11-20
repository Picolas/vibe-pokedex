'use client'

import { useMemo } from 'react'
import {
	keepPreviousData,
	useQuery,
	type UseQueryOptions,
	type UseQueryResult,
} from '@tanstack/react-query'

import { pokemonApiClient, PokemonApiError } from '@/lib/api/pokemon'
import type { PokemonDetails, PokemonListResponse } from '@/lib/types/pokemon'
import { pokemonSearchSchema } from '@/lib/validators/pokemon'

const pokemonKeys = {
	all: ['pokemon'] as const,
	lists: () => [...pokemonKeys.all, 'list'] as const,
	list: (params: { limit: number; offset: number }) =>
		[...pokemonKeys.lists(), params] as const,
	detail: (idOrName: string | number) =>
		[...pokemonKeys.all, 'detail', String(idOrName)] as const,
	search: (term: string) => [...pokemonKeys.all, 'search', term] as const,
}

interface ListParams {
	readonly limit?: number
	readonly offset?: number
}

const defaultListParams: Required<ListParams> = {
	limit: 24,
	offset: 0,
}

export const usePokemonList = (
	params: ListParams = {},
	options?: UseQueryOptions<PokemonListResponse, PokemonApiError>
): UseQueryResult<PokemonListResponse, PokemonApiError> => {
	const mergedParams = {
		...defaultListParams,
		...params,
	}

	return useQuery<PokemonListResponse, PokemonApiError>({
		queryKey: pokemonKeys.list(mergedParams),
		queryFn: () =>
			pokemonApiClient.getPokemonList(
				mergedParams.limit,
				mergedParams.offset
			),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
		...options,
	})
}

export const usePokemon = (
	idOrName: string | number | null,
	options?: UseQueryOptions<PokemonDetails, PokemonApiError>
): UseQueryResult<PokemonDetails, PokemonApiError> => {
	const enabled =
		typeof idOrName === 'string' || typeof idOrName === 'number'

	const queryKey = enabled
		? pokemonKeys.detail(idOrName)
		: pokemonKeys.detail('uninitialized')

	return useQuery<PokemonDetails, PokemonApiError>({
		queryKey,
		queryFn: () => pokemonApiClient.getPokemon(idOrName ?? ''),
		enabled,
		staleTime: 1000 * 60 * 60,
		...options,
	})
}

export const usePokemonSearch = (
	searchTerm: string,
	options?: UseQueryOptions<PokemonDetails, PokemonApiError>
): UseQueryResult<PokemonDetails, PokemonApiError> => {
	const parsed = useMemo(
		() => pokemonSearchSchema.shape.query.safeParse(searchTerm),
		[searchTerm]
	)

	const normalizedTerm = parsed.success ? parsed.data : 'uninitialized'

	return useQuery<PokemonDetails, PokemonApiError>({
		queryKey: pokemonKeys.search(normalizedTerm),
		queryFn: () => pokemonApiClient.searchPokemon(normalizedTerm),
		enabled: parsed.success,
		staleTime: 1000 * 60 * 10,
		gcTime: 1000 * 60 * 30,
		...options,
	})
}
