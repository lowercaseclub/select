'use client'

import { Fragment, useState } from 'react'
import { Container } from './container'
import { ComingSoonFrame } from './coming-soon'
import { STAGES, AGENDA, type AgendaRow } from '@/lib/site-data'
import { cn } from '@/lib/cn'

export function AgendaSection() {
  const [stageId, setStageId] = useState(STAGES[0]?.id ?? '')
  const rows = AGENDA[stageId] ?? []

  return (
    <section className="pb-14 pt-16 md:py-16">
      <Container>
        {/* Tab header */}
        <div className="flex items-start gap-[21px] text-[16px] font-medium leading-5">
          <span className="text-black/90">Agenda</span>
          <span className="text-black/90">→</span>
          <div className="flex items-start gap-2">
            {STAGES.map((stage) => (
              <StageTab
                key={stage.id}
                label={stage.name}
                active={stageId === stage.id}
                onClick={() => setStageId(stage.id)}
              />
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <ComingSoonFrame className="mt-12 h-40 w-full md:h-48" label="AGENDA COMING SOON" />
        ) : (
          <>
            {/* Column labels */}
            <div className="mt-8 grid grid-cols-[130px_1fr] text-[14px] font-medium leading-[17px] text-black/30 md:mt-[73px] md:grid-cols-[210px_467fr_324fr]">
              <span>TIME (EST)</span>
              <span className="md:contents">
                <span>TITLE</span>
                <span className="hidden md:block">SPEAKERS</span>
              </span>
            </div>

            <div className="mt-3 h-px w-full bg-brand/10 md:mt-4" />

            {/* Rows */}
            <div>
              {rows.map((row, i) => (
                <Fragment key={`${stageId}-${i}`}>
                  {i > 0 && !row.isBreak && !rows[i - 1].isBreak && (
                    <div className="h-px bg-brand/10 md:hidden" />
                  )}
                  <AgendaRowItem row={row} />
                </Fragment>
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
        'cursor-pointer pb-2 transition-colors',
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
        '-mx-6 grid grid-cols-[130px_1fr] items-baseline px-6 py-4 md:grid-cols-[210px_467fr_324fr] md:py-[14px]',
        row.isBreak && 'bg-cream-200'
      )}
    >
      <span className="whitespace-nowrap font-mono text-[14px] font-medium leading-[17px] text-black/30">
        {row.time ?? 'TBC'}
      </span>
      <span className="md:contents">
        {row.title ? (
          <span
            className={cn(
              'text-[14px] font-medium leading-[17px]',
              row.isBreak ? 'text-black/30' : 'text-black'
            )}
          >
            {row.title}
          </span>
        ) : (
          <span className="font-mono text-[14px] font-medium leading-[17px] tracking-[0.02em] text-black/30">
            COMING SOON
          </span>
        )}
        {row.speakers ? (
          <span className="mt-1.5 block text-[14px] font-medium leading-[17px] text-black md:mt-0">
            {row.speakers}
          </span>
        ) : row.tbc && row.title ? (
          <span className="mt-1.5 block font-mono text-[14px] font-medium leading-[17px] tracking-[0.02em] text-black/30 md:mt-0">
            TBC
          </span>
        ) : null}
      </span>
    </div>
  )
}
