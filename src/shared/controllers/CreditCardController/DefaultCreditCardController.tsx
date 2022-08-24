import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

import { selectCreditCardForm } from "../../redux/store";
import { setCreditCardFormData } from "../../redux/slices/forms/slice";
import { YupErrorsFormatted, yupFormatSchemaErrors } from "../../utils/yupSchemaErrors";
import { creditCardTypeFormat } from "../../utils/creditCardTypeFormat";
import useCreditCardSchema from "../../hooks/useCreditCardSchema";

import DefaultCreditCard from "../../components/DynamicCreditCard/DefaultCreditCard";
import DefaultCardDetailsForm from "../../components/DefaultCardDetailsForm/DefaultCardDetailsForm";
import Button from "../../components/Elements/Button";
import CardLayout from "../../layouts/Card";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultCreditCardController = ({
  handleSubmit,
  isNextAvailable,
  handlePrevious,
  isPrevPageAvailable,
}: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: initialFormData } = useSelector(selectCreditCardForm);

  const [formValues, setFormValues] = useState(initialFormData);
  const [schemaErrors, setSchemaErrors] = useState<YupErrorsFormatted>([]);
  const [cardMaxLength, setCardMaxLength] = useState(16);

  const [currentFocus, setCurrentFocus] = useState<string>("");

  const { schema } = useCreditCardSchema();

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });
      dispatch(setCreditCardFormData(formValues));
      handleSubmit();
    } catch (error: any) {
      const err = error as yup.ValidationError;
      const formErrors = yupFormatSchemaErrors(err);
      setSchemaErrors(formErrors);
    }
  }, [dispatch, formValues, handleSubmit, schema]);

  // Form element handlers
  const handleCardIdentifier = useCallback(
    (type: string, maxLength: number) => {
      const formattedType = creditCardTypeFormat(type);
      setFormValues({
        ...formValues,
        type: formattedType,
      });
      setCardMaxLength(maxLength);
    },
    [formValues]
  );
  const handleCardFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
      });
    },
    [formValues]
  );
  const handleCardFormFocus = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.name === "monthExpiry" || e.target.name === "yearExpiry") {
        setCurrentFocus("expiry");
      } else if (e.target.name === "cvv") {
        setCurrentFocus("cvc");
      } else {
        setCurrentFocus(e.target.name);
      }
    },
    []
  );
  const handleCardFormBlur = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentFocus("");
      try {
        const pickedSchema = schema.pick([e.target.name]);
        await pickedSchema.validate({ [e.target.name]: e.target.value }, { abortEarly: false });
        setSchemaErrors((prev) => prev.filter((item) => item.path !== e.target.name));
      } catch (error) {
        const err = error as yup.ValidationError;
        const formErrors = yupFormatSchemaErrors(err);
        setSchemaErrors((prev) => {
          const cloneList = prev.filter((item) => item.path !== e.target.name);
          return [...cloneList, ...formErrors];
        });
      }
    },
    [schema]
  );

  return (
    <CardLayout title={t("forms.creditCard.title")} subtitle={t("forms.creditCard.message")}>
      <div className="mt-4 grid grid-cols-1">
        <div className="my-4 md:my-2">
          <DefaultCreditCard
            currentFocus={currentFocus}
            formData={formValues}
            handleCardIdentifier={handleCardIdentifier}
          />
        </div>
        <div className="mt-4">
          <DefaultCardDetailsForm
            formData={formValues}
            cardMaxLength={cardMaxLength}
            handleChange={handleCardFormChange}
            handleBlur={handleCardFormBlur}
            handleFocus={handleCardFormFocus}
            schemaErrors={schemaErrors}
          />
        </div>
        <div className="mt-6 flex">
          {isPrevPageAvailable && (
            <div>
              <Button color="primary" variant="muted" size="lg" onClick={handlePrevious}>
                &#8592;
              </Button>
            </div>
          )}
          <div className={isPrevPageAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button color="primary" size="lg" onClick={handleNextState}>
              {isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
            </Button>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default DefaultCreditCardController;
