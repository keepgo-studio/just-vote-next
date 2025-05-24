declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXTAUTH_URL: string;
    readonly NEXTAUTH_SECRET: string;
    readonly KAKAO_CLIENT_ID: string;
    readonly KAKAO_CLIENT_SECRET: string;
    
    readonly POSTGRES_URL: string;
  }
}