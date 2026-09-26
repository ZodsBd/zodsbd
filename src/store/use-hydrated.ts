"use client";
import { useEffect, useState } from "react";

/** Avoids SSR/localStorage hydration mismatch for persisted stores. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
