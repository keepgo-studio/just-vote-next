"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      await signIn("kakao", { callbackUrl });
    } catch (err) {
      console.error("로그인 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex flex-col items-center justify-center">
          <p>제21대 대통령 선거</p>
          <p>온라인 여론조사</p>
          <div className="h-4" />
          <Logo width={60} height={60} />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 flex items-center flex-col">
        {error && (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {decodeURIComponent(error)}
          </p>
        )}

        <CardDescription>
          카카오톡 로그인해야 참여를 하실 수 있습니다.
        </CardDescription>

        <Button
          onClick={handleKakaoLogin}
          disabled={loading}
          variant="ghost"
          className="relative w-full h-14 bg-kakao hover:brightness-95 hover:bg-kakao active:scale-[98%]"
        >
          {loading ? (
            <div className="h-[45px] flex items-center justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <Image
              src="/assets/kakao_login_medium_narrow.png"
              alt="카카오로 로그인"
              width={183}
              height={45}
              priority
            />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
