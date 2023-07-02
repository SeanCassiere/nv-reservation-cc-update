import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { useClientProfileQuery } from "../../hooks/network/useClientProfile";
import { useRentalSummaryQuery } from "../../hooks/network/useRentalSummary";

type RowItemProps = {
  label: string;
  value: number;
  currencyAmount: any;
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
      label: t("summaryOfCharges.baseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.baseRate || 0, currency }) || 0,
      value: rentalSummary.data?.baseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.discountOnBaseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscount || 0, currency }),
      value: rentalSummary.data?.promotionDiscount || 0,
      isVisible: rentalSummary.data?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.finalBaseRate"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.finalBaseRate || 0, currency }),
      value: rentalSummary.data?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalNonTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesNonTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.preTaxAdjustment"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preAdjustment || 0, currency }),
      value: rentalSummary.data?.preAdjustment || 0,
      isVisible: rentalSummary.data?.preAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.preSubtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preSubTotal || 0, currency }),
      value: rentalSummary.data?.preSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.discountOnSubtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscountOnSubTotal || 0, currency }),
      value: rentalSummary.data?.promotionDiscountOnSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.subtotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.subTotal || 0, currency }),
      value: rentalSummary.data?.subTotal || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalTax || 0, currency }),
      value: rentalSummary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.additionalCharges"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.additionalCharge || 0, currency }),
      value: rentalSummary.data?.additionalCharge || 0,
      isVisible: rentalSummary.data?.additionalCharge ? true : false,
    },
    {
      label: t("summaryOfCharges.estimatedTotalWithDeposit"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.estimateTotalwithDeposit || 0, currency }),
      value: rentalSummary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.grandTotal"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.total || 0, currency }),
      value: rentalSummary.data?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: t("summaryOfCharges.balanceDue"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.balanceDue || 0, currency }),
      value: rentalSummary.data?.balanceDue || 0,
      isVisible: true,
      isRed: rentalSummary.data?.balanceDue ? true : false,
    },
    {
      label: t("summaryOfCharges.amountPaid"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.amountPaid || 0, currency }),
      value: rentalSummary.data?.amountPaid || 0,
      isVisible: true,
      isRed: rentalSummary.data?.amountPaid ? true : false,
    },
    {
      label: t("summaryOfCharges.securityDeposit"),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.securityDeposit || 0, currency }),
      value: rentalSummary.data?.securityDeposit || 0,
      isVisible: rentalSummary.data?.securityDeposit ? true : false,
    },
  ];

  const agreementItems: RowItemProps[] = [
    {
      label: t("summaryOfCharges.baseRate", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.baseRate || 0, currency }),
      value: rentalSummary.data?.baseRate || 0,
      isVisible: rentalSummary.data?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.discountOnBaseRate", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscount || 0, currency }),
      value: rentalSummary.data?.promotionDiscount || 0,
      isVisible: rentalSummary.data?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.finalBaseRate", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.finalBaseRate || 0, currency }),
      value: rentalSummary.data?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxMischarges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalNonTaxMischarges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalMiscChargesNonTaxable || 0, currency }),
      value: rentalSummary.data?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.extraMileageCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraMilesCharge || 0, currency }),
      value: rentalSummary.data?.extraMilesCharge || 0,
      isVisible: rentalSummary.data?.isExtraMileageChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraDurationCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraDayCharge || 0, currency }),
      value: rentalSummary.data?.extraDayCharge || 0,
      isVisible: rentalSummary.data?.isExtraDayChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraFuelCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraFuelCharge || 0, currency }),
      value: rentalSummary.data?.extraFuelCharge || 0,
      isVisible: rentalSummary.data?.isFuelChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.preTaxAdjustment", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preAdjustment || 0, currency }),
      value: rentalSummary.data?.preAdjustment || 0,
      isVisible: rentalSummary.data?.preAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.preSubtotal", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.preSubTotal || 0, currency }),
      value: rentalSummary.data?.preSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.discountOnSubtotal", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.promotionDiscountOnSubTotal || 0, currency }),
      value: rentalSummary.data?.promotionDiscountOnSubTotal || 0,
      isVisible: rentalSummary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.subtotal", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.subTotal || 0, currency }),
      value: rentalSummary.data?.subTotal || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.totalTax || 0, currency }),
      value: rentalSummary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.extraMileageCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraDayCharge || 0, currency }),
      value: rentalSummary.data?.extraDayCharge || 0,
      isVisible: !rentalSummary.data?.isExtraMileageChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraDurationCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraDayCharge || 0, currency }),
      value: rentalSummary.data?.extraDayCharge || 0,
      isVisible: !rentalSummary.data?.isExtraDayChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraFuelCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.extraFuelCharge || 0, currency }),
      value: rentalSummary.data?.extraFuelCharge || 0,
      isVisible: !rentalSummary.data?.isFuelChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.additionalCharges", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.additionalCharge || 0, currency }),
      value: rentalSummary.data?.additionalCharge || 0,
      isVisible: rentalSummary.data?.additionalCharge ? true : false,
    },
    {
      label: t("summaryOfCharges.postTaxAdjustment", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.postAdjustment || 0, currency }),
      value: rentalSummary.data?.postAdjustment || 0,
      isVisible: rentalSummary.data?.postAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.grandTotal", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.total || 0, currency }),
      value: rentalSummary.data?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: t("summaryOfCharges.amountPaid", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.amountPaid || 0, currency }),
      value: rentalSummary.data?.amountPaid || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.balanceDue", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.balanceDue || 0, currency }),
      value: rentalSummary.data?.balanceDue || 0,
      isVisible: true,
      isRed: rentalSummary.data?.balanceDue ? true : false,
    },
    {
      label: t("summaryOfCharges.securityDeposit", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: rentalSummary.data?.securityDeposit || 0, currency }),
      value: rentalSummary.data?.securityDeposit || 0,
      isVisible: rentalSummary.data?.securityDeposit ? true : false,
    },
  ];

  return (
    <ul className="rounded bg-muted py-3">
      {[...(props.referenceType.trim().toLowerCase() === "agreement" ? agreementItems : reservationItems)]
        .filter((i) => i.isVisible)
        .map((rowItem, idx) => (
          <RowItem {...rowItem} isLoading={isLoading} key={`${props.referenceType}-summary-${rowItem.label}-${idx}`} />
        ))}
    </ul>
  );
};

