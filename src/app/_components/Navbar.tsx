"use client";

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { checkVoted } from "@/lib/actions";
import { Loader2 } from "lucide-react";

export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  // null = 확인중, true/false = 결과
  const [voted, setVoted] = useState<boolean | null>(null);

  /* 투표 여부 조회 */
  useEffect(() => {
    let ignore = false;

    const check = async () => {
      if (!session?.user) return setVoted(null);

      try {
        const result = await checkVoted(session.user.id);
        if (!ignore) setVoted(Boolean(result));
      } catch (e) {
        console.error("checkVoted 실패:", e);
        if (!ignore) setVoted(null);
      }
    }

    check();

    return () => {
      ignore = true;
    };
  }, [session]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Logo width={24} height={24} />
          <span className="hidden md:text-sm">온라인 여론조사</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* 통계 페이지로 바로가기 */}
          {pathname !== "/results" && (
            <Link href="/results">
              <Button size="sm" variant="secondary">
                바로&nbsp;통계보기
              </Button>
            </Link>
          )}

          {/* 로그인 안되어있으면 안내하기 */}
          {!session && (
            <Link href="/">
              <Button size="sm" className="font-bold">
                로그인 후 투표하기
              </Button>
            </Link>
          )}

          {/* 투표 버튼 – 로그인 + / 이외 페이지에서만 표시 */}
          {session && pathname !== "/" && (
            voted === null ? (
              <Button size="sm" variant="outline" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                확인중…
              </Button>
            ) : voted ? (
              <Link href="/?mode=update">
                <Button size="sm" variant="secondary" disabled>
                  투표 바꾸기
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button size="sm">투표하기</Button>
              </Link>
            )
          )}

          {/* 로그아웃 */}
          {session && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              로그아웃
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
