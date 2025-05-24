import type { VoteRegion } from "@/lib/vars";
import { atom } from "jotai";

export const clickRegionAtom = atom<VoteRegion | null>(null);
