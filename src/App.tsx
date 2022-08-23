import React from "react";
import { useSelector } from "react-redux";
import { ErrorBoundary as Boundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import AppRoutes from "./routes/AppRoutes";
import ErrorSubmission from "./shared/pages/ErrorSubmission/ErrorSubmission";
import DeveloperDebugMenu from "./shared/components/DeveloperDebugMenu/DeveloperDebugMenu";

import { selectConfigState } from "./shared/redux/store";
import { isValueTrue } from "./shared/utils/common";
import AnchorLink from "./shared/components/Elements/AnchorLink";

const ErrorBoundary = Boundary as any; // an odd error where typescript says it doesn't return a JSX element. This is a workaround

const App = () => {
  const { t } = useTranslation();
  const { fromRentall } = useSelector(selectConfigState);

  // developer menu
  const [isDeveloperDrawerOpen, setIsDeveloperDrawerOpen] = React.useState(false);
  const handleCloseDeveloperDrawer = () => setIsDeveloperDrawerOpen(false);
  React.useEffect(() => {
    function onKeyDown(evt: KeyboardEvent) {
      if (evt.key === "k" && evt.shiftKey && (evt.metaKey || evt.ctrlKey)) {
        setIsDeveloperDrawerOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const dev = query.get("dev");
    const isDevOpen = Boolean(isValueTrue(dev));
    if (isDevOpen) {
      setIsDeveloperDrawerOpen(true);
    }
  }, []);

  return (
    <main className="w-full max-w-xl mx-auto">
      <div className="grid grid-cols-1 pt-2">
        <div>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="flex flex-col gap-4 px-1">
              <DeveloperDebugMenu open={isDeveloperDrawerOpen} handleClose={handleCloseDeveloperDrawer} />
              <AppRoutes />
            </div>
          </ErrorBoundary>
        </div>
        <div className="pt-4 pb-5">
          <p className="text-sm text-center">
            {t("footer.poweredBy")}&nbsp;
            <AnchorLink
              href={fromRentall ? "https://rentallsoftware.com" : "https://navotar.com"}
              target="_blank"
              rel="noreferrer"
              className="text-sm"
            >
              {fromRentall ? "RENTALL" : "Navotar"}
            </AnchorLink>
          </p>
        </div>
      </div>
    </main>
  );
};

const ErrorFallback = () => {
  const { t } = useTranslation();
  return <ErrorSubmission msg={t("errorBoundary.message")} />;
};

export default App;
