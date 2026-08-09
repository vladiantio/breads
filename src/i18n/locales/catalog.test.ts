import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import en from "./en.json"
import es from "./es.json"

const enMap = en as Record<string, string>
const esMap = es as Record<string, string>

describe("catalog integrity", () => {
  it("has identical key sets in en and es", () => {
    expect(Object.keys(esMap).sort()).toEqual(Object.keys(enMap).sort())
  })

  it("has a non-empty Spanish value for every key", () => {
    for (const key of Object.keys(enMap)) {
      expect(esMap[key]).toBeTruthy()
    }
  })

  it("uses {{var}} interpolation syntax with no stray single braces", () => {
    for (const value of Object.values(enMap)) {
      expect(value).not.toMatch(/(?<!\{)\{(?!\{)/)
      expect(value).not.toMatch(/(?<!\})\}(?!\})/)
    }
  })

  it("has exactly the two interpolated keys", () => {
    const interpolated = Object.keys(enMap).filter((key) =>
      enMap[key].includes("{{")
    )
    expect(interpolated.sort()).toEqual(["post.repostedBy", "post.tags.more"])
  })
})

describe("key coverage", () => {
  it("every t(\"...\") literal in src resolves to a catalog key", () => {
    const sourceFiles = import.meta.glob("../../**/*.{ts,tsx}")
    const missing: string[] = []

    for (const file of Object.keys(sourceFiles)) {
      if (file.includes(".test.")) continue
      const source = readFileSync(new URL(file, import.meta.url), "utf8")
      for (const match of source.matchAll(/\bt\(\s*["']([^"']+)["']\s*\)/g)) {
        if (!(match[1] in enMap)) missing.push(`${file}: ${match[1]}`)
      }
    }

    expect(missing).toEqual([])
  })
})
