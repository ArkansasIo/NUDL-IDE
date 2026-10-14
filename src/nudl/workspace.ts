import type { VirtualFile } from './types';

export const WORKSPACE_STORAGE_KEY = 'nudl_workspace_files';
export const MAX_WORKSPACE_FILES = 500;
export const MAX_FILE_NAME_LENGTH = 240;
export const MAX_FILE_CONTENT_LENGTH = 2_000_000;
export const MAX_WORKSPACE_JSON_LENGTH = 20_000_000;

export interface WorkspaceEnvelope {
  format: 'NUDL-IDE-workspace';
  version: number;
  exportedAt?: string;
  files: VirtualFile[];
}

/** Return null rather than crashing when browser storage is unavailable. */
export function getWorkspaceStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadWorkspace(fallback: VirtualFile[]): VirtualFile[] {
  const storage = getWorkspaceStorage();
  if (!storage) return fallback;
  try {
    const saved = storage.getItem(WORKSPACE_STORAGE_KEY);
    if (!saved) return fallback;
    return validateWorkspaceFiles(JSON.parse(saved) as unknown);
  } catch {
    return fallback;
  }
}

export function saveWorkspace(files: VirtualFile[]): boolean {
  const storage = getWorkspaceStorage();
  if (!storage) return false;
  try {
    storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(files));
    return true;
  } catch {
    return false;
  }
}

export function clearSavedWorkspace(): void {
  try {
    getWorkspaceStorage()?.removeItem(WORKSPACE_STORAGE_KEY);
  } catch {
    // The in-memory workspace can still be reset when storage is blocked.
  }
}

/** Validate both local storage and imported workspace data before applying it. */
export function validateWorkspaceFiles(value: unknown): VirtualFile[] {
  let entries: unknown = value;
  if (value && typeof value === 'object' && 'format' in value && 'files' in value) {
    const envelope = value as Partial<WorkspaceEnvelope>;
    if (envelope.format !== 'NUDL-IDE-workspace' || !Array.isArray(envelope.files)) {
      throw new Error('Unsupported NUDL IDE workspace format.');
    }
    entries = envelope.files;
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('A workspace must contain at least one file.');
  }
  if (entries.length > MAX_WORKSPACE_FILES) {
    throw new Error('A workspace may contain at most ' + MAX_WORKSPACE_FILES + ' files.');
  }

  const names = new Set<string>();
  let aggregateCharacters = 0;
  const validated: VirtualFile[] = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('Workspace entries must be file objects.');
    }
    const candidate = entry as Partial<VirtualFile>;
    if (typeof candidate.name !== 'string' || typeof candidate.content !== 'string') {
      throw new Error('Every workspace file must have a name and string content.');
    }
    const name = candidate.name.trim().replace(/\\/g, '/');
    if (!name || name.length > MAX_FILE_NAME_LENGTH) {
      throw new Error('Workspace filenames must be non-empty and within the filename limit.');
    }
    if (name.startsWith('/') || /^[A-Za-z]:/.test(name) ||
        name.split('/').some((part) => !part || part === '.' || part === '..')) {
      throw new Error('Invalid relative path in workspace: "' + name + '".');
    }
    if (/[\u0000-\u001f]/.test(name)) {
      throw new Error('Workspace filenames cannot contain control characters.');
    }
    const normalizedName = name.toLocaleLowerCase('en-US');
    if (names.has(normalizedName)) {
      throw new Error('Duplicate filename in workspace: "' + name + '".');
    }
    names.add(normalizedName);

    if (candidate.content.length > MAX_FILE_CONTENT_LENGTH) {
      throw new Error('File "' + name + '" exceeds the per-file content limit.');
    }
    aggregateCharacters += candidate.content.length;
    if (aggregateCharacters > MAX_WORKSPACE_JSON_LENGTH) {
      throw new Error('Workspace exceeds the total content limit.');
    }

    validated.push({
      name,
      content: candidate.content,
      isBlueprint: typeof candidate.isBlueprint === 'boolean'
        ? candidate.isBlueprint
        : name.endsWith('.nblueprint'),
      blueprintData: candidate.blueprintData,
      readOnly: typeof candidate.readOnly === 'boolean' ? candidate.readOnly : false,
    });
  }
  return validated;
}
