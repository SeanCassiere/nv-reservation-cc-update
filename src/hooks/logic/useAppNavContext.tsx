import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { APP_CONSTANTS } from "@/utils/constants";

type PageTypeOptions = "creditCard" | "driversLicense" | "rentalSignature";
const pagesTyped: { page: string; type: PageTypeOptions }[] = [
  { page: APP_CONSTANTS.FLOW_CREDIT_CARD_FORM, type: "creditCard" },
  { page: APP_CONSTANTS.FLOW_DEFAULT_LICENSE_UPLOAD_FORM, type: "driversLicense" },
  { page: APP_CONSTANTS.FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM, type: "creditCard" },
  { page: APP_CONSTANTS.FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM, type: "driversLicense" },
  { page: APP_CONSTANTS.FLOW_RENTAL_SIGNATURE_FORM, type: "rentalSignature" },
];

/**
 * "navigate" - Refers to the default navigation flow.
 *
 * In this state, the user can navigate between the screens using the next and previous buttons.
 *
 * "save" - Refers to the state where the user is editing a page.
 *
 * In this state, the pressing of the next button will take the user to the last page of the flow.
 */
export type AppNavMode = "navigate" | "save";

type AppNavContextType = {
  mode: AppNavMode;
  goNext: () => void;
  goPrev: () => void;
  activeController: string | null;
  isPreviousAvailable: boolean;
  isNextAvailable: boolean;
  goToEditAPage: (target: PageTypeOptions) => void;
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

export const AppNavContextProvider: FC<{
  children: ReactNode;
  configFlow: string[];
}> = ({ children, configFlow }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentNavMode, setCurrentNavMode] = useState<AppNavContextType["mode"]>("navigate");

  const [selectedController, setSelectedController] = useState<AppNavContextType["activeController"]>(
    configFlow.length >= 0 ? configFlow[0] : null,
  );

  const goNext = useCallback(() => {
    if (currentNavMode === "save") {
      setSelectedController(configFlow[configFlow.length - 1]);
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
  }, [currentNavMode, selectedController, configFlow, navigate]);

  const goPrev = useCallback(() => {
    if (currentNavMode === "save") {
      setSelectedController(configFlow[configFlow.length - 1]);
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
    if (currentNavMode === "save") return true;

    if (!selectedController) return false;
    const currentControllerIdx = [...configFlow].findIndex((i) => i === selectedController);
    return currentControllerIdx > 0;
  }, [currentNavMode, selectedController, configFlow]);

  const isNextControllerAvailable = useMemo(() => {
    if (!selectedController) return false;
    const currentControllerIdx = [...configFlow].findIndex((i) => i === selectedController);
    return currentControllerIdx < configFlow.length - 1;
  }, [selectedController, configFlow]);

  const goToEditAPage: AppNavContextType["goToEditAPage"] = useCallback(
    (target) => {
      setCurrentNavMode("save");
      const pageWithTargetType = pagesTyped.filter((i) => i.type === target);

      for (const flowScreen of configFlow) {
        const find = pageWithTargetType.find((i) => i.page === flowScreen);
        if (find) {
          setSelectedController(find.page);
          break;
        }
      }
    },
    [configFlow],
  );

  const nextPageText = useMemo(
    () =>
      t("forms.navSubmit", { context: currentNavMode === "save" ? "save" : isNextControllerAvailable ? "next" : "" }),
    [currentNavMode, isNextControllerAvailable, t],
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
