"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function createColumnWidths(widths: readonly number[]): string {
  const sum = widths.reduce((acc, width) => acc + width, 0);
  // Allow small floating point precision errors
  if (Math.abs(sum - 100) > 0.001) {
    throw new Error(`Column widths must sum to 100%, got ${sum}%`);
  }

  return widths.map((w) => `${w}%`).join(" ") as string;
}

// Grid configuration
const ROW_HEIGHT = 38; // px
const COLUMN_WIDTHS_ARRAY = [30, 15, 8, 22, 5, 5, 10, 5] as const;
const COLUMN_WIDTHS = createColumnWidths(COLUMN_WIDTHS_ARRAY);
const NUM_COLUMNS = COLUMN_WIDTHS_ARRAY.length;

// Animation configuration
const ENABLE_COLOR_ANIMATIONS = false; // Toggle to easily disable color swipes

// Calculate cumulative column positions for proper cell positioning
const getColumnPosition = (
  colIndex: number,
  columnWidths: readonly number[] = COLUMN_WIDTHS_ARRAY
): number => {
  if (!columnWidths || columnWidths.length === 0) return 0;
  const basePosition = columnWidths
    .slice(0, colIndex - 1)
    .reduce((sum, width) => sum + width, 0);
  return colIndex === 1 ? basePosition : basePosition - 0.1;
};

