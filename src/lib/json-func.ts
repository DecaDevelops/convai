export default function ConvertToJson<T extends object>(data: T) {
  const json = JSON.stringify(data);

  return new Blob([json], { type: "application/json" });
}
