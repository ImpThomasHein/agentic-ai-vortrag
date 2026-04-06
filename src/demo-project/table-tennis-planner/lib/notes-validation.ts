/**
 * Validation logic for trainer note form data.
 * Validates name and description fields and returns a list of error messages.
 * An empty array means the data is valid.
 */

const NAME_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 2000;

/**
 * Validates note input data.
 * @param data - Object with name and description fields (may be undefined/null).
 * @returns Array of error message strings. Empty array means input is valid.
 */
export function validateNoteInput(data: { name?: unknown; description?: unknown }): string[] {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name ist erforderlich.');
  } else if (data.name.length > NAME_MAX_LENGTH) {
    errors.push(`Name darf maximal ${NAME_MAX_LENGTH} Zeichen lang sein.`);
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
    errors.push('Beschreibung ist erforderlich.');
  } else if (data.description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push(`Beschreibung darf maximal ${DESCRIPTION_MAX_LENGTH} Zeichen lang sein.`);
  }

  return errors;
}