const getColumnWidth = (
  colStart: number,
  colEnd: number,
  columnWidths: readonly number[] = COLUMN_WIDTHS_ARRAY
): number => {
  if (!columnWidths || columnWidths.length === 0) return 10;
  const baseWidth = columnWidths
    .slice(colStart - 1, colEnd)
    .reduce((sum, width) => sum + width, 0);
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
  const [movingCells, setMovingCells] = useState<GridCell[]>([]);
  const [currentColumnWidths, setCurrentColumnWidths] =
    useState(COLUMN_WIDTHS_ARRAY);
  const [isColumnChanging, setIsColumnChanging] = useState(false);
  const [movingCellId, setMovingCellId] = useState<string | null>(null);

  // Helper function to check if two cells overlap
  const cellsOverlap = (cell1: GridCell, cell2: GridCell) => {
    const rowOverlap = cell1.row === cell2.row;
    const colOverlap =
      cell1.colStart <= cell2.colEnd && cell1.colEnd >= cell2.colStart;
    return rowOverlap && colOverlap;
  };

  // Helper function to check if a cell position would cause overlap
  const wouldOverlap = (testCell: GridCell, otherCells: GridCell[]) => {
    return otherCells.some(
      (other) => other.id !== testCell.id && cellsOverlap(testCell, other)
    );
  };

  useEffect(() => {
    // Generate initial cells
    const animatedCells: GridCell[] = [
      { id: "cell-1", row: 4, colStart: 4, colEnd: 4, delay: 80 },
      { id: "cell-2", row: 5, colStart: 4, colEnd: 6, delay: 220 },
      { id: "cell-3", row: 6, colStart: 4, colEnd: 4, delay: 150 },
      { id: "cell-4", row: 7, colStart: 4, colEnd: 5, delay: 350 },
      { id: "cell-5", row: 8, colStart: 4, colEnd: 4, delay: 290 },
      { id: "cell-6", row: 9, colStart: 4, colEnd: 4, delay: 450 },
      { id: "cell-7", row: 10, colStart: 4, colEnd: 4, delay: 600 },
      { id: "cell-8", row: 11, colStart: 4, colEnd: 4, delay: 180 },
      { id: "cell-9", row: 12, colStart: 4, colEnd: 4, delay: 400 },
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
    setMovingCells(animatedCells);

    // Multiple movement timers for simultaneous action, but with proper collision detection
    const movementIntervals: NodeJS.Timeout[] = [];

    animatedCells.forEach((cell, index) => {
      const moveDelay = 100 + index * 50; // Stagger initial start times

      setTimeout(() => {
        const scheduleNextMove = () => {
          if (isColumnChanging) return; // Don't schedule if columns are changing

          const intervalId = setTimeout(() => {
            setMovingCells((prevCells) => {
              // Safety check for undefined state
              if (!prevCells || !Array.isArray(prevCells)) {
                return prevCells;
              }

              // Find this specific cell in current state
              const cellIndex = prevCells.findIndex((c) => c.id === cell.id);
              if (cellIndex === -1) return prevCells; // Cell doesn't exist anymore

              const currentCell = prevCells[cellIndex];
              const moveType = Math.random();

              if (moveType < 0.05) {
                // 5% chance: Move vertically (up or down 1 row only)
                const direction = Math.random() < 0.5 ? -1 : 1;
                const newRow = Math.max(
                  1,
                  Math.min(20, currentCell.row + direction)
                );

                if (newRow !== currentCell.row) {
                  const testCell = {
                    ...currentCell,
                    row: newRow,
                    colStart: currentCell.colStart, // Explicitly preserve
                    colEnd: currentCell.colEnd, // Explicitly preserve
                  };
                  const otherCells = prevCells.filter(
                    (_, i) => i !== cellIndex
                  );

                  if (!wouldOverlap(testCell, otherCells)) {
                    console.log(
                      `Vertical move: ${currentCell.id} from row ${currentCell.row} to ${newRow}, cols unchanged`
                    );
                    setMovingCellId(currentCell.id);
                    setTimeout(() => setMovingCellId(null), 800); // Clear highlight after animation
                    return prevCells.map((c, i) =>
                      i === cellIndex ? testCell : c
                    );
                  }
                }
              } else {
                // 95% chance: Move horizontally (change columns only)
                const biasedRandom = Math.random() * 0.8 + 0.2;
                const newColStart = Math.floor(biasedRandom * NUM_COLUMNS) + 1;
                const maxSpan = Math.min(NUM_COLUMNS - newColStart + 1, 4);
                const newSpan = Math.floor(Math.random() * maxSpan) + 1;
                const newColEnd = newColStart + newSpan - 1;

                const testCell = {
                  ...currentCell,
                  colStart: newColStart,
                  colEnd: newColEnd,
                  row: currentCell.row, // Explicitly preserve
                };
                const otherCells = prevCells.filter((_, i) => i !== cellIndex);

                if (!wouldOverlap(testCell, otherCells)) {
                  console.log(
                    `Horizontal move: ${currentCell.id} from cols ${currentCell.colStart}-${currentCell.colEnd} to ${newColStart}-${newColEnd}, row unchanged`
                  );
                  setMovingCellId(currentCell.id);
                  setTimeout(() => setMovingCellId(null), 400); // Clear highlight after animation
                  return prevCells.map((c, i) =>
                    i === cellIndex ? testCell : c
                  );
                }
              }

              // If no valid move found, return unchanged
              return prevCells;
            });

            // Schedule the next move
            scheduleNextMove();
          }, 1200 + Math.random() * 1800); // Each cell moves every 1.2-3.0 seconds (slower)

          movementIntervals.push(intervalId);
        };

        // Start the movement cycle
        scheduleNextMove();
      }, moveDelay);
    });

    // Dynamic cell addition/removal (currently disabled)
    let cellCounter = animatedCells.length;
    const addRemoveInterval = setInterval(() => {
      // Both cell addition and removal are disabled
      // Keeping the interval structure for potential future use
    }, 4000 + Math.random() * 6000); // Every 4-10 seconds

    // Column width morphing - focus on one column at a time
    const columnMorphInterval = setInterval(() => {
      // First, stop all traffic for 4 seconds
      setIsColumnChanging(true);

      // Wait 4 seconds, then make the column change
      setTimeout(() => {
        setCurrentColumnWidths((prevWidths) => {
          const newWidths = [...prevWidths];

          // Choose one column to modify with bias towards smaller/larger columns
          let columnIndex;
          let action: "expand" | "contract";

          // Find small columns (< 12%), large columns (> 25%), and categorize by position
          const smallColumns = prevWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.width < 12);
          const largeColumns = prevWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.width > 25);

          // Left columns (0-2), right columns (5-7)
          const leftColumns = prevWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.index <= 2);
          const farRightColumns = prevWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.index >= 5 && col.width < 8); // Far right and small

          const biasChance = Math.random();

          if (biasChance < 0.25 && leftColumns.length > 0) {
            // 25% chance: Expand a left column (bias towards left)
            const randomLeft =
              leftColumns[Math.floor(Math.random() * leftColumns.length)];
            columnIndex = randomLeft.index;
            action = "expand";
          } else if (biasChance < 0.4 && farRightColumns.length > 0) {
            // 15% chance: Expand a small far-right column (prevent eternal deflation)
            const randomFarRight =
              farRightColumns[
                Math.floor(Math.random() * farRightColumns.length)
              ];
            columnIndex = randomFarRight.index;
            action = "expand";
          } else if (biasChance < 0.65 && smallColumns.length > 0) {
            // 25% chance: Expand any small column
            const randomSmall =
              smallColumns[Math.floor(Math.random() * smallColumns.length)];
            columnIndex = randomSmall.index;
            action = "expand";
          } else if (biasChance < 0.85 && largeColumns.length > 0) {
            // 20% chance: Contract a large column
            const randomLarge =
              largeColumns[Math.floor(Math.random() * largeColumns.length)];
            columnIndex = randomLarge.index;
            action = "contract";
          } else {
            // 15% chance: Random column, random action (fallback)
            columnIndex = Math.floor(Math.random() * newWidths.length);
            action = Math.random() < 0.5 ? "expand" : "contract";
          }

          const currentWidth = newWidths[columnIndex];

          let targetWidth;

          if (action === "expand") {
            // Expand: grow the column significantly
            const growthAmount = Math.random() * 25 + 15; // 15-40% growth
            targetWidth = Math.min(50, currentWidth + growthAmount); // Cap at 50%
          } else {
            // Contract: shrink the column
            const shrinkAmount = Math.random() * 15 + 10; // 10-25% shrink
            targetWidth = Math.max(5, currentWidth - shrinkAmount); // Min 5%
          }

          // Set the target column's new width
          newWidths[columnIndex] = targetWidth;

          // Calculate remaining space to distribute
          const usedWidth = targetWidth;
          const remainingWidth = 100 - usedWidth;

          // Get the original proportions of the other columns
          const otherColumns = prevWidths.filter((_, i) => i !== columnIndex);
          const otherColumnsTotal = otherColumns.reduce(
            (sum, width) => sum + width,
            0
          );

          // Distribute remaining space proportionally among other columns
          let distributedIndex = 0;
          for (let i = 0; i < newWidths.length; i++) {
            if (i !== columnIndex) {
              const originalProportion = prevWidths[i] / otherColumnsTotal;
              newWidths[i] = remainingWidth * originalProportion;
            }
          }

          // Ensure we sum exactly to 100% (handle floating point precision)
          const total = newWidths.reduce((sum, width) => sum + width, 0);
          const adjustment = 100 - total;

          // Apply adjustment to the largest non-target column
          let largestIndex = 0;
          for (let i = 0; i < newWidths.length; i++) {
            if (i !== columnIndex && newWidths[i] > newWidths[largestIndex]) {
              largestIndex = i;
            }
          }
          newWidths[largestIndex] += adjustment;

          console.log(
            `Column ${columnIndex} ${action}: ${currentWidth.toFixed(
              1
            )}% → ${targetWidth.toFixed(1)}%`
          );

          return newWidths as typeof COLUMN_WIDTHS_ARRAY;
        });

        // Resume cell movement after column change
        setTimeout(() => {
          setIsColumnChanging(false);
        }, 600); // After column animation (0.4s) + slight delay
      }, 4000); // Wait 4 seconds before making the change
    }, 2000 + Math.random() * 3000); // Every 2-5 seconds

    return () => {
      movementIntervals.forEach(clearTimeout);
      clearInterval(addRemoveInterval);
      clearInterval(columnMorphInterval);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      {/* 2 left vertical lines - like spreadsheet margins */}

      {/* Vertical columns in main grid */}
      <motion.div
        className="grid h-full"
        animate={{
          gridTemplateColumns: createColumnWidths(
            currentColumnWidths || COLUMN_WIDTHS_ARRAY
          ),
        }}
        transition={{
          duration: 0.4,
          ease: [0.68, -0.55, 0.265, 1.55], // Elastic bounce
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
      </motion.div>

      {/* Horizontal rows - 48px tall */}
      {/* <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border-b border-column-lines h-12" />
          ))}
        </div> */}

      {/* Cells in main grid area */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {(movingCells || []).map((cell) => (
            <motion.div
              key={cell.id}
              className="absolute overflow-hidden"
              style={{
                position: "absolute",
                height: `${ROW_HEIGHT}px`,
                border: "1px solid var(--muted-foreground)",
                zIndex: movingCellId === cell.id ? 10 : 1,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                top: `${(cell.row - 1) * ROW_HEIGHT - (cell.row - 1)}px`, // Animate vertical position (subtract 1px per row for border overlap)
                left: `${getColumnPosition(
                  cell.colStart,
                  currentColumnWidths || COLUMN_WIDTHS_ARRAY
                )}%`,
                width: `${getColumnWidth(
                  cell.colStart,
                  cell.colEnd,
                  currentColumnWidths || COLUMN_WIDTHS_ARRAY
                )}%`,
              }}
              transition={{
                opacity: {
                  duration: 0.1,
                  delay: cell.delay / 1000,
                },
                top: {
                  duration: 0.15 + (cell.id.charCodeAt(3) % 4) * 0.05, // Faster: 0.15-0.3s
                  ease: (() => {
                    const easingType = cell.id.charCodeAt(4) % 4;
                    switch (easingType) {
                      case 0:
                        return [0.68, -0.55, 0.265, 1.55]; // Elastic bounce
                      case 1:
                        return [0.25, 0.46, 0.45, 0.94]; // Smooth
                      case 2:
                        return [0.17, 0.67, 0.83, 0.67]; // Ease in-out
                      default:
                        return [0.87, 0, 0.13, 1]; // Ease out-in
                    }
                  })(),
                },
                left: {
                  duration: 0.15 + (cell.id.charCodeAt(3) % 4) * 0.05, // Faster: 0.15-0.3s
                  ease: (() => {
                    const easingType = cell.id.charCodeAt(4) % 4;
                    switch (easingType) {
                      case 0:
                        return [0.68, -0.55, 0.265, 1.55]; // Elastic bounce
                      case 1:
                        return [0.25, 0.46, 0.45, 0.94]; // Smooth
                      case 2:
                        return [0.17, 0.67, 0.83, 0.67]; // Ease in-out
                      default:
                        return [0.87, 0, 0.13, 1]; // Ease out-in
                    }
                  })(),
                },
                width: {
                  duration: 0.15 + (cell.id.charCodeAt(3) % 4) * 0.05, // Faster: 0.15-0.3s
                  ease: (() => {
                    const easingType = cell.id.charCodeAt(4) % 4;
                    switch (easingType) {
                      case 0:
                        return [0.68, -0.55, 0.265, 1.55]; // Elastic bounce
                      case 1:
                        return [0.25, 0.46, 0.45, 0.94]; // Smooth
                      case 2:
                        return [0.17, 0.67, 0.83, 0.67]; // Ease in-out
                      default:
                        return [0.87, 0, 0.13, 1]; // Ease out-in
                    }
                  })(),
                },
              }}
            >
              {/* Inner content that swipes in */}
              <motion.div
                className="w-full h-full"
                initial={{
                  clipPath: "inset(0 100% 0 0)", // Start fully clipped from right
                  backgroundColor: "var(--accent-2-foreground)", // Start with accent color
                }}
                animate={{
                  clipPath: "inset(0 0% 0 0)", // Reveal to full width
                  backgroundColor: "var(--background)", // Fade to background color
                }}
                transition={{
                  clipPath: {
                    duration: 0.15,
                    delay: cell.delay / 1000 + 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94], // Tight easing curve (easeOutQuart)
                  },
                  backgroundColor: {
                    duration: 0.4,
                    delay: cell.delay / 1000 + 0.05,
                    ease: [0, 0, 1, 1], // Stepped effect like old school clay animation
                  },
                }}
              >
                {/* Random color spark animations */}
                {ENABLE_COLOR_ANIMATIONS && (
                  <motion.div
                    className="w-full h-full"
                    style={{
                      background: (() => {
                        const gradients = [
                          "linear-gradient(135deg, var(--accent-1-foreground), var(--accent-2-foreground))",
                          "linear-gradient(135deg, var(--accent-2-foreground), var(--accent-3-foreground))",
                          "linear-gradient(135deg, var(--accent-3-foreground), var(--accent-4-foreground))",
                          "linear-gradient(135deg, var(--accent-4-foreground), var(--accent-1-foreground))",
                          "linear-gradient(90deg, var(--accent-1-foreground), var(--accent-3-foreground))",
                          "linear-gradient(45deg, var(--accent-2-foreground), var(--accent-4-foreground))",
                        ];
                        return gradients[
                          cell.id.charCodeAt(5) % gradients.length
                        ];
                      })(),
                    }}
                    animate={{
                      clipPath: isColumnChanging
                        ? ["inset(0 100% 0 0)"] // Hide during column changes
                        : cell.id.charCodeAt(6) % 2 === 0
                        ? [
                            "inset(0 100% 0 0)",
                            "inset(0 0% 0 0)",
                            "inset(0 0% 0 0)", // Stay visible for dwell time
                            "inset(0 0% 0 100%)",
                          ] // Left to right swipe in, dwell, then out
                        : [
                            "inset(0 0% 0 100%)",
                            "inset(0 0% 0 0%)",
                            "inset(0 0% 0 0%)", // Stay visible for dwell time
                            "inset(0 100% 0 0)",
                          ], // Right to left swipe in, dwell, then out
                    }}
                    transition={{
                      duration: 0.6, // Total duration including dwell
                      delay: 0.5 + cell.delay / 1000,
                      repeat: isColumnChanging ? 0 : Infinity,
                      repeatDelay: 2 + (cell.id.charCodeAt(5) % 3), // 2-5s gaps (more frequent)
                      ease: [0.25, 0.46, 0.45, 0.94],
                      times: [0, 0.3, 0.7, 1], // 30% swipe in, 40% dwell, 30% swipe out
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
