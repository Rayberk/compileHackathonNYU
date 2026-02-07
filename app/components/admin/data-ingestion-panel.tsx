"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Database, AlertCircle, CheckCircle2 } from "lucide-react";

export function DataIngestionPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleIngest = async (source: string) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, data_type: "stops" }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message || "Ingested successfully" });
      } else {
        setResult({ success: false, message: data.error || "Ingestion failed" });
      }
    } catch (error) {
      console.error("Ingestion error:", error);
      setResult({ success: false, message: "Network error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center">
          <Database className="w-5 h-5 text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          <span>Data Ingestion</span>
        </h3>
      </div>

      <p className="text-sm text-white/60">
        <span>Simulate ingestion from Dubai Pulse and Abu Dhabi ITC open data sources.</span>
      </p>

      <div className="flex gap-3">
        <Button
          onClick={() => handleIngest("dubai-pulse")}
          disabled={loading}
          className="flex-1 bg-gradient-to-br from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white border-0"
        >
          <span>Ingest Dubai Pulse Data</span>
        </Button>

        <Button
          onClick={() => handleIngest("abu-dhabi-itc")}
          disabled={loading}
          className="flex-1 bg-gradient-to-br from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0"
        >
          <span>Ingest Abu Dhabi ITC Data</span>
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-white/60"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/20 border-t-teal-400 rounded-full"
          />
          <span>Processing ingestion...</span>
        </motion.div>
      )}

      {/* Result Message */}
      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            result.success
              ? "bg-teal-500/10 border-teal-500/30"
              : "bg-red-500/10 border-red-500/30"
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${result.success ? "text-teal-400" : "text-red-400"}`}>
              <span>{result.success ? "Success" : "Error"}</span>
            </p>
            <p className="text-sm text-white/70 mt-1">
              <span>{result.message}</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
