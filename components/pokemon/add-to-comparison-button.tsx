'use client'

import { useAtomValue, useSetAtom } from 'jotai'

import { Button } from '@/components/ui/button'
import {
	addToComparisonAtom,
	isPokemonInComparisonAtom,
} from '@/lib/store/comparison'
import type { PokemonDetails } from '@/lib/types/pokemon'

export interface AddToComparisonButtonProps {
	readonly pokemon: PokemonDetails
	readonly className?: string
}

export function AddToComparisonButton({
	pokemon,
	className,
}: AddToComparisonButtonProps) {
	const addPokemon = useSetAtom(addToComparisonAtom)
	const isInComparison = useAtomValue(isPokemonInComparisonAtom)
	const alreadySelected = isInComparison(pokemon.id)

	return (
		<Button
			className={className}
			onClick={() => addPokemon(pokemon)}
			disabled={alreadySelected}
		>
			{alreadySelected ? 'Déjà dans la comparaison' : 'Ajouter à la comparaison'}
		</Button>
	)
}
