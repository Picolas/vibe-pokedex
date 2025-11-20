'use client'

import { atom } from 'jotai'

import type { PokemonDetails } from '@/lib/types/pokemon'

export const MAX_COMPARISON_POKEMONS = 2

export const comparisonPokemonsAtom = atom<PokemonDetails[]>([])

export const comparisonCountAtom = atom((get) => get(comparisonPokemonsAtom).length)

export const canCompareAtom = atom((get) => get(comparisonCountAtom) === MAX_COMPARISON_POKEMONS)

export const isPokemonInComparisonAtom = atom((get) => {
	const ids = new Set(get(comparisonPokemonsAtom).map((pokemon) => pokemon.id))
	return (pokemonId: number) => ids.has(pokemonId)
})

export const addToComparisonAtom = atom(
	null,
	(get, set, pokemon: PokemonDetails) => {
		const current = get(comparisonPokemonsAtom)

		if (current.some((entry) => entry.id === pokemon.id)) {
			return
		}

		const nextEntries = [...current, pokemon]

		if (nextEntries.length > MAX_COMPARISON_POKEMONS) {
			nextEntries.shift()
		}

		set(comparisonPokemonsAtom, nextEntries)
	}
)

export const removeFromComparisonAtom = atom(
	null,
	(get, set, pokemonId: number) => {
		set(
			comparisonPokemonsAtom,
			get(comparisonPokemonsAtom).filter((pokemon) => pokemon.id !== pokemonId)
		)
	}
)

export const clearComparisonAtom = atom(null, (_get, set) => {
	set(comparisonPokemonsAtom, [])
})
