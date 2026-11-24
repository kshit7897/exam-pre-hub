import { Binary, Boxes, CircuitBoard, Cpu, HardDrive, Network, type LucideIcon } from "lucide-react";

// Solid colours for units and subjects. Used through the --c CSS variable.
export const PALETTE = ["#fb923c", "#a78bfa", "#fbbf24", "#f472b6", "#f97316", "#c084fc"];

export function colorAt(i: number) {
  return PALETTE[i % PALETTE.length];
}

// One icon per unit, in order. Falls back to Cpu.
export const UNIT_ICONS: LucideIcon[] = [Binary, CircuitBoard, Boxes, Network, HardDrive];

export function iconAt(i: number): LucideIcon {
  return UNIT_ICONS[i] ?? Cpu;
}
