'use client'

import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts'

import { POKEMON_STAT_LABELS, POKEMON_STAT_ORDER } from '@/lib/constants/pokemon-stats'
import type { PokemonStat } from '@/lib/types/pokemon'

interface PokemonStatsDataset {
	readonly id: string
	readonly label: string
	readonly stats: readonly PokemonStat[]
	readonly color?: string
}

export interface PokemonStatsChartProps {
	readonly datasets: readonly PokemonStatsDataset[]
	readonly maxValue?: number
}

const defaultPalette = ['#2563eb', '#f97316'] as const

export function PokemonStatsChart({
	datasets,
	maxValue = 200,
}: PokemonStatsChartProps) {
	const chartData = POKEMON_STAT_ORDER.map((stat) => {
		const baseEntry: Record<string, number | string> = {
			stat,
			label: POKEMON_STAT_LABELS[stat],
		}

		datasets.forEach((dataset) => {
			const statValue = dataset.stats.find((entry) => entry.name === stat)
			baseEntry[dataset.id] = statValue?.baseStat ?? 0
		})

		return baseEntry
	})

	return (
		<div className="h-72 w-full">
			<ResponsiveContainer>
				<RadarChart data={chartData} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
					<PolarGrid strokeDasharray="6 6" />
					<PolarAngleAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 12 }} />
					<PolarRadiusAxis
						angle={90}
						domain={[0, maxValue]}
						axisLine={false}
						tick={{ fill: 'currentColor', fontSize: 10 }}
					/>
					<Tooltip
						formatter={(value: number, key: string) => [value, key]}
						labelFormatter={(label) => `Statistique: ${label}`}
					/>
					{datasets.map((dataset, index) => (
						<Radar
							key={dataset.id}
							dataKey={dataset.id}
							name={dataset.label}
							stroke={dataset.color ?? defaultPalette[index % defaultPalette.length]}
							fill={dataset.color ?? defaultPalette[index % defaultPalette.length]}
							fillOpacity={datasets.length > 1 ? 0.3 : 0.4}
						/>
					))}
				</RadarChart>
			</ResponsiveContainer>
		</div>
	)
}
