import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = body.code;

  if (!code || typeof code !== "string") {
    return NextResponse.json({ output: "🚫 Invalid code input." }, { status: 400 });
  }


  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, `tmp_${Date.now()}.pyowo`);
  await writeFile(filePath, code, "utf8");

  return new Promise((resolve) => {
    const proc = spawn("python", ["pythowo.py", filePath], {
      cwd: path.join(process.cwd(), "pythowo"),  
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", async () => {
      await unlink(filePath); 
      const finalOutput = stderr ? `❌ ${stderr}` : stdout || "(no output)";
      resolve(NextResponse.json({ output: finalOutput }));
    });
  });
}
