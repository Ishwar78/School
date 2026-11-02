import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import FilterPanel from "./FilterPanel";
import { applyFilters } from "./filterUtils";

export default function RecordManager({
  title,
  description,
  data,
  fields,
  filters = [],
  getLabel,
  extraColumns = [],
  validate,
}) {
  const { items, add, update, remove } = data;

  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  const empty = Object.fromEntries(
    fields.map((field) => [field.key, field.default ?? ""]),
  );

  const shown = applyFilters(items, search, filters, values, sort, fields);

  function optionsForField(field) {
    const savedOptions = field.includeDynamic
      ? items
          .flatMap((item) => {
            if (field.optionValues) return field.optionValues(item);
            const value = item[field.key];

            return Array.isArray(value) ? value : [value];
          })
          .filter(
            (value) => value !== undefined && value !== null && value !== "",
          )
      : [];

    const options = [...(field.options || []), ...savedOptions];

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

  useEffect(() => setPage(1), [search, values, sort, pageSize]);

  const pages = Math.max(1, Math.ceil(shown.length / pageSize));

  const visible = shown.slice(
    (Math.min(page, pages) - 1) * pageSize,
    Math.min(page, pages) * pageSize,
  );

  function close() {
    setForm(null);
    setEditing(null);
    setError("");
  }

  function save(event) {
    event.preventDefault();
    const message = validate?.(form, items, editing);
    if (message) {
      setError(message);

      return;
    }
    if (editing) update(editing, form);
    else add(form);
    close();
  }

  function edit(item) {
    setEditing(item.id);
    setError("");
    setForm(
      Object.fromEntries(
        fields.map((field) => {
          const value = item[field.key] ?? field.default ?? "";
          const normalizedValue =
            field.type === "multiselect" && typeof value === "string"
              ? value
                  .split(",")
                  .map((entry) => entry.trim())
                  .filter(Boolean)
              : value;

          return [field.key, normalizedValue];
        }),
      ),
    );
  }

  function del(item) {
    if (window.confirm(`Delete ${getLabel(item)}? This cannot be undone.`))
      remove(item.id);
  }
  const columns = fields.filter((f) => f.table !== false);

  return (
    <section className="module">
      <div className="module-head">
        <div>
          <span className="eyebrow">SCHOOL RECORDS</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => {
            setEditing(null);
            setError("");
            setForm({ ...empty });
          }}
        >
          <Plus size={18} /> Add{" "}
          {title
            .replace(/ Information| Management| Records/g, "")
            .replace(/s$/, "")}
        </button>
      </div>
      <FilterPanel
        search={search}
        setSearch={setSearch}
        filters={filters}
        values={values}
        setValues={setValues}
        items={items}
        count={shown.length}
        total={items.length}
        sort={sort}
        setSort={setSort}
      />
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              {extraColumns.map((c) => (
                <th key={c.label}>{c.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                {columns.map((f) => (
                  <td key={f.key}>
                    {f.display
                      ? f.display(item[f.key], item)
                      : (item[f.key] ?? "—")}
                  </td>
                ))}
                {extraColumns.map((c) => (
                  <td key={c.label}>{c.render(item)}</td>
                ))}
                <td>
                  <div className="actions">
                    <button
                      aria-label={`Edit ${getLabel(item)}`}
                      title="Edit"
                      onClick={() => edit(item)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      aria-label={`Delete ${getLabel(item)}`}
                      title="Delete"
                      className="danger"
                      onClick={() => del(item)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  className="empty-cell"
                  colSpan={columns.length + extraColumns.length + 1}
                >
                  No matching records. Try clearing filters or add a record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-bar">
        <span>
          Showing{" "}
          {shown.length ? (Math.min(page, pages) - 1) * pageSize + 1 : 0}–
          {Math.min(Math.min(page, pages) * pageSize, shown.length)} of{" "}
          {shown.length}
        </span>
        <label>
          Rows per page{" "}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </label>
        <div className="pagination-buttons">
          <button
            disabled={page <= 1}
            onClick={() => setPage((v) => v - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={17} />
          </button>
          <span>
            Page {Math.min(page, pages)} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((v) => v + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      {form && (
        <div className="modal-shade" onClick={close}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${editing ? "Edit" : "Add"} ${title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <h2>
                {editing ? "Edit" : "Add"} {title}
              </h2>
              <button onClick={close} aria-label="Close">
                <X />
              </button>
            </div>
            <form onSubmit={save}>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="form-grid">
                {fields
                  .filter((f) => !f.readonly)
                  .map((f) => (
                    <label key={f.key}>
                      {f.label}
                      {f.type === "select" ? (
                        <select
                          required={f.required}
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm((old) => ({
                              ...old,
                              [f.key]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select {f.label}</option>
                          {optionsForField(f).map((o) => (
                            <option
                              key={typeof o === "object" ? o.value : o}
                              value={typeof o === "object" ? o.value : o}
                            >
                              {typeof o === "object" ? o.label : o}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "multiselect" ? (
                        <select
                          multiple
                          value={form[f.key] || []}
                          onChange={(e) =>
                            setForm((old) => ({
                              ...old,
                              [f.key]: Array.from(
                                e.target.selectedOptions,
                                (option) => option.value,
                              ),
                            }))
                          }
                        >
                          {optionsForField(f).map((option) => (
                            <option
                              key={
                                typeof option === "object"
                                  ? option.value
                                  : option
                              }
                              value={
                                typeof option === "object"
                                  ? option.value
                                  : option
                              }
                            >
                              {typeof option === "object"
                                ? option.label
                                : option}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "textarea" ? (
                        <textarea
                          required={f.required}
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm((old) => ({
                              ...old,
                              [f.key]: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <input
                          required={f.required}
                          type={f.type || "text"}
                          min={f.min}
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm((old) => ({
                              ...old,
                              [f.key]: e.target.value,
                            }))
                          }
                          placeholder={f.placeholder || f.label}
                        />
                      )}
                      {f.emptyMessage && optionsForField(f).length === 0 && (
                        <small>{f.emptyMessage}</small>
                      )}
                    </label>
                  ))}
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={close}>
                  Cancel
                </button>
                <button className="primary-btn">
                  <Save size={17} /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
