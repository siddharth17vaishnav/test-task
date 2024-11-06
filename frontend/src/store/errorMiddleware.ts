import { removeCookie } from "@/utils/cookies";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { RESET_STORE } from "./root-reducer.type";
import { pushHandler } from "@/utils/genericRouting";

interface Actions {
  payload: {
    status: number;
  };
}

const rtkMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const actionWithType = action as unknown as Actions;
      if (actionWithType.payload.status === 401) {
        removeCookie("accessToken");
        api.dispatch({ type: RESET_STORE });
        pushHandler("auth/login");
      }
    }

    return next(action);
  };
export default rtkMiddleware;
