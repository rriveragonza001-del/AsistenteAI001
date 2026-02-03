export async function analyzeDocuments(files: any[], history: any[] = []) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files, history })
  });

  if (!response.ok) {
    throw new Error("Error al analizar documentos");
  }

  return await response.json();
}
