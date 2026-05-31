/**
 * Utility class for converting between objects and FormData
 */
export class FormDataConverter {
  /**
   * Converts an object to FormData
   * Handles nested objects, arrays, Files, and null/undefined values
   */
  static toFormData(
    obj: Record<string, unknown>,
    formData: FormData = new FormData(),
    parentKey: string = "",
  ): FormData {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value === null || value === undefined) {
        // Skip null/undefined values
        continue;
      } else if (value instanceof File) {
        // Handle File objects
        formData.append(formKey, value);
      } else if (value instanceof Blob) {
        // Handle Blob objects
        formData.append(formKey, value);
      } else if (Array.isArray(value)) {
        // Handle arrays
        if (value.length === 0) {
          // Append empty array marker
          formData.append(formKey, "[]");
        } else {
          value.forEach((item, index) => {
            if (item instanceof File || item instanceof Blob) {
              formData.append(formKey, item);
            } else if (typeof item === "object" && item !== null) {
              this.toFormData({ [index]: item }, formData, formKey);
            } else {
              formData.append(formKey, String(item));
            }
          });
        }
      } else if (typeof value === "object") {
        // Handle nested objects
        this.toFormData(value as Record<string, unknown>, formData, formKey);
      } else if (typeof value === "boolean") {
        // Convert boolean to string
        formData.append(formKey, value ? "true" : "false");
      } else {
        // Handle primitive values
        formData.append(formKey, String(value));
      }
    }

    return formData;
  }

  /**
   * Converts FormData to a plain object
   * Handles arrays and reconstructs nested objects
   */
  static fromFormData(formData: FormData): Record<string, unknown> {
    const obj: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      // Handle array notation: key[index] or just key for multiple values
      const arrayMatch = key.match(/^(.+?)\[(\d+)\]$/);

      if (arrayMatch) {
        const [, baseKey, index] = arrayMatch;
        if (!obj[baseKey]) {
          obj[baseKey] = [];
        }
        (obj[baseKey] as unknown[])[parseInt(index)] = this.parseValue(value);
      } else if (key.includes("[")) {
        // Handle nested object notation: key[subkey]
        this.setNestedValue(obj, key, value);
      } else {
        // Handle regular keys and collect multiple values with same key
        const existing = obj[key];
        if (existing !== undefined) {
          // Multiple values with same key - make it an array
          if (Array.isArray(existing)) {
            existing.push(this.parseValue(value));
          } else {
            obj[key] = [existing, this.parseValue(value)];
          }
        } else {
          obj[key] = this.parseValue(value);
        }
      }
    });

    // Clean up empty array markers
    for (const key in obj) {
      if (obj[key] === "[]") {
        obj[key] = [];
      }
    }

    return obj;
  }

  /**
   * Parse a FormData value to its appropriate type
   */
  private static parseValue(
    value: FormDataEntryValue,
  ): string | number | boolean | File | Blob {
    if (value instanceof Blob) {
      return value;
    }

    const stringValue = value as string;

    // Try to parse as boolean
    if (stringValue === "true") return true;
    if (stringValue === "false") return false;

    // Try to parse as number
    if (!isNaN(Number(stringValue)) && stringValue !== "") {
      return Number(stringValue);
    }

    // Return as string
    return stringValue;
  }

  /**
   * Set a nested value in an object using bracket notation
   */
  private static setNestedValue(
    obj: Record<string, unknown>,
    key: string,
    value: FormDataEntryValue,
  ): void {
    const keys = key.split(/\[|\]/).filter((k) => k !== "");
    let current: Record<string, unknown> = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        // Check if next key is numeric to determine if we need an array or object
        const nextKey = keys[i + 1];
        current[k] = /^\d+$/.test(nextKey) ? [] : {};
      }
      current = current[k] as Record<string, unknown>;
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = this.parseValue(value);
  }

  /**
   * Helper method to get all files from FormData with a specific key
   */
  static getFiles(formData: FormData, key: string): File[] {
    const files: File[] = [];
    formData.forEach((value, formKey) => {
      if (formKey === key && value instanceof File) {
        files.push(value);
      }
    });
    return files;
  }

  /**
   * Helper method to get all values for a specific key
   */
  static getAll(formData: FormData, key: string): FormDataEntryValue[] {
    return formData.getAll(key);
  }
}
