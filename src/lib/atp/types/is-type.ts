/**
 * Fast `$type` string check without full schema validation, for use with data
 * we trust, or for non-critical path use cases. The SDK's `is*` identity utils
 * only assert the `$type` string anyway, so this preserves the no-validation
 * hot-path behavior.
 *
 * For full validation of the object schema, use `is` from `@atcute/lexicons`.
 */
export function isType<T extends { $type?: string }>(
  record: unknown,
  $type: string,
): record is T {
  return (record as T)?.$type === $type
}
