'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAtomValue, useSetAtom } from 'jotai'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
	addToComparisonAtom,
	isPokemonInComparisonAtom,
} from '@/lib/store/comparison'
import type { PokemonDetails } from '@/lib/types/pokemon'
import { cn } from '@/lib/utils'

import { PokemonTypeBadge } from './pokemon-type-badge'

export interface PokemonCardProps {
	readonly pokemon: PokemonDetails
	readonly className?: string
}

const formatId = (id: number) => `#${id.toString().padStart(4, '0')}`

export function PokemonCard({ pokemon, className }: PokemonCardProps) {
	const addToComparison = useSetAtom(addToComparisonAtom)
	const isInComparison = useAtomValue(isPokemonInComparisonAtom)

	const artwork =
		pokemon.sprites.officialArtwork ??
		pokemon.sprites.dreamWorld ??
		pokemon.sprites.frontDefault ??
		'/next.svg'

	const alreadySelected = isInComparison(pokemon.id)

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -6 }}
			transition={{ type: 'spring', stiffness: 220, damping: 22 }}
			className="h-full"
		>
			<Card className={cn('flex h-full flex-col justify-between', className)}>
			<CardHeader className="space-y-3">
				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<span className="font-medium uppercase tracking-wide">
						{formatId(pokemon.id)}
					</span>
					<span className="capitalize">{pokemon.name}</span>
				</div>
				<div className="flex gap-2">
					{pokemon.types.map((type) => (
						<PokemonTypeBadge key={type.type.name} type={type} />
					))}
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col items-center">
				<div className="relative h-40 w-40">
					<Image
						src={artwork}
						alt={pokemon.name}
						fill
						sizes="160px"
						className="object-contain"
					/>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-2 sm:flex-row">
				<Button
					variant="outline"
					className="w-full sm:flex-1"
					asChild
				>
					<Link
						href={`/pokemon/${pokemon.id}`}
						className="flex w-full items-center justify-center"
					>
						Détails
					</Link>
				</Button>
				<Button
					className="w-full sm:flex-1"
					variant={alreadySelected ? 'secondary' : 'default'}
					onClick={() => addToComparison(pokemon)}
					disabled={alreadySelected}
				>
					{alreadySelected ? 'Déjà comparé' : 'Comparer'}
				</Button>
			</CardFooter>
		</Card>
		</motion.div>
	)
}
