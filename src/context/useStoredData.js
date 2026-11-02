import { useEffect, useState } from "react";

function mergeMissingItems(savedItems, initialItems) {
  const items = [...savedItems];

  initialItems.forEach((initialItem) => {
    const alreadySaved = items.some(
      (item) =>
        (item?.id != null &&
          String(item.id) === String(initialItem.id)) ||
        (initialItem.email &&
          String(item?.email || "").toLowerCase() ===
            initialItem.email.toLowerCase()),
    );

    if (!alreadySaved) {
      items.push(initialItem);
    }
  });

  return items;
}

function readItems(key, initial, mergeInitial) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return { items: initial, error: "" };
    }

    const items = JSON.parse(saved);

    if (!Array.isArray(items)) {
      throw new TypeError(`Saved data for "${key}" must be an array.`);
    }

    return {
      items: mergeInitial ? mergeMissingItems(items, initial) : items,
      error: "",
    };
  } catch (error) {
    console.error(`Unable to load saved data for "${key}".`, error);

    return {
      items: initial,
      error: `Saved data for ${key} could not be loaded. The stored value was left unchanged.`,
    };
  }
}

export default function useStoredData(key, initial = [], mergeInitial = false) {
  const [stored, setStored] = useState(() =>
    readItems(key, initial, mergeInitial),
  );

  const { items, error } = stored;

  const [canSave, setCanSave] = useState(!error);

  useEffect(() => {
    if (!canSave) {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (saveError) {
      console.error(`Unable to save data for "${key}".`, saveError);
      setStored((current) => ({
        ...current,
        error: `Changes to ${key} could not be saved in this browser.`,
      }));
    }
  }, [canSave, items, key]);

  function add(item) {
    setCanSave(true);
    setStored((current) => ({
      ...current,
      error: "",
      items: [
        ...current.items,
        { ...item, id: item.id || crypto.randomUUID() },
      ],
    }));
  }

  function update(id, changes) {
    setCanSave(true);
    setStored((current) => ({
      ...current,
      error: "",
      items: current.items.map((item) =>
        item.id === id ? { ...item, ...changes } : item,
      ),
    }));
  }

  function remove(id) {
    setCanSave(true);
    setStored((current) => ({
      ...current,
      error: "",
      items: current.items.filter((item) => item.id !== id),
    }));
  }

  return { items, add, update, remove, error };
}
