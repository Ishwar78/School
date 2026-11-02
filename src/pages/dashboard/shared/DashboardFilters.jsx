import React, { useState } from "react";

import FilterPanel from "../admin/FilterPanel";
import { applyFilters } from "../admin/filterUtils";

export function useDashboardFilters(items, filters, searchable = []) {
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [sort, setSort] = useState("newest");

  const filteredItems = applyFilters(
    items,
    search,
    filters,
    values,
    sort,
    searchable,
  );

  return {
    search,
    setSearch,
    values,
    setValues,
    sort,
    setSort,
    filteredItems,
  };
}

export default function DashboardFilters({
  state,
  filters,
  items,
  showNoMatches = true,
}) {
  return (
    <>
      <FilterPanel
        search={state.search}
        setSearch={state.setSearch}
        filters={filters}
        values={state.values}
        setValues={state.setValues}
        items={items}
        count={state.filteredItems.length}
        total={items.length}
        sort={state.sort}
        setSort={state.setSort}
        searchPlaceholder="Search these records..."
      />
      {showNoMatches && items.length > 0 && state.filteredItems.length === 0 && (
        <p className="role-empty">
          No records match the current search and filters.
        </p>
      )}
    </>
  );
}
