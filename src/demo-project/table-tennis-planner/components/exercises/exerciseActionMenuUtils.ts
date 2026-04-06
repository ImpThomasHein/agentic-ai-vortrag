/** Build the header label for the exercise action menu, optionally including group name */
export function buildMenuHeaderLabel(groupName?: string): string {
  if (groupName) {
    return `Zum Training hinzufügen (${groupName})`;
  }
  return 'Zum Training hinzufügen';
}
