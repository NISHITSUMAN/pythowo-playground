"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput(""); // clear old output

    console.log("🟡 Sending code to Render API:", code);

    try {
      const res = await fetch("https://pythowo-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      console.log("🔵 Got response:", res);

      if (!res.ok) {
        const errText = await res.text();
        console.error("🔴 API Error response:", errText);
        setOutput(`❌ API Error: ${res.status} – ${errText}`);
      } else {
        const data = await res.json();
        console.log("🟢 Parsed response:", data);
        setOutput(data.output || "(no output)");
      }
    } catch (err) {
      console.error("❌ PythOwO crashed:", err);
      setOutput("❌ Wuntime ewwow!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-screen bg-background text-foreground">
      {/* CODE INPUT */}
      <Card className="shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">📜 Write PythOwO Code</h2>
          <Textarea
            className="text-sm font-mono min-h-[300px] rounded-xl"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='pwint("hewwo fwom PythOwO~")'
          />
          <Button onClick={runCode} disabled={loading}>
            <PlayIcon className="w-4 h-4 mr-2" />
            {loading ? "Wunning..." : "Wun Code UwU"}
          </Button>
        </CardContent>
      </Card>

      {/* OUTPUT */}
      <Card className="shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">📤 Output</h2>
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-mono whitespace-pre-wrap bg-muted p-4 rounded-xl min-h-[300px]"
          >
            {output || "Your owoified wesuwts appeaw hewe~"}
          </motion.pre>
        </CardContent>
      </Card>

      {/* COMMAND LIST + FOOTER */}
      <section className="col-span-2 mt-12 text-sm text-muted-foreground font-mono w-full max-w-4xl space-y-4">
        <h2 className="text-xl font-bold">📘 PythOwO Commands</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <li><b>pwease x = 5</b> – Declare variable</li>
          <li><b>IF cond THWEN ... END</b> – If statement</li>
          <li><b>FWUNCTION f(x):</b> – Function def</li>
          <li><b>pwint(msg)</b> – Print message</li>
          <li><b>inpwt(), inpwt_int()</b> – Input</li>
          <li><b>appwend, pwp, lwen</b> – List ops</li>
          <li><b>AND, OR, NOT</b> – Logic ops</li>
          <li><b>+ - * / ^</b> – Math ops</li>
          <li><b>twue, fawse, nwull</b> – Constants</li>
        </ul>
        <p className="pt-4 text-xs text-muted-foreground">
          Full source on{" "}
          <a
            href="https://github.com/NISHITSUMAN/PythOwO"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub →
          </a>
        </p>
      </section>
    </main>
  );
}
