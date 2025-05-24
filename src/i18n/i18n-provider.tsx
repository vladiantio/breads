import { ReactNode } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider as DefaultI18nProvider } from "@lingui/react";

export function I18nProvider({ children }: { children: ReactNode }) {
  return <DefaultI18nProvider i18n={i18n}>{children}</DefaultI18nProvider>;
}
