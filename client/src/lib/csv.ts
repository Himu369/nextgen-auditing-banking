// client/src/lib/csv.ts

export function convertToCSV(data: any[]): string {
  if (!data.length) return "";

  const headers = Object.keys(data[0]);
  const csvRows = data.map((row) =>
    headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
}
