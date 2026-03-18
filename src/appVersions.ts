import type { ComponentType } from "react";
import AppV1 from "./versions/AppV1/AppV1";
import AppV2 from "./versions/AppV2/AppV2";

export const APP_VERSION_LIST = ["v1", "v2"] as const;
export type AppVersion = (typeof APP_VERSION_LIST)[number];

export const DEFAULT_APP_VERSION: AppVersion = "v1";

export const APP_VERSIONS: Record<AppVersion, ComponentType> = {
  v1: AppV1,
  v2: AppV2,
};

export const isAppVersion = (value: string): value is AppVersion => {
  return APP_VERSION_LIST.includes(value as AppVersion);
};