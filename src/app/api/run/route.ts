export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";


export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = body.code;
  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { output: "🚫 Invalid code input." },
      { status: 400 }
    );
  }

  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, `tmp_${Date.now()}.pyowo`);
  await writeFile(filePath, code, "utf8");

  // Execute interpreter
  const proc = spawn(
    "python",
    ["pythowo.py", filePath],
    {
      cwd: path.join(process.cwd(), "pythowo"), // Adjust if needed
    }
  );

  let stdout = "";
  let stderr = "";

  for await (const chunk of proc.stdout) {
    stdout += chunk.toString();
  }
  for await (const chunk of proc.stderr) {
    stderr += chunk.toString();
  }

  const exitCode: number = await new Promise((r) =>
    proc.on("close", (code) => r(code ?? 0))
  );

  await unlink(filePath);

  const responsePayload = {
    output: stderr ? `❌ ${stderr}` : stdout || "(no output)",
    code: exitCode
  };

  return NextResponse.json(responsePayload);
}
