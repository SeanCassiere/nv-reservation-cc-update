import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import { useClientProfileQuery } from "../../hooks/network/useClientProfile";
import { useRentalSummaryQuery } from "../../hooks/network/useRentalSummary";

type RowItemProps = {
  label: string;
  value: number;
  currencyAmount: number | string;
  highlight?: boolean;
  isVisible: boolean;
  isRed?: boolean;
};

type Props = {
  clientId: string | number;
  referenceId: string | number;
  referenceType: string;
};

const DefaultRentalSummary: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const rentalSummary = useRentalSummaryQuery(props);
  const clientProfile = useClientProfileQuery(props);

  const isLoading = rentalSummary.isLoading || clientProfile.isLoading;

  const currency = clientProfile.data?.currency || "USD";

  const reservationItems: RowItemProps[] = [
    {
      label: t("summaryOfCharges.reservation.baseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.baseRate || 0, currency }) || 0,
      value: rentalSummary.data?.baseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.reservation.discountOnBaseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscount || 0, currency }),
      value: rentalSummary.data?.promotionDiscount || 0,
      isVisible: rentalSummary.data?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.reservation.finalBaseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.finalBaseRate || 0, currency }),
      value: rentalSummary.data?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.reservation.totalTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.reservation.totalNonTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesNonTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.reservation.preTaxAdjustment"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preAdjustment || 0, currency }),
      value: rentalSummary.data?.preAdjustment || 0,
      isVisible: rentalSummary.data?.preAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.reservation.preSubtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preSubTotal || 0, currency }),
      value: rentalSummary.data?.preSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.reservation.discountOnSubtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscountOnSubTotal || 0, currency }),
      value: rentalSummary.data?.promotionDiscountOnSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.reservation.subtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.subTotal || 0, currency }),
      value: rentalSummary.data?.subTotal || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.reservation.totalTaxCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalTax || 0, currency }),
      value: rentalSummary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.reservation.additionalCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.additionalCharge || 0, currency }),
      value: rentalSummary.data?.additionalCharge || 0,
      isVisible: rentalSummary.data?.additionalCharge ? true : false,
    },
    {
      label: t("summaryOfCharges.reservation.estimatedTotalWithDeposit"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.estimateTotalwithDeposit || 0, currency }),
      value: rentalSummary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.reservation.grandTotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.total || 0, currency }),
      value: rentalSummary.data?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: t("summaryOfCharges.reservation.balanceDue"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.balanceDue || 0, currency }),
      value: rentalSummary.data?.balanceDue || 0,
      isVisible: true,
      isRed: rentalSummary.data?.balanceDue ? true : false,
    },
    {
      label: t("summaryOfCharges.reservation.amountPaid"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.amountPaid || 0, currency }),
      value: rentalSummary.data?.amountPaid || 0,
      isVisible: true,
      isRed: rentalSummary.data?.amountPaid ? true : false,
    },
    {
      label: t("summaryOfCharges.reservation.securityDeposit"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.securityDeposit || 0, currency }),
      value: rentalSummary.data?.securityDeposit || 0,
      isVisible: rentalSummary.data?.securityDeposit ? true : false,
    },
  ];

  const agreementItems: RowItemProps[] = [
    {
      label: t("summaryOfCharges.agreement.baseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.baseRate || 0, currency }),
      value: rentalSummary.data?.baseRate || 0,
      isVisible: rentalSummary.data?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.discountOnBaseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscount || 0, currency }),
      value: rentalSummary.data?.promotionDiscount || 0,
      isVisible: rentalSummary.data?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.finalBaseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.finalBaseRate || 0, currency }),
      value: rentalSummary.data?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.agreement.totalTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.agreement.totalNonTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesNonTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.agreement.extraMileageCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraMilesCharge || 0, currency }),
      value: rentalSummary.data?.extraMilesCharge || 0,
      isVisible: rentalSummary.data?.isExtraMileageChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.agreement.extraDurationCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraDayCharge || 0, currency }),
      value: rentalSummary.data?.extraDayCharge || 0,
      isVisible: rentalSummary.data?.isExtraDayChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.agreement.extraFuelCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraFuelCharge || 0, currency }),
      value: rentalSummary.data?.extraFuelCharge || 0,
      isVisible: rentalSummary.data?.isFuelChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.agreement.preTaxAdjustment"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preAdjustment || 0, currency }),
      value: rentalSummary.data?.preAdjustment || 0,
      isVisible: rentalSummary.data?.preAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.preSubtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preSubTotal || 0, currency }),
      value: rentalSummary.data?.preSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.discountOnSubtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscountOnSubTotal || 0, currency }),
      value: rentalSummary.data?.promotionDiscountOnSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.subtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.subTotal || 0, currency }),
      value: rentalSummary.data?.subTotal || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.agreement.totalTaxCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalTax || 0, currency }),
      value: rentalSummary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.agreement.extraMileageCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraDayCharge || 0, currency }),
      value: rentalSummary.data?.extraDayCharge || 0,
      isVisible: !rentalSummary.data?.isExtraMileageChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.agreement.extraDurationCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraDayCharge || 0, currency }),
      value: rentalSummary.data?.extraDayCharge || 0,
      isVisible: !rentalSummary.data?.isExtraDayChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.agreement.extraFuelCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraFuelCharge || 0, currency }),
      value: rentalSummary.data?.extraFuelCharge || 0,
      isVisible: !rentalSummary.data?.isFuelChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.agreement.additionalCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.additionalCharge || 0, currency }),
      value: rentalSummary.data?.additionalCharge || 0,
      isVisible: rentalSummary.data?.additionalCharge ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.postTaxAdjustment"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.postAdjustment || 0, currency }),
      value: rentalSummary.data?.postAdjustment || 0,
      isVisible: rentalSummary.data?.postAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.grandTotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.total || 0, currency }),
      value: rentalSummary.data?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: t("summaryOfCharges.agreement.amountPaid"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.amountPaid || 0, currency }),
      value: rentalSummary.data?.amountPaid || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.agreement.balanceDue"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.balanceDue || 0, currency }),
      value: rentalSummary.data?.balanceDue || 0,
      isVisible: true,
      isRed: rentalSummary.data?.balanceDue ? true : false,
    },
    {
      label: t("summaryOfCharges.agreement.securityDeposit"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.securityDeposit || 0, currency }),
      value: rentalSummary.data?.securityDeposit || 0,
      isVisible: rentalSummary.data?.securityDeposit ? true : false,
    },
  ];

  return (
    <ul className="py-3 bg-gray-50 rounded">
      {[...(props.referenceType.trim().toLowerCase() === "agreement" ? agreementItems : reservationItems)]
        .filter((i) => i.isVisible)
        .map((rowItem) => (
          <RowItem {...rowItem} isLoading={isLoading} key={`summary-${rowItem.label}`} />
        ))}
    </ul>
  );
};

