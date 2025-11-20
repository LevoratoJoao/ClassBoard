import { materiasAPI } from "./apiService";

let _cache = null;
let _loading = null;

export async function getMaterias(forceRefresh = false) {
  if (!forceRefresh && _cache) return _cache;

  if (!forceRefresh && _loading) return _loading;

  _loading = materiasAPI.getAll()
    .then((list) => {
      _cache = Array.isArray(list) ? list : [];
      return _cache;
    })
    .finally(() => {
      _loading = null;
    });

  return _loading;
}

export async function getMateriaById(id) {
  const mats = await getMaterias();
  return mats.find((m) => m.id === id) || null;
}

export async function getMateriasLabelMap() {
  const mats = await getMaterias();
  return new Map(mats.map((m) => [m.id, m.label]));
}

export async function getMateriasIds() {
  const mats = await getMaterias();
  return mats.map((m) => m.id);
}

export function invalidateMateriasCache() {
  _cache = null;
  _loading = null;
}
