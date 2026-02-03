export async function analyzeDocuments(files: any[], history: any[]) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files, history })
  });

  if (!res.ok) throw new Error("Error en análisis");

  return await res.json();
}
