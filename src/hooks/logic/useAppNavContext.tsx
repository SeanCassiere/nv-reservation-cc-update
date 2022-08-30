import { FC, ReactNode, createContext, useContext, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type AppNavContextType = {
  mode: "navigate" | "save";
  goNext: () => void;
  goPrev: () => void;
  activeController: string | null;
  isPreviousAvailable: boolean;
  isNextAvailable: boolean;
  goToEditAPage: ({ target }: { target: string }) => void;
  nextPageText: ReactNode;
  prevPageText: ReactNode;
};

const AppNavContext = createContext<AppNavContextType>({
  mode: "navigate",
  goNext: () => {},
  goPrev: () => {},
  goToEditAPage: () => {},
  activeController: null,
  isPreviousAvailable: false,
  isNextAvailable: false,
  nextPageText: "",
  prevPageText: "",
});

export const AppNavContextProvider: FC<{ children: ReactNode; configFlow: string[] }> = ({ children, configFlow }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentNavMode, setCurrentNavMode] = useState<AppNavContextType["mode"]>("navigate");

  const [selectedController, setSelectedController] = useState<AppNavContextType["activeController"]>(
    configFlow.length >= 0 ? configFlow[0] : null
  );

  const goNext = useCallback(() => {
    if (currentNavMode === "save") {
      setCurrentNavMode("navigate");
      return;
    }

    if (!selectedController) return;

    const currentControllerIdx = [...configFlow].findIndex((i) => i === selectedController);

    if (currentControllerIdx === configFlow.length - 1) {
      return navigate("/submit-details", { replace: true });
    }

    if (currentControllerIdx <= -1) return;

    // at this stage the index is valid
    const nextScreen = configFlow[currentControllerIdx + 1];
    setSelectedController(nextScreen);
  }, [currentNavMode, navigate, selectedController, configFlow]);

  const goPrev = useCallback(() => {
    if (currentNavMode === "save") {
      setCurrentNavMode("navigate");
      return;
    }

    if (!selectedController) return;

    const currentControllerIdx = [...configFlow].findIndex((i) => i === selectedController);
    if (currentControllerIdx === 0) return;
    if (currentControllerIdx <= -1) return;

    const previousScreen = configFlow[currentControllerIdx - 1];
    setSelectedController(previousScreen);
  }, [currentNavMode, selectedController, configFlow]);

  const isPreviousControllerAvailable = useMemo(() => {
    if (!selectedController) return false;
    const currentControllerIdx = [...configFlow].findIndex((i) => i === selectedController);
    return currentControllerIdx > 0;
  }, [selectedController, configFlow]);

  const isNextControllerAvailable = useMemo(() => {
    if (!selectedController) return false;
    const currentControllerIdx = [...configFlow].findIndex((i) => i === selectedController);
    return currentControllerIdx < configFlow.length - 1;
  }, [selectedController, configFlow]);

  /**
   * @todo - this is a dummy function in place of one to actually support editing a page
   */
  const goToEditAPage: AppNavContextType["goToEditAPage"] = useCallback(({ target }) => {
    setCurrentNavMode("save");
  }, []);

  const nextPageText = useMemo(
    () =>
      t("forms.navSubmit", { context: currentNavMode === "save" ? "save" : isNextControllerAvailable ? "next" : "" }),
    [currentNavMode, isNextControllerAvailable, t]
  );

  return (
    <AppNavContext.Provider
      value={{
        mode: currentNavMode,
        goNext,
        goPrev,
        goToEditAPage,
        activeController: selectedController,
        isPreviousAvailable: isPreviousControllerAvailable,
        isNextAvailable: isNextControllerAvailable,
        nextPageText,
        prevPageText: <>&#8592;</>,
      }}
    >
      {children}
    </AppNavContext.Provider>
  );
};

export const useAppNavContext = () => useContext(AppNavContext);
