import type { ReactNode } from "react";
import type { Filter } from "../types";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

interface ShellProps {
  children: ReactNode;
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  counts: { all: number; active: number; completed: number };
}

function NavItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-btn)] text-sm font-medium transition-colors w-full text-left"
      style={{
        background: active ? "var(--color-accent)" : "transparent",
        color: active ? "#fff" : "var(--color-ink)",
      }}
    >
      <span>{label}</span>
      <span
        className="text-xs tabular-nums"
        style={{ opacity: active ? 0.8 : 0.5 }}
      >
        {count}
      </span>
    </button>
  );
}

export function Shell({ children, filter, onFilterChange, counts }: ShellProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen">
        <aside
          className="flex flex-col border-r h-full shrink-0"
          style={{
            width: "17rem",
            borderColor: "var(--color-line)",
            background: "var(--color-panel)",
          }}
        >
          <div
            className="p-6 font-bold text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Todo
          </div>
          <nav className="flex-1 px-4 flex flex-col gap-1">
            {filters.map((f) => (
              <NavItem
                key={f.key}
                label={f.label}
                count={counts[f.key]}
                active={filter === f.key}
                onClick={() => onFilterChange(f.key)}
              />
            ))}
          </nav>
          <div
            className="p-4 text-xs"
            style={{ color: "var(--color-muted)" }}
          >
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--color-muted)" }}
            >
              Part of FreeAppStore — free forever
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      {/* Mobile */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center px-4 h-14 border-b shrink-0"
          style={{
            borderColor: "var(--color-line)",
            background: "var(--color-panel)",
          }}
        >
          <span
            className="font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Todo
          </span>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
        <nav
          className="flex items-center justify-around h-14 border-t shrink-0"
          style={{
            borderColor: "var(--color-line)",
            background: "var(--color-panel)",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className="flex flex-col items-center gap-0.5 text-xs font-medium"
              style={{
                color:
                  filter === f.key
                    ? "var(--color-accent)"
                    : "var(--color-muted)",
              }}
            >
              <span>{f.label}</span>
              <span className="tabular-nums">{counts[f.key]}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
