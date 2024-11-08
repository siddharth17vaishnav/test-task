import { removeCookie } from "@/utils/cookies";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { RESET_STORE } from "./root-reducer.type";
import { pushHandler } from "@/utils/genericRouting";
import { toast } from "sonner";

interface Actions {
  payload: {
    status: number;
    originalStatus: number;
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
      } else if (actionWithType.payload.originalStatus === 429) {
        toast("Rate limit exceeded");
      }
    }

    return next(action);
  };
export default rtkMiddleware;
