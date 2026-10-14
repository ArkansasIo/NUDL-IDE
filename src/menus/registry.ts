export type MenuCommandId =
  | 'file.new' | 'file.save' | 'file.importWorkspace' | 'file.exportWorkspace'
  | 'file.downloadSource' | 'file.exportTarget' | 'file.reset'
  | 'edit.format' | 'edit.clear'
  | 'build.run' | 'build.compile' | 'build.check'
  | 'view.toggleSidebar' | 'view.textEditor' | 'view.blueprint' | 'view.docs'
  | 'help.shortcuts' | 'help.about';

export interface MenuItemDefinition {
  id: MenuCommandId;
  label: string;
  description: string;
  shortcut?: string;
  enabled?: boolean;
  children?: MenuItemDefinition[];
}

export interface MenuDefinition {
  id: string;
  label: string;
  items: MenuItemDefinition[];
}

/** Declarative menu tree to audit command coverage and drive future menu renderers. */
export const MENU_REGISTRY: MenuDefinition[] = [
  { id: 'file', label: 'File', items: [
    { id: 'file.new', label: 'New File', description: 'Create a workspace file.' },
    { id: 'file.save', label: 'Save', description: 'Persist the workspace in browser storage.', shortcut: 'Ctrl/Cmd+S' },
    { id: 'file.importWorkspace', label: 'Import Workspace', description: 'Load a validated workspace JSON file.' },
    { id: 'file.exportWorkspace', label: 'Export Workspace', description: 'Download a portable workspace JSON file.' },
    { id: 'file.downloadSource', label: 'Download Source', description: 'Download the active NUDL file.' },
    { id: 'file.exportTarget', label: 'Export Target Code', description: 'Download generated target source.' },
    { id: 'file.reset', label: 'Reset Workspace', description: 'Restore the bundled starter workspace.' },
  ] },
  { id: 'edit', label: 'Edit', items: [
    { id: 'edit.format', label: 'Format Code', description: 'Trim trailing whitespace.' },
    { id: 'edit.clear', label: 'Clear Buffer', description: 'Clear the active source file.' },
  ] },
  { id: 'build', label: 'Build', items: [
    { id: 'build.run', label: 'Run Interpreter', description: 'Execute supported source in the in-browser runtime.', shortcut: 'Ctrl/Cmd+Enter' },
    { id: 'build.compile', label: 'Generate Target', description: 'Generate source for the selected target.' },
    { id: 'build.check', label: 'Check Diagnostics', description: 'Show syntax and semantic diagnostics.' },
  ] },
  { id: 'view', label: 'View', items: [
    { id: 'view.toggleSidebar', label: 'Toggle Sidebar', description: 'Show or hide workspace navigation.' },
    { id: 'view.textEditor', label: 'Text Editor', description: 'Switch to source editing.' },
    { id: 'view.blueprint', label: 'Blueprint Editor', description: 'Switch to graph editing.' },
    { id: 'view.docs', label: 'Documentation', description: 'Open language and IDE documentation.' },
  ] },
  { id: 'help', label: 'Help', items: [
    { id: 'help.shortcuts', label: 'Keyboard Shortcuts', description: 'Show available editor shortcuts.' },
    { id: 'help.about', label: 'About NUDL IDE', description: 'Show version and feature status.' },
  ] },
];

export function findMenuCommand(id: MenuCommandId): MenuItemDefinition | undefined {
  for (const menu of MENU_REGISTRY) {
    const found = menu.items.find((item) => item.id === id);
    if (found) return found;
  }
  return undefined;
}
