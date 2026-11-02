import React, { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw, X } from "lucide-react";

// One reusable filter toolbar for every Admin module.
export default function FilterPanel({
  search,
  setSearch,
  filters,
  values,
  setValues,
  items,
  count,
  total,
  sort,
  setSort,
  searchPlaceholder = "Search all record fields...",
}) {
  const [expanded, setExpanded] = useState(false);

  const active = filters.filter(
    (f) => values[f.key] !== undefined && values[f.key] !== "",
  );
  const clear = () => {
    setSearch("");
    setValues({});
    setSort("newest");
  };

  function optionsFor(f) {
    const dynamicOptions = f.includeDynamic
      ? items
          .flatMap((item) => {
            if (f.optionValues) return f.optionValues(item);
            return [f.value ? f.value(item) : item[f.key]];
          })
          .filter(
            (value) => value !== undefined && value !== null && value !== "",
          )
          .sort((a, b) =>
            String(a).localeCompare(String(b), undefined, { numeric: true }),
          )
      : [];

    const options = [...(f.options || []), ...dynamicOptions];

    const seen = new Set();

    return options.filter((option) => {
      const value = typeof option === "object" ? option.value : option;
      const key = String(value);

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    });
  }
  return (
    <div className="filter-panel panel">
      <div className="filter-topline">
        <div>
          <span className="eyebrow">FIND RECORDS</span>
          <h2>Search & filters</h2>
          <p>Combine filters to narrow your results.</p>
        </div>
        <span className="filter-total">
          {count} of {total} records
        </span>
      </div>

      <div className="filter-toolbar">
        <label className="search-field filter-search">
          <Search size={18} />
          <input
            aria-label="Search records"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </label>
        <button
          type="button"
          className={`secondary-btn filter-toggle ${expanded ? "filter-toggle-on" : ""}`}
          onClick={() => setExpanded((v) => !v)}
        >
          <SlidersHorizontal size={17} /> Advanced filters{" "}
          {active.length > 0 && <b>{active.length}</b>}
        </button>
        <label className="filter-sort">
          Sort by{" "}
          <select
            aria-label="Sort records"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
        </label>
        <button type="button" className="filter-reset" onClick={clear}>
          <RotateCcw size={16} /> Clear all
        </button>
      </div>
      {expanded && (
        <div className="filter-expanded">
          <div className="filter-grid">
            {filters.map((f) => (
              <label key={f.key} className="filter-control">
                <span>{f.label}</span>
                {f.type === "date" || f.type === "number" ? (
                  <input
                    aria-label={f.label}
                    type={f.type}
                    min={f.min}
                    max={f.max}
                    value={values[f.key] ?? ""}
                    onChange={(e) =>
                      setValues((old) => ({ ...old, [f.key]: e.target.value }))
                    }
                  />
                ) : (
                  <select
                    aria-label={f.label}
                    value={values[f.key] ?? ""}
                    onChange={(e) =>
                      setValues((old) => ({ ...old, [f.key]: e.target.value }))
                    }
                  >
                    <option value="">All {f.label.toLowerCase()}</option>
                    {optionsFor(f).map((o) => {
                      const value = typeof o === "object" ? o.value : o;
                      const label = typeof o === "object" ? o.label : o;

                      return (
                        <option key={String(value)} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
      {active.length > 0 && (
        <div className="filter-chips">
          {active.map((f) => (
            <button
              type="button"
              key={f.key}
              onClick={() => setValues((old) => ({ ...old, [f.key]: "" }))}
            >
              {f.label}:{" "}
              {String(
                (
                  optionsFor(f).find(
                    (o) =>
                      typeof o === "object" &&
                      String(o.value) === String(values[f.key]),
                  ) || {}
                ).label || values[f.key],
              )}
              <X size={13} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
