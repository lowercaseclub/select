"use client";

import { useEffect, useState } from "react";

interface GridCell {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  delay: number;
}

export function AnimatedGrid() {
  const [cells, setCells] = useState<GridCell[]>([]);

    useEffect(() => {
    // Generate cells that snap to grid columns (each column is ~8.33% wide)
    const animatedCells: GridCell[] = [
      // Top section cells - aligned to columns
      { id: "cell-1", top: 2, left: 0, width: 25, height: 2, delay: 300 },   // columns 1-3
      { id: "cell-2", top: 2, left: 33.33, width: 16.67, height: 2, delay: 600 }, // columns 5-6
      { id: "cell-3", top: 5, left: 0, width: 50, height: 2, delay: 900 },   // columns 1-6
      
      // Middle section
      { id: "cell-4", top: 8, left: 41.67, width: 25, height: 3, delay: 1200 }, // columns 6-8
      { id: "cell-5", top: 8, left: 75, width: 25, height: 3, delay: 1500 },   // columns 10-12
      { id: "cell-6", top: 12, left: 41.67, width: 41.67, height: 2, delay: 1800 }, // columns 6-10
      
      // Lower section
      { id: "cell-7", top: 16, left: 16.67, width: 25, height: 2, delay: 2100 }, // columns 3-5
      { id: "cell-8", top: 16, left: 50, width: 25, height: 2, delay: 2400 },   // columns 7-9
      { id: "cell-9", top: 16, left: 83.33, width: 16.67, height: 2, delay: 2700 }, // columns 11-12
    ];
    
    setCells(animatedCells);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      {/* 2 left vertical lines - like spreadsheet margins */}
      <div className="absolute top-0 bottom-0 left-16 w-px bg-neutral-500" />
      <div className="absolute top-0 bottom-0 left-32 w-px bg-neutral-500" />

      {/* Main grid area - starts after the 2 left lines */}
      <div className="absolute top-0 bottom-0 left-32 right-0">
        {/* Vertical columns in main grid */}
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-neutral-500" />
          ))}
        </div>

        {/* Horizontal rows */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border-b border-gray-800 h-16" />
          ))}
        </div>

        {/* Animated cells in main grid area */}
        <div className="absolute inset-0">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className="absolute border border-gray-600 bg-gray-900/30 opacity-0 animate-pulse"
              style={{
                top: `${cell.top}%`,
                left: `${cell.left}%`,
                width: `${cell.width}%`,
                height: `${cell.height}%`,
                animationDelay: `${cell.delay}ms`,
                animationDuration: "1500ms",
                animationFillMode: "forwards",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
