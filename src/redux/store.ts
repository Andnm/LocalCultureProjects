import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import projectReducer from "./features/projectSlice";
import groupReducer from "./features/groupSlice";
import messageReducer from "./features/messageSlice";
import notificationReducer from "./features/notificationSlice";
import pitchingReducer from "./features/pitchingSlice";
import phaseReducer from "./features/phaseSlice";
import categoryReducer from "./features/categorySlice";
import costReducer from "./features/costSlice";
import evidenceReducer from "./features/evidenceSlice";
import summaryReportReducer from "./features/summaryReportSlice";
import userChatReducer from "./features/userChatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    cost: costReducer,
    evidence: evidenceReducer,
    group: groupReducer,
    message: messageReducer,
    notification: notificationReducer,
    phase: phaseReducer,
    pitching: pitchingReducer,
    project: projectReducer,
    summaryReport: summaryReportReducer,
    userChat: userChatReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
