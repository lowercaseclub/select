"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function createColumnWidths(widths: readonly number[]): string {
  const sum = widths.reduce((acc, width) => acc + width, 0);
  if (sum !== 100) {
    throw new Error(`Column widths must sum to 100%, got ${sum}%`);
  }

  return widths.map((w) => `${w}%`).join(" ") as string;
}

// Column configuration - TypeScript will ensure this adds up to 100%
const COLUMN_WIDTHS_ARRAY = [30, 10, 24, 8, 10, 13, 5] as const;
const COLUMN_WIDTHS = createColumnWidths(COLUMN_WIDTHS_ARRAY);
const NUM_COLUMNS = COLUMN_WIDTHS_ARRAY.length;

// Calculate cumulative column positions for proper cell positioning
const getColumnPosition = (colIndex: number): number => {
  const basePosition = COLUMN_WIDTHS_ARRAY.slice(0, colIndex - 1).reduce(
    (sum, width) => sum + width,
    0
  );
  return colIndex === 1 ? basePosition : basePosition - 0.1;
};

const getColumnWidth = (colStart: number, colEnd: number): number => {
  const baseWidth = COLUMN_WIDTHS_ARRAY.slice(colStart - 1, colEnd).reduce(
    (sum, width) => sum + width,
    0
  );
  return colStart === 1 ? baseWidth + 0.1 : baseWidth + 0.2;
};

interface GridCell {
  id: string;
  row: number; // grid row number
  colStart: number; // starting column (1-12)
  colEnd: number; // ending column (1-12)
  delay: number;
}

export function AnimatedGrid() {
  const [cells, setCells] = useState<GridCell[]>([]);

  useEffect(() => {
    // Generate cells that snap to grid columns (each column is ~8.33% wide)
    const animatedCells: GridCell[] = [
      // Only the 6 cells that exist in your design
      { id: "cell-1", row: 1, colStart: 3, colEnd: 4, delay: 50 },
      { id: "cell-2", row: 3, colStart: 4, colEnd: 6, delay: 100 },
      { id: "cell-3", row: 4, colStart: 3, colEnd: 4, delay: 150 },
      { id: "cell-4", row: 5, colStart: 4, colEnd: 5, delay: 200 },
      { id: "cell-5", row: 7, colStart: 2, colEnd: 4, delay: 250 },
      { id: "cell-6", row: 8, colStart: 3, colEnd: 4, delay: 300 },
    ];

    // Validate cell column references
    animatedCells.forEach((cell) => {
      if (cell.colStart < 1 || cell.colStart > NUM_COLUMNS) {
        throw new Error(
          `Cell ${cell.id}: colStart ${cell.colStart} is out of range (1-${NUM_COLUMNS})`
        );
      }
      if (cell.colEnd < 1 || cell.colEnd > NUM_COLUMNS) {
        throw new Error(
          `Cell ${cell.id}: colEnd ${cell.colEnd} is out of range (1-${NUM_COLUMNS})`
        );
      }
      if (cell.colStart > cell.colEnd) {
        throw new Error(
          `Cell ${cell.id}: colStart ${cell.colStart} must be less than or equal to colEnd ${cell.colEnd}`
        );
      }
    });

    setCells(animatedCells);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      {/* 2 left vertical lines - like spreadsheet margins */}

      {/* Vertical columns in main grid */}
      <div
        className="grid h-full"
        style={{
          gridTemplateColumns: COLUMN_WIDTHS,
        }}
      >
        {/* 
          Render column dividers for each column except the last one.
          Each div renders a right border to create column lines.
          We skip the last column because the container's border 
          already provides the final edge line.
        */}
        {Array.from({
          length: NUM_COLUMNS - 1, // Skip last column - container border handles final edge
        }).map((_, i) => (
          <div key={i} className="border-r border-column-lines" />
        ))}
      </div>

      {/* Horizontal rows - 48px tall */}
      {/* <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border-b border-column-lines h-12" />
          ))}
        </div> */}

      {/* Cells in main grid area */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {cells.map((cell) => (
            <motion.div
              key={cell.id}
              className="absolute bg-background"
              style={{
                top: `${cell.row * 48 - (cell.row - 1)}px`,
                left: `${getColumnPosition(cell.colStart)}%`,
                width: `${getColumnWidth(cell.colStart, cell.colEnd)}%`,
                height: "48px",
                border: "1px solid var(--muted-foreground)",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
