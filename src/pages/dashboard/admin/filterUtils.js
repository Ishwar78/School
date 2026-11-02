// Shared filter and sorting logic. Context data is never mutated.
export function applyFilters(
  items,
  search,
  filters,
  values,
  sort,
  searchable = [],
) {
  const term = search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const text = (
      searchable.length
        ? searchable.map((f) =>
            typeof f === "string"
              ? item[f]
              : f.value
                ? f.value(item)
                : item[f.key],
          )
        : Object.values(item)
    )
      .join(" ")
      .toLowerCase();
    if (term && !text.includes(term)) return false;
    return filters.every((f) => {
      const selected = values[f.key];
      if (selected === undefined || selected === "") return true;
      const raw = f.value ? f.value(item) : item[f.key];
      if (f.type === "date" || f.type === "number") {
        const actual = f.type === "number" ? Number(raw) : String(raw || "");
        const wanted =
          f.type === "number" ? Number(selected) : String(selected);
        if (raw === undefined || raw === null || raw === "") return false;
        return f.compare === "min"
          ? actual >= wanted
          : f.compare === "max"
            ? actual <= wanted
            : actual === wanted;
      }
      if (f.match === "contains") {
        const values = Array.isArray(raw)
          ? raw
          : String(raw ?? "")
              .split(",")
              .map((value) => value.trim());

        return values.some(
          (value) =>
            String(value).toLowerCase() === String(selected).toLowerCase(),
        );
      }

      return String(raw ?? "") === String(selected);
    });
  });

  return filtered.sort((a, b) => {
    const an = String(a.name || a.title || a.grade || a.type || "");
    const bn = String(b.name || b.title || b.grade || b.type || "");
    if (sort === "az")
      return an.localeCompare(bn, undefined, { numeric: true });
    if (sort === "za")
      return bn.localeCompare(an, undefined, { numeric: true });

    return sort === "oldest"
      ? items.indexOf(a) - items.indexOf(b)
      : items.indexOf(b) - items.indexOf(a);
  });
}
