import { Badge } from '@/components/ui/badge'
import type { PokemonTypeSlot } from '@/lib/types/pokemon'
import { cn } from '@/lib/utils'

const typeColorMap: Record<string, string> = {
	bug: 'bg-lime-100 text-lime-800',
	dark: 'bg-stone-800 text-stone-100',
	dragon: 'bg-indigo-100 text-indigo-800',
	electric: 'bg-yellow-100 text-yellow-800',
	fairy: 'bg-pink-100 text-pink-800',
	fighting: 'bg-orange-100 text-orange-800',
	fire: 'bg-red-100 text-red-800',
	flying: 'bg-sky-100 text-sky-800',
	ghost: 'bg-violet-100 text-violet-800',
	grass: 'bg-emerald-100 text-emerald-800',
	ground: 'bg-amber-100 text-amber-800',
	ice: 'bg-cyan-100 text-cyan-800',
	normal: 'bg-zinc-100 text-zinc-800',
	poison: 'bg-purple-100 text-purple-800',
	psychic: 'bg-rose-100 text-rose-800',
	rock: 'bg-yellow-200 text-yellow-900',
	steel: 'bg-slate-100 text-slate-800',
	water: 'bg-blue-100 text-blue-800',
}

export interface PokemonTypeBadgeProps {
	readonly type: PokemonTypeSlot
	readonly className?: string
}

export function PokemonTypeBadge({ type, className }: PokemonTypeBadgeProps) {
	const colorClass = typeColorMap[type.type.name] ?? 'bg-zinc-100 text-zinc-800'

	return (
		<Badge className={cn('capitalize', colorClass, className)}>
			{type.type.name}
		</Badge>
	)
}
