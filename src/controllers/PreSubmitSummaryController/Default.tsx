import React, { useMemo } from "react";

import CardLayout from "../../layouts/Card";
import Button from "../../components/Elements/Default/Button";

import { useAppNavContext } from "../../hooks/logic/useAppNavContext";
import { useFormStore } from "../../hooks/stores/useFormStore";

const PreSubmitSummaryControllerDefault: React.FC = () => {
  const { nextPageText, goNext, goToEditAPage } = useAppNavContext();

  const { isFilled: isCreditCard, data: creditCardInfo } = useFormStore((s) => s.customerCreditCard);
  const { isFilled: isDriverLicense, data: driversLicense } = useFormStore((s) => s.driversLicense);
  const { isFilled: isRentalSignature, data: rentalSignature } = useFormStore((s) => s.rentalSignature);

  const isEmpty = useMemo(
    () => isCreditCard === false && isDriverLicense === false && isRentalSignature === false,
    [isCreditCard, isDriverLicense, isRentalSignature]
  );

  return (
    <CardLayout
      title="Information summary"
      subtitle="Please review the information you are about to submit towards your rental."
    >
      <div className="mt-4">
        {isEmpty && <div>is empty</div>}
        {isCreditCard && <div>{JSON.stringify(creditCardInfo)}</div>}
        {isDriverLicense && <div>{JSON.stringify(driversLicense)}</div>}
        {isRentalSignature && <div className="break-words">{JSON.stringify(rentalSignature)}</div>}

        {isCreditCard && <Button onClick={() => goToEditAPage("creditCard")}>credit card</Button>}
        {isDriverLicense && <Button onClick={() => goToEditAPage("driversLicense")}>credit card</Button>}
        {isRentalSignature && <Button onClick={() => goToEditAPage("rentalSignature")}>rental signature</Button>}
      </div>
      <div className="mt-6 flex">
        <div className={"flex-1"}>
          <Button color="primary" size="lg" onClick={goNext}>
            {nextPageText}
          </Button>
        </div>
      </div>
    </CardLayout>
  );
};

export default PreSubmitSummaryControllerDefault;
