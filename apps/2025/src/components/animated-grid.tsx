"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../hooks/use-media-query";

function createColumnWidths(widths: readonly number[]): string {
  const sum = widths.reduce((acc, width) => acc + width, 0);
  // Allow small floating point precision errors
  if (Math.abs(sum - 100) > 0.001) {
    throw new Error(`Column widths must sum to 100%, got ${sum}%`);
  }

  return widths.map((w) => `${w}%`).join(" ") as string;
}

// Grid configuration - responsive
const DESKTOP_rowHeight = 38; // px
const MOBILE_rowHeight = 28; // px - smaller for mobile
// const _XL_rowHeight = 42; // px - slightly larger for extra large screens (unused)
const DESKTOP_columnWidthsArray: number[] = [30, 15, 8, 22, 5, 5, 10, 5];
const MOBILE_columnWidthsArray: number[] = [25, 25, 25, 25]; // Equal columns spanning full width
const DESKTOP_numColumns = DESKTOP_columnWidthsArray.length;
const MOBILE_numColumns = MOBILE_columnWidthsArray.length;

// Animation configuration
const ENABLE_COLOR_ANIMATIONS = true; // Toggle to easily disable color swipes

// Calculate cumulative column positions for proper cell positioning
const getColumnPosition = (
  colIndex: number,
  columnWidths: number[]
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
  columnWidths: number[]
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isXL = useMediaQuery("(min-width: 1280px)");
  const [, setIsInitialRender] = useState(true);

  const [movingCells, setMovingCells] = useState<GridCell[]>([]);
  const selectionsRef = useRef<
    Array<{
      id: string;
      startRow: number;
      startCol: number;
      endRow: number;
      endCol: number;
      isFlashing: boolean;
    }>
  >([]);
  const [currentColumnWidths, setCurrentColumnWidths] = useState(
    isMobile ? MOBILE_columnWidthsArray : DESKTOP_columnWidthsArray
  );
  const [isColumnChanging, setIsColumnChanging] = useState(false);
  const [movingCellId, setMovingCellId] = useState<string | null>(null);
  const [selections, setSelections] = useState<
    Array<{
      id: string;
      startRow: number;
      startCol: number;
      endRow: number;
      endCol: number;
      isFlashing: boolean;
    }>
  >([]);

  // Keep ref in sync with selections state
  useEffect(() => {
    selectionsRef.current = selections;
  }, [selections]);

  // Get responsive configuration values
  const rowHeight = isMobile ? MOBILE_rowHeight : DESKTOP_rowHeight;
  const columnWidthsArray = isMobile
    ? MOBILE_columnWidthsArray
    : DESKTOP_columnWidthsArray;
  const numColumns = isMobile ? MOBILE_numColumns : DESKTOP_numColumns;

  // Helper function to check if two cells overlap
  const cellsOverlap = (cell1: GridCell, cell2: GridCell) => {
    const rowOverlap = cell1.row === cell2.row;
    const colOverlap =
      cell1.colStart <= cell2.colEnd && cell1.colEnd >= cell2.colStart;
    return rowOverlap && colOverlap;
  };

  // Helper function to check if a cell position would cause overlap
  const wouldOverlap = useCallback(
    (testCell: GridCell, otherCells: GridCell[]) => {
      return otherCells.some(
        (other) => other.id !== testCell.id && cellsOverlap(testCell, other)
      );
    },
    []
  );

  // Helper function to check if a cell is within any selection
  const isCellInSelection = (cell: GridCell) => {
    return selections.some((selection) => {
      const cellInRowRange =
        cell.row >= selection.startRow && cell.row <= selection.endRow;
      const cellInColRange =
        cell.colStart <= selection.endCol && cell.colEnd >= selection.startCol;
      return cellInRowRange && cellInColRange;
    });
  };

  // Helper function to check if a cell is within a flashing selection
  const isCellInFlashingSelection = (cell: GridCell) => {
    return selections.some((selection) => {
      if (!selection.isFlashing) return false;
      const cellInRowRange =
        cell.row >= selection.startRow && cell.row <= selection.endRow;
      const cellInColRange =
        cell.colStart <= selection.endCol && cell.colEnd >= selection.startCol;
      return cellInRowRange && cellInColRange;
    });
  };

  useEffect(() => {
    // Generate initial cells - different patterns for mobile vs desktop vs XL
    const animatedCells: GridCell[] = isMobile
      ? [
          // Mobile: cells scattered across all columns
          { id: "cell-1", row: 16, colStart: 1, colEnd: 2, delay: 80 },
          { id: "cell-2", row: 22, colStart: 3, colEnd: 4, delay: 220 },
          { id: "cell-3", row: 18, colStart: 2, colEnd: 2, delay: 150 },
          { id: "cell-4", row: 25, colStart: 4, colEnd: 4, delay: 350 },
          { id: "cell-5", row: 20, colStart: 1, colEnd: 1, delay: 290 },
          { id: "cell-6", row: 28, colStart: 2, colEnd: 3, delay: 400 },
          { id: "cell-7", row: 17, colStart: 4, colEnd: 4, delay: 180 },
          { id: "cell-8", row: 24, colStart: 3, colEnd: 3, delay: 600 },
          { id: "cell-9", row: 21, colStart: 1, colEnd: 2, delay: 450 },
        ]
      : isXL
      ? [
          // XL desktop: cells scattered across more columns
          { id: "cell-1", row: 9, colStart: 2, colEnd: 3, delay: 80 },
          { id: "cell-2", row: 12, colStart: 5, colEnd: 6, delay: 220 },
          { id: "cell-3", row: 8, colStart: 7, colEnd: 7, delay: 150 },
          { id: "cell-4", row: 14, colStart: 3, colEnd: 4, delay: 350 },
          { id: "cell-5", row: 10, colStart: 6, colEnd: 8, delay: 290 },
          { id: "cell-6", row: 16, colStart: 1, colEnd: 2, delay: 450 },
          { id: "cell-7", row: 11, colStart: 4, colEnd: 5, delay: 600 },
          { id: "cell-8", row: 13, colStart: 7, colEnd: 8, delay: 180 },
          { id: "cell-9", row: 15, colStart: 2, colEnd: 3, delay: 400 },
        ]
      : [
          // Desktop: cells scattered across all columns
          { id: "cell-1", row: 5, colStart: 2, colEnd: 3, delay: 80 },
          { id: "cell-2", row: 8, colStart: 5, colEnd: 6, delay: 220 },
          { id: "cell-3", row: 4, colStart: 7, colEnd: 8, delay: 150 },
          { id: "cell-4", row: 10, colStart: 1, colEnd: 2, delay: 350 },
          { id: "cell-5", row: 6, colStart: 3, colEnd: 4, delay: 290 },
          { id: "cell-6", row: 12, colStart: 6, colEnd: 7, delay: 450 },
          { id: "cell-7", row: 7, colStart: 8, colEnd: 8, delay: 600 },
          { id: "cell-8", row: 9, colStart: 2, colEnd: 2, delay: 180 },
          { id: "cell-9", row: 11, colStart: 4, colEnd: 5, delay: 400 },
        ];

    // Validate cell column references
    animatedCells.forEach((cell) => {
      if (cell.colStart < 1 || cell.colStart > numColumns) {
        throw new Error(
          `Cell ${cell.id}: colStart ${cell.colStart} is out of range (1-${numColumns})`
        );
      }
      if (cell.colEnd < 1 || cell.colEnd > numColumns) {
        throw new Error(
          `Cell ${cell.id}: colEnd ${cell.colEnd} is out of range (1-${numColumns})`
        );
      }
      if (cell.colStart > cell.colEnd) {
        throw new Error(
          `Cell ${cell.id}: colStart ${cell.colStart} must be less than or equal to colEnd ${cell.colEnd}`
        );
      }
    });

    setMovingCells(animatedCells);

    // Disable initial render flag after cells have animated in
    setTimeout(() => {
      setIsInitialRender(false);
    }, 1000); // Wait for initial animations to complete

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

              // Don't move cells that are currently in a selection (check with current selections)
              const isCurrentlySelected = selectionsRef.current.some(
                (selection) => {
                  const cellInRowRange =
                    currentCell.row >= selection.startRow &&
                    currentCell.row <= selection.endRow;
                  const cellInColRange =
                    currentCell.colStart <= selection.endCol &&
                    currentCell.colEnd >= selection.startCol;
                  return cellInRowRange && cellInColRange;
                }
              );

              if (isCurrentlySelected) {
                return prevCells;
              }

              const moveType = Math.random();

              if (moveType < 0.05) {
                // 5% chance: Move vertically (up or down 1 row only)
                const direction = Math.random() < 0.5 ? -1 : 1;
                const minRow = isMobile ? 12 : 1; // Mobile: prevent going above row 12
                const maxRow = isMobile ? 30 : 20; // Mobile: allow more room below
                const newRow = Math.max(
                  minRow,
                  Math.min(maxRow, currentCell.row + direction)
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
                const newColStart = Math.floor(biasedRandom * numColumns) + 1;
                const maxSpan = Math.min(
                  numColumns - newColStart + 1,
                  isMobile ? 2 : 4
                );
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
          }, 5000 + Math.random() * 8000); // Each cell moves every 5.0-13.0 seconds (much slower)

          movementIntervals.push(intervalId);
        };

        // Start the movement cycle
        scheduleNextMove();
      }, moveDelay);
    });

    // Dynamic cell addition/removal (currently disabled)
    // const cellCounter = animatedCells.length;
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

          // Right columns (4-7), left columns (0-3)
          const rightColumns = prevWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.index >= 4);
          const leftColumns = prevWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.index <= 3);
          const farRightColumns = prevWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.index >= 5 && col.width < 8); // Far right and small

          const biasChance = Math.random();

          if (biasChance < 0.35 && rightColumns.length > 0) {
            // 35% chance: Expand a right column (bias towards right)
            const randomRight =
              rightColumns[Math.floor(Math.random() * rightColumns.length)];
            columnIndex = randomRight.index;
            action = "expand";
          } else if (biasChance < 0.5 && farRightColumns.length > 0) {
            // 15% chance: Expand a small far-right column (prevent eternal deflation)
            const randomFarRight =
              farRightColumns[
                Math.floor(Math.random() * farRightColumns.length)
              ];
            columnIndex = randomFarRight.index;
            action = "expand";
          } else if (biasChance < 0.65 && smallColumns.length > 0) {
            // 15% chance: Expand any small column
            const randomSmall =
              smallColumns[Math.floor(Math.random() * smallColumns.length)];
            columnIndex = randomSmall.index;
            action = "expand";
          } else if (biasChance < 0.8 && leftColumns.length > 0) {
            // 15% chance: Contract a left column (make more room for right)
            const randomLeft =
              leftColumns[Math.floor(Math.random() * leftColumns.length)];
            columnIndex = randomLeft.index;
            action = "contract";
          } else if (biasChance < 0.9 && largeColumns.length > 0) {
            // 10% chance: Contract any large column
            const randomLarge =
              largeColumns[Math.floor(Math.random() * largeColumns.length)];
            columnIndex = randomLarge.index;
            action = "contract";
          } else {
            // 10% chance: Random column, random action (fallback)
            // Bias the random selection towards right side too
            const biasedColumnRandom = Math.random() * 0.7 + 0.3; // 0.3-1.0
            columnIndex = Math.floor(biasedColumnRandom * newWidths.length);
            action = Math.random() < 0.6 ? "expand" : "contract"; // Slight bias towards expansion
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
            let proposedWidth = Math.max(7, currentWidth - shrinkAmount); // Minimum 7% for all columns

            // Apply column-specific minimum constraints
            if (columnIndex === 0) {
              proposedWidth = Math.max(25, proposedWidth); // First column min 25%
            } else if (columnIndex === 1) {
              proposedWidth = Math.max(10, proposedWidth); // Second column min 10%
            }

            // Check how many columns would be very small (< 9%) if we shrink this one
            const verySmallCount = prevWidths.filter((w, i) =>
              i === columnIndex ? proposedWidth < 9 : w < 9
            ).length;

            // Don't allow more than 1 very small columns
            if (verySmallCount > 1) {
              targetWidth = Math.max(9, proposedWidth); // Keep it at least 9%
            } else {
              targetWidth = proposedWidth; // Allow shrinking within constraints
            }
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
          // const distributedIndex = 0;
          for (let i = 0; i < newWidths.length; i++) {
            if (i !== columnIndex) {
              const originalProportion = prevWidths[i] / otherColumnsTotal;
              newWidths[i] = remainingWidth * originalProportion;
            }
          }

          // Apply column-specific minimums after redistribution
          let totalAdjustment = 0;
          if (newWidths[0] < 25) {
            totalAdjustment += 25 - newWidths[0];
            newWidths[0] = 25;
          }
          if (newWidths[1] < 10) {
            totalAdjustment += 10 - newWidths[1];
            newWidths[1] = 10;
          }
          // Apply 7% minimum to all other columns
          for (let i = 2; i < newWidths.length; i++) {
            if (newWidths[i] < 7) {
              totalAdjustment += 7 - newWidths[i];
              newWidths[i] = 7;
            }
          }

          // If we had to boost columns, take the deficit from the target column if it's expandable
          if (totalAdjustment > 0) {
            // First try to take from the target column if it was expanded and is large enough
            if (action === "expand" && newWidths[columnIndex] > 25) {
              const maxFromTarget = Math.min(
                totalAdjustment,
                newWidths[columnIndex] - 25
              );
              newWidths[columnIndex] -= maxFromTarget;
              totalAdjustment -= maxFromTarget;
            }

            // If still need adjustment, take from other large columns
            if (totalAdjustment > 0) {
              // Find the largest non-protected columns
              let largestIndex = -1;
              let largestWidth = 0;
              for (let i = 0; i < newWidths.length; i++) {
                if (i !== columnIndex && newWidths[i] > largestWidth) {
                  largestIndex = i;
                  largestWidth = newWidths[i];
                }
              }

              if (largestIndex !== -1) {
                const minForLargest =
                  largestIndex === 0 ? 25 : largestIndex === 1 ? 10 : 12;
                const maxReduction = Math.max(
                  0,
                  newWidths[largestIndex] - minForLargest
                );
                const actualReduction = Math.min(totalAdjustment, maxReduction);
                newWidths[largestIndex] -= actualReduction;
              }
            }
          }

          // Prevent too many columns from being very small (< 10%)
          const verySmallIndices = newWidths
            .map((width, index) => ({ width, index }))
            .filter((col) => col.width < 10)
            .map((col) => col.index);

          if (verySmallIndices.length > 1) {
            // Allow only 1 very small column
            // Boost the smallest columns back to appropriate minimums
            const sortedSmall = verySmallIndices.sort(
              (a, b) => newWidths[a] - newWidths[b]
            );

            // Keep only the 1 smallest, boost the rest to appropriate minimums
            for (let i = 1; i < sortedSmall.length; i++) {
              const indexToBoost = sortedSmall[i];
              let minimumWidth = 10;

              // Apply column-specific minimums
              if (indexToBoost === 0) {
                minimumWidth = 25; // First column min 25%
              } else if (indexToBoost === 1) {
                minimumWidth = 10; // Second column min 10%
              } else {
                minimumWidth = 12; // All other columns min 12%
              }

              const deficit = minimumWidth - newWidths[indexToBoost];
              newWidths[indexToBoost] = minimumWidth;

              // Take the deficit from the largest non-boosted column
              let largestIndex = 0;
              for (let j = 0; j < newWidths.length; j++) {
                if (
                  !sortedSmall.slice(2).includes(j) &&
                  newWidths[j] > newWidths[largestIndex]
                ) {
                  largestIndex = j;
                }
              }
              newWidths[largestIndex] = Math.max(
                10,
                newWidths[largestIndex] - deficit
              );
            }
          }

          // Ensure we sum exactly to 100% (handle floating point precision)
          const total = newWidths.reduce((sum, width) => sum + width, 0);
          const adjustment = 100 - total;

          // Apply adjustment to the largest column
          let largestIndex = 0;
          for (let i = 0; i < newWidths.length; i++) {
            if (newWidths[i] > newWidths[largestIndex]) {
              largestIndex = i;
            }
          }
          newWidths[largestIndex] += adjustment;

          return newWidths;
        });

        // Resume cell movement after column change
        setTimeout(() => {
          setIsColumnChanging(false);
        }, 600); // After column animation (0.4s) + slight delay
      }, 4000); // Wait 4 seconds before making the change
    }, 4000 + Math.random() * 6000); // Every 4-10 seconds

    // Spreadsheet-style selection simulation (multiple selections)
    const selectionInterval = setInterval(() => {
      // Only create new selection if we have less than 2
      setSelections((prevSelections) => {
        if (prevSelections.length >= 2) return prevSelections;

        // Pick a random starting cell - different ranges for mobile vs desktop
        const minSelectionRow = isMobile ? 15 : isXL ? 8 : 4; // Mobile: row 15, XL: row 8, Desktop: row 4
        const maxSelectionRow = isMobile ? 28 : isXL ? 15 : 11; // Mobile: row 28, XL: row 15, Desktop: row 11
        // Ensure we can always fit at least 2 rows by limiting startRow range
        const maxStartRow = maxSelectionRow - 1; // Ensure startRow + 1 <= maxSelectionRow
        const startRowRange = maxStartRow - minSelectionRow + 1;
        const startRow =
          Math.floor(Math.random() * Math.max(1, startRowRange)) +
          minSelectionRow; // This ensures startRow + 1 will never exceed maxSelectionRow
        const biasedRandom = Math.random() * 0.6 + 0.4; // Bias towards right (0.4-1.0)
        const startCol = Math.floor(biasedRandom * (numColumns - 1)) + 1; // Favor columns 4-7

        const selectionId = `selection-${Date.now()}-${Math.random()}`;

        // Start with minimum 2-row selection (startRow to startRow + 1 = 2 rows)
        const newSelection = {
          id: selectionId,
          startRow,
          startCol,
          endRow: startRow + 1, // Always 2 rows minimum (startRow is guaranteed to be <= maxSelectionRow - 1)
          endCol: startCol,
          isFlashing: false,
        };

        // Add the new selection
        const updatedSelections = [...prevSelections, newSelection];

        // Simulate dragging - expand the selection over time
        let currentEndRow = startRow + 1; // Start with exactly 2 rows
        let currentEndCol = startCol;

        const dragSteps = Math.floor(Math.random() * 8) + 3; // 3-10 steps
        const dragInterval = setInterval(() => {
          // Randomly expand in different directions
          const direction = Math.random();

          // Calculate current column span
          const currentColSpan = currentEndCol - startCol + 1;

          if (direction < 0.4) {
            // Expand right (only if we haven't reached 3 columns)
            if (currentColSpan < 3) {
              currentEndCol = Math.min(numColumns, currentEndCol + 1);
            }
          } else if (direction < 0.7) {
            // Expand down (different limits for mobile vs desktop)
            const maxExpandRow = isMobile ? 28 : 12;
            currentEndRow = Math.min(maxExpandRow, currentEndRow + 1);
          } else if (direction < 0.85) {
            // Expand diagonally (only expand column if under 3 column limit)
            if (currentColSpan < 3) {
              currentEndCol = Math.min(numColumns, currentEndCol + 1);
            }
            const maxExpandRow = isMobile ? 28 : 12;
            currentEndRow = Math.min(maxExpandRow, currentEndRow + 1);
          }
          // 15% chance to not expand (pause)

          setSelections((prevSels) =>
            prevSels.map((sel) => {
              if (sel.id === selectionId) {
                // Ensure endRow is always at least startRow + 1 (minimum 2 rows)
                const safeEndRow = Math.max(currentEndRow, sel.startRow + 1);
                return { ...sel, endRow: safeEndRow, endCol: currentEndCol };
              }
              return sel;
            })
          );
        }, 150 + Math.random() * 100); // 150-250ms between drag steps

        // Stop dragging after a few steps
        setTimeout(() => {
          clearInterval(dragInterval);

          // Keep selection visible for a moment, then flash before clearing
          setTimeout(() => {
            // Start flashing before disappearing (old school computer style)
            setSelections((prevSels) =>
              prevSels.map((sel) =>
                sel.id === selectionId ? { ...sel, isFlashing: true } : sel
              )
            );

            // Flash for about 400ms (fast flashes), then clear
            setTimeout(() => {
              setSelections((prevSels) =>
                prevSels.filter((sel) => sel.id !== selectionId)
              );
            }, 400);
          }, 1000 + Math.random() * 2000); // Hold selection for 1-3 seconds
        }, dragSteps * 200);

        return updatedSelections;
      });
    }, 2000 + Math.random() * 4000); // New selection every 2-6 seconds (more frequent)

    return () => {
      movementIntervals.forEach(clearTimeout);
      clearInterval(addRemoveInterval);
      clearInterval(columnMorphInterval);
      clearInterval(selectionInterval);
    };
  }, [isMobile, isXL, numColumns, isColumnChanging, wouldOverlap]);

  // Handle screen resize: move cells to appropriate rows when switching mobile/desktop
  useEffect(() => {
    setMovingCells((prevCells) => {
      return prevCells.map((cell) => {
        if (isMobile && cell.row < 12) {
          // Moving to mobile: push cells below row 12
          return {
            ...cell,
            row: Math.max(12, cell.row + 12), // Push down by 12 rows minimum
          };
        } else if (!isMobile && cell.row > 15) {
          // Moving to desktop: allow cells to move up to middle area
          return {
            ...cell,
            row: Math.max(4, cell.row - 8), // Pull up by 8 rows
          };
        }
        return cell;
      });
    });
  }, [isMobile]);

  // Update column widths when screen size changes
  useEffect(() => {
    setCurrentColumnWidths(
      isMobile ? MOBILE_columnWidthsArray : DESKTOP_columnWidthsArray
    );
    // Clear selections when switching between mobile/desktop since they may be in wrong row ranges
    setSelections([]);
  }, [isMobile]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
      {/* 2 left vertical lines - like spreadsheet margins */}

      {/* Vertical columns in main grid */}
      <motion.div
        className="grid h-full"
        style={{ zIndex: 0 }}
        animate={{
          gridTemplateColumns: createColumnWidths(
            currentColumnWidths ||
              (isMobile ? MOBILE_columnWidthsArray : DESKTOP_columnWidthsArray)
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
          length: numColumns - 1, // Skip last column - container border handles final edge
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
      <div className="absolute inset-0" style={{ zIndex: 5 }}>
        <AnimatePresence>
          {(movingCells || []).map((cell) => (
            <motion.div
              key={cell.id}
              className="absolute overflow-hidden bg-background"
              style={{
                position: "absolute",
                height: `${rowHeight}px`,
                border: "1px solid var(--muted-foreground)",
                zIndex: movingCellId === cell.id ? 10 : 1,
              }}
              initial={{
                opacity: 0,
                backgroundColor: "transparent",
                width: "0px", // Start at 0 width
              }}
              animate={{
                opacity: 1,
                top: `${(cell.row - 1) * rowHeight - (cell.row - 1)}px`, // Animate vertical position (subtract 1px per row for border overlap)
                left: `${getColumnPosition(
                  cell.colStart,
                  currentColumnWidths || columnWidthsArray
                )}%`,
                width: `${getColumnWidth(
                  cell.colStart,
                  cell.colEnd,
                  currentColumnWidths || columnWidthsArray
                )}%`,
              }}
              transition={{
                opacity: {
                  duration: 0.1,
                  delay: cell.delay / 1000,
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
              }}
            >
              {/* Inner content that swipes in */}
              <motion.div
                className="w-full h-full"
                style={{
                  backgroundColor: "transparent", // No color during animation
                }}
                initial={{
                  clipPath: "inset(0 100% 0 0)", // Start fully clipped from right
                }}
                animate={{
                  clipPath: "inset(0 0% 0 0)", // Reveal to full width
                }}
                transition={{
                  clipPath: {
                    duration: 0.15,
                    delay: cell.delay / 1000 + 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94], // Tight easing curve (easeOutQuart)
                  },
                }}
              >
                {/* Random color spark animations - only for selected cells */}
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
                    initial={{
                      clipPath: "inset(0 100% 0 0)", // Start completely hidden
                    }}
                    animate={{
                      clipPath: !isCellInSelection(cell)
                        ? cell.id.charCodeAt(6) % 2 === 0
                          ? "inset(0 0% 0 100%)" // Swipe out right when deselected
                          : "inset(0 100% 0 0)" // Swipe out left when deselected
                        : "inset(0 0% 0 0%)", // Show fully when selected (persist through column changes)
                      opacity: isCellInFlashingSelection(cell)
                        ? [1, 0.2, 1] // Single flash: full → dim → full
                        : 1,
                    }}
                    transition={{
                      duration: 0.3, // Quick swipe in/out
                      delay: 0,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      opacity: isCellInFlashingSelection(cell)
                        ? {
                            duration: 0.3,
                            delay: (cell.id.charCodeAt(2) % 6) * 0.03, // Staggered delay: 0-0.15s
                            ease: [0.68, -0.55, 0.265, 1.55], // Elastic bounce
                            times: [0, 0.6, 1], // 60% down, 40% back up
                          }
                        : {},
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Spreadsheet-style selection overlays */}
      {selections.map((selection) => (
        <motion.div
          key={selection.id}
          className="absolute pointer-events-none"
          style={{
            top: `${
              (selection.startRow - 1) * rowHeight - (selection.startRow - 1)
            }px`,
            left: `${getColumnPosition(
              selection.startCol,
              currentColumnWidths || columnWidthsArray
            )}%`,
            width: `${
              getColumnPosition(
                selection.endCol + 1,
                currentColumnWidths || columnWidthsArray
              ) -
              getColumnPosition(
                selection.startCol,
                currentColumnWidths || columnWidthsArray
              )
            }%`,
            height: `${Math.max(
              2 * rowHeight - 1, // Minimum 2 rows height
              (selection.endRow - selection.startRow + 1) * rowHeight -
                (selection.endRow - selection.startRow)
            )}px`,
            backgroundColor: "rgba(62, 207, 142, 0.08)", // Supabase green background
            zIndex: 20,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: selection.isFlashing ? [1, 0, 1, 0, 1, 0, 1, 0] : 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: selection.isFlashing ? 0.4 : 0.1,
            ease: selection.isFlashing ? "linear" : "easeOut",
            times: selection.isFlashing
              ? [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1]
              : undefined,
          }}
        >
          {/* Dot grid pattern inside selection */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(62, 207, 142, 0.3) 0.5px, transparent 0.5px)`,
              backgroundSize: "8px 8px",
              backgroundPosition: "2px 2px",
            }}
          />

          {/* Marching ants border animation */}
          <motion.div
            className="absolute inset-0"
            style={{
              border: "2px solid rgba(62, 207, 142, 0.9)",
              borderRadius: "2px",
              borderStyle: "dashed",
            }}
            animate={{
              borderColor: [
                "rgba(62, 207, 142, 0.9)",
                "rgba(62, 207, 142, 0.4)",
                "rgba(62, 207, 142, 0.9)",
              ],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Resize handle triangle in bottom-right corner */}
          <div
            className="absolute"
            style={{
              bottom: "0px",
              right: "0px",
              width: "8px",
              height: "8px",
              backgroundColor: "rgba(62, 207, 142, 0.9)",
              clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
            }}
          />

          {/* Extra marching ants effect with offset */}
          <motion.div
            className="absolute inset-0"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.6)",
              borderRadius: "2px",
              borderStyle: "dotted",
              transform: "translate(1px, 1px)",
            }}
            animate={{
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
