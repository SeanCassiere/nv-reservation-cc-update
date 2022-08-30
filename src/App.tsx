import React, { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRoutes from "./routes/AppRoutes";
import ErrorSubmission from "./pages/ErrorSubmission/ErrorSubmission";
import AnchorLink from "./components/Elements/Default/AnchorLink";

import { useConfigStore } from "./hooks/stores/useConfigStore";
import { isValueTrue } from "./utils/common";

const DeveloperDebugMenu = lazy(() => import("./components/DeveloperDebugMenu/DeveloperDebugMenu"));

const queryClient = new QueryClient();

const App = () => {
  const { t } = useTranslation();

  const isUsingRentall = useConfigStore((s) => s.fromRentall);
  const isDevOpenMain = useConfigStore((s) => s.isDevMenuOpen);
  const setDevOpenState = useConfigStore((s) => s.setDevMenuState);

  const handleCloseDeveloperDrawer = () => setDevOpenState(false);
  React.useEffect(() => {
    function onKeyDown(evt: KeyboardEvent) {
      if (evt.key === "k" && evt.shiftKey && (evt.metaKey || evt.ctrlKey)) {
        setDevOpenState((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setDevOpenState]);

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const dev = query.get("dev");
    const isDevOpen = Boolean(isValueTrue(dev));
    if (isDevOpen) {
      setDevOpenState(true);
    }
  }, [setDevOpenState]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="w-full max-w-xl mx-auto">
        <div className="grid grid-cols-1 pt-2">
          <div>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="flex flex-col gap-4 px-2">
                <Suspense fallback={<div>'Loading...'</div>}>
                  {isDevOpenMain && (
                    <DeveloperDebugMenu open={isDevOpenMain} handleClose={handleCloseDeveloperDrawer} />
                  )}
                </Suspense>
                <AppRoutes />
              </div>
            </ErrorBoundary>
          </div>
          <div className="pt-4 pb-5">
            <p className="text-sm text-center">
              {t("footer.poweredBy")}&nbsp;
              <AnchorLink
                href={isUsingRentall ? "https://rentallsoftware.com" : "https://navotar.com"}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-600"
              >
                {isUsingRentall ? "RENTALL" : "Navotar"}
              </AnchorLink>
            </p>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
};

const ErrorFallback = () => {
  const { t } = useTranslation();
  return <ErrorSubmission msg={t("errorBoundary.message")} />;
};

export default App;