const RowItem: React.FC<RowItemProps & { isLoading?: boolean }> = ({ isLoading, ...props }) => {
  const listItemClassNames = cn(
    "px-4",
    "py-2",
    "font-medium",
    {
      "text-gray-700": props.value && !props.highlight && !props.isRed,
      "text-gray-500": !props.value && !props.isRed && !props.highlight,
    },
    {
      "bg-indigo-400": props.highlight,
      "text-white": props.highlight,
      "font-semibold": props.highlight,
    },
    {
      "text-red-500": props.isRed,
    }
  );

  const labelClassNames = cn("flex-1", "pr-2", "md:text-sm");
  const pricingClassNames = cn("flex-1", "text-right", "md:text-md", {
    "md:text-md": props.value || props.highlight,
    "md:text-sm": !props.value,
  });
  return (
    <li className={listItemClassNames}>
      <div className="flex items-center">
        <div className={labelClassNames}>{isLoading ? <SkeletonBlock highlight={props.highlight} /> : props.label}</div>
        <div className={pricingClassNames}>
          {isLoading ? <SkeletonBlock minWidth highlight={props.highlight} /> : props.currencyAmount}
        </div>
      </div>
    </li>
  );
};

const SkeletonBlock: React.FC<{ highlight?: boolean; minWidth?: boolean }> = ({ minWidth, highlight }) => {
  const classNames = cn(
    "inline-block",
    "w-full",
    "animate-pulse",
    { "bg-gray-200": !highlight, "bg-indigo-300": highlight },
    { "w-10": minWidth }
  );
  return <span className={classNames}>&nbsp;</span>;
};

export default DefaultRentalSummary;
