'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { pokemonApiClient } from '@/lib/api/pokemon'
import { usePokemonSearch } from '@/lib/hooks/use-pokemon'
import { pokemonSearchSchema } from '@/lib/validators/pokemon'

const DIRECTORY_LIMIT = 2000
const MIN_SUGGESTION_CHARS = 2
const MAX_SUGGESTIONS = 6

const shouldFetchDetail = (query: string) => {
	if (!query) {
		return false
	}

	if (/^\d+$/.test(query)) {
		return true
	}

	return query.length >= 3
}

export function PokemonSearch() {
	const router = useRouter()
	const [liveQuery, setLiveQuery] = useState('')

	const form = useForm({
		defaultValues: { query: '' },
		onSubmit: async ({ value }) => {
			const parsed = pokemonSearchSchema.safeParse(value)
			if (!parsed.success) {
				return
			}
			router.push(`/pokemon/${parsed.data.query}`)
		},
	})

	const normalizedQuery = useMemo(() => {
		const parsed = pokemonSearchSchema.shape.query.safeParse(liveQuery)
		return parsed.success ? parsed.data : ''
	}, [liveQuery])

	const detailQuery = shouldFetchDetail(normalizedQuery) ? normalizedQuery : ''
	const { data, isFetching, isError } = usePokemonSearch(detailQuery)

	const { data: directory } = useQuery({
		queryKey: ['pokemon', 'directory'],
		queryFn: () => pokemonApiClient.getPokemonList(DIRECTORY_LIMIT, 0),
		staleTime: 1000 * 60 * 60 * 24,
		gcTime: 1000 * 60 * 60 * 24,
	})

	const suggestions = useMemo(() => {
		if (!directory || normalizedQuery.length < MIN_SUGGESTION_CHARS) {
			return []
		}

		return directory.results
			.filter((entry) => entry.name.startsWith(normalizedQuery))
			.slice(0, MAX_SUGGESTIONS)
	}, [directory, normalizedQuery])

	const handleSubmit = async () => {
		await form.handleSubmit()
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<h2 className="text-xl font-semibold">Rechercher un Pokémon</h2>
				<p className="text-sm text-muted-foreground">
					Par nom, ID ou slug officiel (ex. pikachu, 25, charizard)
				</p>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(event) => {
						event.preventDefault()
						handleSubmit()
					}}
					className="flex flex-col gap-3"
				>
					<form.Field
						name="query"
						validators={{
							onChange: ({ value }) => {
								const result = pokemonSearchSchema.shape.query.safeParse(
									value
								)
								return result.success
									? undefined
									: 'Utilisez lettres, chiffres ou \"-\"'
							},
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-2">
								<div className="flex gap-2">
									<Input
										value={field.state.value}
										onChange={(event) => {
											const value = event.target.value
											field.handleChange(value)
											setLiveQuery(value)
										}}
										placeholder="bulbasaur, 001, lucario..."
										aria-label="Recherche Pokémon"
									/>
									<Button type="submit" className="min-w-[120px]">
										Rechercher
									</Button>
								</div>
								{field.state.meta.errors?.length ? (
									<p className="text-sm text-destructive">
										{field.state.meta.errors[0]}
									</p>
								) : null}
							</div>
						)}
					</form.Field>
				</form>
				<div className="mt-4 space-y-4">
					{isFetching ? (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Loader2 className="size-4 animate-spin" />
							<span>Chargement...</span>
						</div>
					) : null}
					{detailQuery && isError ? (
						<p className="text-sm text-destructive">
							Aucun Pokémon trouvé. Vérifiez l’orthographe.
						</p>
					) : null}
					{data ? (
						<div className="rounded-md border p-4 text-sm">
							<p className="font-semibold capitalize">{data.name}</p>
							<p className="text-muted-foreground">#{data.id}</p>
							<Button className="mt-3 w-full" asChild>
								<Link href={`/pokemon/${data.name}`}>Voir le détail</Link>
							</Button>
						</div>
					) : null}
					{suggestions.length ? (
						<div className="space-y-2">
							<p className="text-xs font-semibold uppercase text-muted-foreground">
								Suggestions
							</p>
							<ul className="space-y-2">
								{suggestions.map((entry, index) => (
									<motion.li
										key={entry.name}
										initial={{ opacity: 0, x: -8 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.05 }}
										whileHover={{ scale: 1.02 }}
										className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
									>
										<span className="capitalize">{entry.name}</span>
										<Button variant="outline" size="sm" asChild>
											<Link href={`/pokemon/${entry.name}`}>Détails</Link>
										</Button>
									</motion.li>
								))}
							</ul>
						</div>
					) : null}
				</div>
			</CardContent>
		</Card>
	)
}
