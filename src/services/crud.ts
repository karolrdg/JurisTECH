import { api } from "./http/api";
import { delay, logActivity } from "./mock/mockDb";

export interface CrudService<T, I> {
  list(): Promise<T[]>;
  get(id: string): Promise<T>;
  create(input: I): Promise<T>;
  update(id: string, input: I): Promise<T>;
  remove(id: string): Promise<void>;
}

/** REST implementation — maps 1:1 to the ASP.NET Core controllers. */
export function createApiCrud<T, I>(path: string): CrudService<T, I> {
  return {
    list: async () => (await api.get<T[]>(path)).data,
    get: async (id) => (await api.get<T>(`${path}/${id}`)).data,
    create: async (input) => (await api.post<T>(path, input)).data,
    update: async (id, input) => (await api.put<T>(`${path}/${id}`, input)).data,
    remove: async (id) => {
      await api.delete(`${path}/${id}`);
    },
  };
}

/** In-memory implementation used until the API is available. */
export function createMockCrud<T extends { id: string }, I>(opts: {
  store: () => T[];
  build: (input: I, existing?: T) => T;
  label: (item: T) => string;
  noun: string;
}): CrudService<T, I> {
  const find = (id: string) => {
    const item = opts.store().find((x) => x.id === id);
    if (!item) throw new Error("Registro não encontrado.");
    return item;
  };
  return {
    async list() {
      await delay();
      return [...opts.store()];
    },
    async get(id) {
      await delay(200);
      return { ...find(id) };
    },
    async create(input) {
      await delay();
      const item = opts.build(input);
      opts.store().unshift(item);
      logActivity(`${opts.noun} “${opts.label(item)}” cadastrado.`);
      return item;
    },
    async update(id, input) {
      await delay();
      const s = opts.store();
      const idx = s.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error("Registro não encontrado.");
      const item = opts.build(input, s[idx]);
      s[idx] = item;
      logActivity(`${opts.noun} “${opts.label(item)}” atualizado.`);
      return item;
    },
    async remove(id) {
      await delay();
      const s = opts.store();
      const item = find(id);
      s.splice(s.indexOf(item), 1);
      logActivity(`${opts.noun} “${opts.label(item)}” excluído.`);
    },
  };
}
