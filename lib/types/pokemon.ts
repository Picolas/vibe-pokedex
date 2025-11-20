export interface NamedApiResource {
	readonly name: string
	readonly url: string
}

export type PokemonStatName =
	| 'hp'
	| 'attack'
	| 'defense'
	| 'special-attack'
	| 'special-defense'
	| 'speed'

export interface PokemonStat {
	readonly baseStat: number
	readonly effort: number
	readonly name: PokemonStatName
}

export interface PokemonTypeSlot {
	readonly slot: number
	readonly type: NamedApiResource
}

export interface PokemonSprites {
	readonly frontDefault: string | null
	readonly officialArtwork: string | null
	readonly dreamWorld: string | null
}

export interface PokemonAbilitySlot {
	readonly ability: NamedApiResource
	readonly isHidden: boolean
	readonly slot: number
}

export interface PokemonDetails {
	readonly id: number
	readonly name: string
	readonly height: number
	readonly weight: number
	readonly sprites: PokemonSprites
	readonly types: PokemonTypeSlot[]
	readonly stats: PokemonStat[]
	readonly abilities: PokemonAbilitySlot[]
}

export interface PokemonListEntry {
	readonly name: string
	readonly url: string
}

export interface PokemonListResponse {
	readonly count: number
	readonly next: string | null
	readonly previous: string | null
	readonly results: PokemonListEntry[]
}

export interface PokemonComparisonPair {
	readonly primary: PokemonDetails
	readonly secondary: PokemonDetails
}