const RowItem: React.FC<RowItemProps & { isLoading?: boolean }> = ({ isLoading, ...props }) => {
  const { i18n } = useTranslation();

  return (
    <li
      className={clsx(
        "px-4",
        "py-2",
        "font-medium",
        {
          "text-primary": props.value && !props.highlight && !props.isRed, // not special or red and above 0
          "text-primary/60": !props.value && !props.highlight && !props.isRed, // not special or red but 0
          "text-destructive": props.isRed, // red
          "text-primary-foreground": props.highlight, // special
        },
        {
          "bg-muted-foreground": props.highlight,
          "font-semibold": props.highlight,
        }
      )}
    >
      <div className="flex items-center">
        <div className={clsx("flex-1", "pr-2", "md:text-sm")}>
          {isLoading ? <SkeletonBlock highlight={props.highlight} /> : props.label}
        </div>
        <div
          className={clsx("flex-1", i18n.dir() === "ltr" ? "text-right" : "text-left", "md:text-md", {
            "md:text-md": props.value || props.highlight,
            "md:text-sm": !props.value,
          })}
        >
          {isLoading ? <SkeletonBlock minWidth highlight={props.highlight} /> : props.currencyAmount}
        </div>
      </div>
    </li>
  );
};

const SkeletonBlock: React.FC<{ highlight?: boolean; minWidth?: boolean }> = ({ minWidth, highlight }) => {
  return (
    <span
      className={clsx(
        "inline-block",
        "w-full",
        "animate-pulse",
        { "bg-muted": !highlight, "bg-primary-foreground": highlight },
        { "w-10": minWidth }
      )}
    >
      &nbsp;
    </span>
  );
};

export default DefaultRentalSummary;
