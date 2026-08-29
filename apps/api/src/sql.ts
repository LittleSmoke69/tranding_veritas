export function sqlText(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

export function sqlTextArray(values: string[]): string {
  return `ARRAY[${values.map(sqlText).join(',')}]::text[]`;
}
