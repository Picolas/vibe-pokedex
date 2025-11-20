import type { PokemonStatName } from '@/lib/types/pokemon'

export const POKEMON_STAT_ORDER: readonly PokemonStatName[] = [
	'hp',
	'attack',
	'defense',
	'special-attack',
	'special-defense',
	'speed',
]

export const POKEMON_STAT_LABELS: Record<PokemonStatName, string> = {
	attack: 'ATK',
	defense: 'DEF',
	hp: 'HP',
	speed: 'SPD',
	'special-attack': 'SpA',
	'special-defense': 'SpD',
}
