import fs from 'node:fs';
import path from 'node:path';

export async function GET(request: Request) {
  console.log(request);
  const apiDirectory = path.join(process.cwd(), 'public', 'Bjornulf_API');
  let jsonFiles: string[] = [];

  // Check if directory exists before proceeding
  if (fs.existsSync(apiDirectory)) {
    const stats = await fs.promises.stat(apiDirectory);
    if (stats.isDirectory()) {
      const files = await fs.promises.readdir(apiDirectory);
      jsonFiles = files.filter((file) => file.endsWith('.json'));
    }
  }

  return Response.json({ jsonFiles });
}
