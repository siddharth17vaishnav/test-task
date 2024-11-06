import Router from "next/router";

export const pushHandler = async (data: string) => {
  await Router.push(`/${data}`);
};

export const replaceHandler = async (data: string) => {
  await Router.replace(`/${data}`);
};
