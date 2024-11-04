declare global {
  namespace NodeJs {
    interface ProcessEnv {
      ACCESS_TOKEN: string;
      REFRESH_TOKEN: string;
      NODE_ENV: "development || production";
    }
  }
}

export {};
