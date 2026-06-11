'use client'

import { useState } from 'react'
import { Container } from './container'
import { ComingSoonFrame } from './coming-soon'
import { STAGES, AGENDA, type AgendaRow } from '@/lib/site-data'
import { cn } from '@/lib/cn'

export function AgendaSection() {
  const [stageId, setStageId] = useState(STAGES[0]?.id ?? '')
  const rows = AGENDA[stageId] ?? []

  return (
    <section className="py-14 md:py-16">
      <Container>
        {/* Tab header */}
        <div className="flex items-center gap-3 text-[16px] font-medium leading-5">
          <span className="text-black/90">Agenda</span>
          <span className="text-black/90">→</span>
          {STAGES.map((stage) => (
            <StageTab
              key={stage.id}
              label={stage.name}
              active={stageId === stage.id}
              onClick={() => setStageId(stage.id)}
            />
          ))}
        </div>

        {rows.length === 0 ? (
          <ComingSoonFrame className="mt-12 h-40 w-full md:h-48" label="AGENDA COMING SOON" />
        ) : (
          <>
            {/* Column labels */}
            <div className="mt-12 grid grid-cols-[116px_1fr] gap-x-4 text-[14px] font-medium leading-[18px] text-black/30 md:grid-cols-[210px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-6">
              <span>TIME (EST)</span>
              <span className="md:contents">
                <span>TITLE</span>
                <span className="hidden md:block">SPEAKERS</span>
              </span>
            </div>

            <div className="mt-4 h-px w-full bg-black/10" />

            {/* Rows */}
            <div>
              {rows.map((row, i) => (
                <AgendaRowItem key={`${stageId}-${i}`} row={row} />
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}

function StageTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer pb-1 transition-colors',
        active ? 'border-b border-black text-black/90' : 'text-black/30 hover:text-black/60'
      )}
    >
      {label}
    </button>
  )
}

function AgendaRowItem({ row }: { row: AgendaRow }) {
  return (
    <div
      className={cn(
        '-mx-6 grid grid-cols-[116px_1fr] items-baseline gap-x-4 px-6 py-[14px] md:grid-cols-[210px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-6',
        row.isBreak && 'bg-cream-200'
      )}
    >
      <span className="whitespace-nowrap font-mono text-[13px] font-medium leading-[18px] text-black/30 md:text-[14px]">
        {row.time ?? 'TBC'}
      </span>
      <span className="md:contents">
        {row.title ? (
          <span
            className={cn(
              'text-[14px] font-medium leading-[18px]',
              row.isBreak ? 'text-black/30' : 'text-black'
            )}
          >
            {row.title}
          </span>
        ) : (
          <span className="font-mono text-[13px] font-medium leading-[18px] tracking-[0.02em] text-black/30 md:text-[14px]">
            COMING SOON
          </span>
        )}
        {row.speakers ? (
          <span className="mt-0.5 block text-[14px] font-medium leading-[18px] text-black md:mt-0">
            {row.speakers}
          </span>
        ) : row.tbc && row.title ? (
          <span className="mt-0.5 block font-mono text-[13px] font-medium leading-[18px] tracking-[0.02em] text-black/30 md:mt-0 md:text-[14px]">
            TBC
          </span>
        ) : null}
      </span>
    </div>
  )
}
