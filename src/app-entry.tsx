import React, { lazy, Suspense, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import AnchorLink from "@/components/anchor-link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useConfigStore } from "./hooks/stores/useConfigStore";
import ErrorSubmission from "./pages/error-submission";
import AppRoutes from "./routes/app-routes";
import { isValueTrue } from "./utils/common";
import { PACKAGE_VERSION } from "./utils/constants";

const DeveloperDebugMenu = lazy(() => import("./components/developer-debug-menu"));

const queryClient = new QueryClient();

const App = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();

  const searchParams = new URLSearchParams(window.location.search);
  const devSearchParam = searchParams.get("dev");
  const isDevQueryOpen = Boolean(isValueTrue(devSearchParam));

  const [openDevMenuLocal, setOpenDevMenuLocal] = React.useState(false);
  const setDevOpenState = useConfigStore((s) => s.setDevMenuState);

  const shouldDevMenuBeLoaded = useRef<boolean>(false); // ref to code-split the dev menu

  const handleCloseDeveloperDrawer = () => setOpenDevMenuLocal(false);
  React.useEffect(() => {
    function onKeyDown(evt: KeyboardEvent) {
      if (evt.key === "k" && evt.shiftKey && (evt.metaKey || evt.ctrlKey)) {
        if (shouldDevMenuBeLoaded.current === false) {
          shouldDevMenuBeLoaded.current = true;
        }

        setOpenDevMenuLocal((prev) => !prev); // local state
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setDevOpenState]);

  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const dq = q.get("dev");
    const isDevOpen = Boolean(isValueTrue(dq));

    if (isDevOpen) {
      if (shouldDevMenuBeLoaded.current === false) {
        shouldDevMenuBeLoaded.current = true;
      }
      setOpenDevMenuLocal(true); // local state
      setDevOpenState(true); // set to the config store for use in the dev menu
    }
  }, [setDevOpenState]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="mx-auto w-full max-w-xl">
        <div className="grid grid-cols-1 pt-2">
          <div>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="flex flex-col gap-4 px-2">
                <Suspense
                  fallback={
                    <div className="px-0.5 py-2">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  }
                >
                  {shouldDevMenuBeLoaded.current && (
                    <DeveloperDebugMenu open={openDevMenuLocal} handleClose={handleCloseDeveloperDrawer} />
                  )}
                </Suspense>
                <AppRoutes />
              </div>
            </ErrorBoundary>
          </div>
          <div className="flex flex-col justify-center pb-5 pt-4">
            <p className="text-center text-sm">
              {t("footer.poweredBy")}&nbsp;
              <AnchorLink
                href="https://rentallsoftware.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-primary underline"
              >
                RENTALL
              </AnchorLink>
            </p>
            <p className="text-center text-sm text-foreground/80">
              {t("footer.version")}&nbsp;{PACKAGE_VERSION}
            </p>
            {isDevQueryOpen && (
              <Button
                size="sm"
                variant="link"
                onClick={() => {
                  setOpenDevMenuLocal(true);
                }}
              >
                {t("developer.open")}
              </Button>
            )}
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
