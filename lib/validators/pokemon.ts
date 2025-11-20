import { z } from 'zod'

import type {
	NamedApiResource,
	PokemonAbilitySlot,
	PokemonDetails,
	PokemonListEntry,
	PokemonListResponse,
	PokemonSprites,
	PokemonStat,
	PokemonStatName,
	PokemonTypeSlot,
} from '@/lib/types/pokemon'

const namedResourceSchema = z.object({
	name: z.string().min(1),
	url: z.string().url(),
})

const spriteSchema = z.object({
	front_default: z.string().url().nullable(),
	other: z
		.object({
			'dream_world': z
				.object({
					front_default: z.string().url().nullable(),
				})
				.partial(),
			'official-artwork': z
				.object({
					front_default: z.string().url().nullable(),
				})
				.partial(),
		})
		.partial()
		.optional(),
})

const pokemonTypeSchema = z.object({
	slot: z.number().int().positive(),
	type: namedResourceSchema,
})

const pokemonAbilitySchema = z.object({
	ability: namedResourceSchema,
	is_hidden: z.boolean(),
	slot: z.number().int().positive(),
})

const pokemonStatSchema = z.object({
	base_stat: z.number().int().nonnegative(),
	effort: z.number().int().nonnegative(),
	stat: namedResourceSchema,
})

const pokemonListEntrySchema = z.object({
	name: z.string().min(1),
	url: z.string().url(),
})

export const pokemonApiSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1),
	height: z.number().int().positive(),
	weight: z.number().int().positive(),
	sprites: spriteSchema,
	types: z.array(pokemonTypeSchema).min(1),
	stats: z.array(pokemonStatSchema).min(1),
	abilities: z.array(pokemonAbilitySchema).min(1),
})

export const pokemonListSchema = z.object({
	count: z.number().int().nonnegative(),
	next: z.string().url().nullable(),
	previous: z.string().url().nullable(),
	results: z.array(pokemonListEntrySchema),
})

export const pokemonSearchSchema = z.object({
	query: z
		.string()
		.trim()
		.toLowerCase()
		.regex(/^[a-z0-9-]+$/, {
			message:
				'Le nom ou identifiant doit contenir uniquement lettres, chiffres ou "-".',
		})
		.min(1, 'Le champ est requis'),
})

const pokemonStatNames: readonly PokemonStatName[] = [
	'hp',
	'attack',
	'defense',
	'special-attack',
	'special-defense',
	'speed',
]

const isPokemonStatName = (value: string): value is PokemonStatName => {
	return pokemonStatNames.some((statName) => statName === value)
}

const mapSprites = (input: z.infer<typeof spriteSchema>): PokemonSprites => {
	return {
		frontDefault: input.front_default ?? null,
		officialArtwork:
			input.other?.['official-artwork']?.front_default ??
			input.front_default ??
			null,
		dreamWorld: input.other?.dream_world?.front_default ?? null,
	}
}

const mapTypes = (types: z.infer<typeof pokemonTypeSchema>[]): PokemonTypeSlot[] => {
	return types
		.map((entry) => ({
			slot: entry.slot,
			type: entry.type satisfies NamedApiResource,
		}))
		.sort((a, b) => a.slot - b.slot)
}

const mapStats = (stats: z.infer<typeof pokemonStatSchema>[]): PokemonStat[] => {
	return stats.map((stat) => {
		if (!isPokemonStatName(stat.stat.name)) {
			throw new Error(`Statistique inconnue: ${stat.stat.name}`)
		}

		return {
			baseStat: stat.base_stat,
			effort: stat.effort,
			name: stat.stat.name,
		}
	})
}

const mapAbilities = (
	abilities: z.infer<typeof pokemonAbilitySchema>[]
): PokemonAbilitySlot[] => {
	return abilities
		.map((entry) => ({
			ability: entry.ability as NamedApiResource,
			isHidden: entry.is_hidden,
			slot: entry.slot,
		}))
		.sort((a, b) => a.slot - b.slot)
}

export const parsePokemonDetails = (input: unknown): PokemonDetails => {
	const data = pokemonApiSchema.parse(input)

	return {
		id: data.id,
		name: data.name,
		height: data.height,
		weight: data.weight,
		sprites: mapSprites(data.sprites),
		types: mapTypes(data.types),
		stats: mapStats(data.stats),
		abilities: mapAbilities(data.abilities),
	}
}

export const parsePokemonListResponse = (
	input: unknown
): PokemonListResponse => {
	return pokemonListSchema.parse(input)
}

export const parsePokemonListEntries = (
	input: unknown
): PokemonListEntry[] => {
	return pokemonListSchema.shape.results.parse(input)
}
