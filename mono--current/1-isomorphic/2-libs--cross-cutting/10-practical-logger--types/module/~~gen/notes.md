
https://developers.cloudflare.com/workers/observability/logs/


Seen spawned by Claude:
+	step: (stage: string, detail?: unknown): void => writeLine("36", "→", stage, detail),
+	ok: (stage: string, detail?: unknown): void => writeLine("32", "✓", stage, detail),
+	fail: (stage: string, error?: unknown): void => writeLine("1;91", "✗", stage, formatError(error)),
