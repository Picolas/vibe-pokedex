import { parsePokemonDetails, parsePokemonListResponse } from '@/lib/validators/pokemon'
import type {
	PokemonDetails,
	PokemonListResponse,
} from '@/lib/types/pokemon'

const DEFAULT_BASE_URL = 'https://pokeapi.co/api/v2/' as const
const DEFAULT_LIMIT = 24

export interface PokemonApiConfig {
	readonly baseUrl?: string
	readonly defaultLimit?: number
}

export class PokemonApiError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly details?: unknown
	) {
		super(message)
		this.name = 'PokemonApiError'
	}
}

interface RequestOptions extends RequestInit {
	readonly searchParams?: Record<string, string | number>
}

export class PokemonApiClient {
	private readonly baseUrl: string
	private readonly defaultLimit: number

	constructor(config: PokemonApiConfig = {}) {
		this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL
		this.defaultLimit = config.defaultLimit ?? DEFAULT_LIMIT
	}

	async getPokemon(idOrName: string | number): Promise<PokemonDetails> {
		const data = await this.request(`pokemon/${idOrName}`)
		return parsePokemonDetails(data)
	}

	async getPokemonList(
		limit = this.defaultLimit,
		offset = 0
	): Promise<PokemonListResponse> {
		try {
			const data = await this.request('pokemon', {
				searchParams: { limit, offset },
			})

			return parsePokemonListResponse(data)
		} catch (error) {
			if (error instanceof PokemonApiError && error.status >= 500) {
				console.warn('PokeAPI indisponible, retour liste vide', error)
				return {
					count: 0,
					next: null,
					previous: null,
					results: [],
				}
			}

			throw error
		}
	}

	async searchPokemon(term: string): Promise<PokemonDetails> {
		return this.getPokemon(term.trim().toLowerCase())
	}

	private async request(path: string, init?: RequestOptions): Promise<unknown> {
		const url = new URL(path, this.baseUrl)

		if (init?.searchParams) {
			Object.entries(init.searchParams).forEach(([key, value]) => {
				url.searchParams.set(key, String(value))
			})
		}

		const response = await fetch(url, {
			...init,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...init?.headers,
			},
		})

		if (!response.ok) {
			throw new PokemonApiError(
				`Erreur API Pokémon (${response.status})`,
				response.status,
				await this.safeReadBody(response)
			)
		}

		return response.json()
	}

	private async safeReadBody(response: Response): Promise<unknown> {
		try {
			return await response.json()
		} catch (error) {
			return { message: (error as Error).message }
		}
	}
}

export const pokemonApiClient = new PokemonApiClient()
