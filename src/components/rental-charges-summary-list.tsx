import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { type SummaryCharges } from "@/api/summaryApi";

type RowItemProps = {
  label: string;
  value: number;
  currencyAmount: any;
  highlight?: boolean;
  isVisible: boolean;
  isRed?: boolean;
};

type Props = {
  referenceType: string;
  summary: SummaryCharges | null;
  clientProfile: { currency: string } | null;
};

const RentalChargesSummaryList: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const isLoading = !Boolean(props.summary) || !Boolean(props.clientProfile);

  const currency = props.clientProfile?.currency || "USD";

  const reservationItems: RowItemProps[] = [
    {
      label: t("summaryOfCharges.baseRate"),
      currencyAmount: t("intlCurrency", { value: props.summary?.baseRate || 0, currency }) || 0,
      value: props.summary?.baseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.discountOnBaseRate"),
      currencyAmount: t("intlCurrency", { value: props.summary?.promotionDiscount || 0, currency }),
      value: props.summary?.promotionDiscount || 0,
      isVisible: props.summary?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.finalBaseRate"),
      currencyAmount: t("intlCurrency", { value: props.summary?.finalBaseRate || 0, currency }),
      value: props.summary?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.totalMiscChargesTaxable || 0, currency }),
      value: props.summary?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalNonTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.totalMiscChargesNonTaxable || 0, currency }),
      value: props.summary?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.preTaxAdjustment"),
      currencyAmount: t("intlCurrency", { value: props.summary?.preAdjustment || 0, currency }),
      value: props.summary?.preAdjustment || 0,
      isVisible: props.summary?.preAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.preSubtotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.preSubTotal || 0, currency }),
      value: props.summary?.preSubTotal || 0,
      isVisible: props.summary?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.discountOnSubtotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.promotionDiscountOnSubTotal || 0, currency }),
      value: props.summary?.promotionDiscountOnSubTotal || 0,
      isVisible: props.summary?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.subtotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.subTotal || 0, currency }),
      value: props.summary?.subTotal || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.totalTax || 0, currency }),
      value: props.summary?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.additionalCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.additionalCharge || 0, currency }),
      value: props.summary?.additionalCharge || 0,
      isVisible: props.summary?.additionalCharge ? true : false,
    },
    {
      label: t("summaryOfCharges.estimatedTotalWithDeposit"),
      currencyAmount: t("intlCurrency", { value: props.summary?.estimateTotalwithDeposit || 0, currency }),
      value: props.summary?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.grandTotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.total || 0, currency }),
      value: props.summary?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: t("summaryOfCharges.balanceDue"),
      currencyAmount: t("intlCurrency", { value: props.summary?.balanceDue || 0, currency }),
      value: props.summary?.balanceDue || 0,
      isVisible: true,
      isRed: props.summary?.balanceDue ? true : false,
    },
    {
      label: t("summaryOfCharges.amountPaid"),
      currencyAmount: t("intlCurrency", { value: props.summary?.amountPaid || 0, currency }),
      value: props.summary?.amountPaid || 0,
      isVisible: true,
      isRed: props.summary?.amountPaid ? true : false,
    },
    {
      label: t("summaryOfCharges.securityDeposit"),
      currencyAmount: t("intlCurrency", { value: props.summary?.securityDeposit || 0, currency }),
      value: props.summary?.securityDeposit || 0,
      isVisible: props.summary?.securityDeposit ? true : false,
    },
  ];

  const agreementItems: RowItemProps[] = [
    {
      label: t("summaryOfCharges.baseRate", { context: "agreement" }),
      currencyAmount: t("intlCurrency", { value: props.summary?.baseRate || 0, currency }),
      value: props.summary?.baseRate || 0,
      isVisible: props.summary?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.discountOnBaseRate"),
      currencyAmount: t("intlCurrency", { value: props.summary?.promotionDiscount || 0, currency }),
      value: props.summary?.promotionDiscount || 0,
      isVisible: props.summary?.promotionDiscount ? true : false,
    },
    {
      label: t("summaryOfCharges.finalBaseRate"),
      currencyAmount: t("intlCurrency", { value: props.summary?.finalBaseRate || 0, currency }),
      value: props.summary?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.totalMiscChargesTaxable || 0, currency }),
      value: props.summary?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalNonTaxMischarges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.totalMiscChargesNonTaxable || 0, currency }),
      value: props.summary?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.extraMileageCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.extraMilesCharge || 0, currency }),
      value: props.summary?.extraMilesCharge || 0,
      isVisible: props.summary?.isExtraMileageChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraDurationCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.extraDayCharge || 0, currency }),
      value: props.summary?.extraDayCharge || 0,
      isVisible: props.summary?.isExtraDayChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraFuelCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.extraFuelCharge || 0, currency }),
      value: props.summary?.extraFuelCharge || 0,
      isVisible: props.summary?.isFuelChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.preTaxAdjustment"),
      currencyAmount: t("intlCurrency", { value: props.summary?.preAdjustment || 0, currency }),
      value: props.summary?.preAdjustment || 0,
      isVisible: props.summary?.preAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.preSubtotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.preSubTotal || 0, currency }),
      value: props.summary?.preSubTotal || 0,
      isVisible: props.summary?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.discountOnSubtotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.promotionDiscountOnSubTotal || 0, currency }),
      value: props.summary?.promotionDiscountOnSubTotal || 0,
      isVisible: props.summary?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: t("summaryOfCharges.subtotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.subTotal || 0, currency }),
      value: props.summary?.subTotal || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.totalTaxCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.totalTax || 0, currency }),
      value: props.summary?.totalTax || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.extraMileageCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.extraDayCharge || 0, currency }),
      value: props.summary?.extraDayCharge || 0,
      isVisible: !props.summary?.isExtraMileageChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraDurationCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.extraDayCharge || 0, currency }),
      value: props.summary?.extraDayCharge || 0,
      isVisible: !props.summary?.isExtraDayChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.extraFuelCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.extraFuelCharge || 0, currency }),
      value: props.summary?.extraFuelCharge || 0,
      isVisible: !props.summary?.isFuelChargeTaxable || false,
    },
    {
      label: t("summaryOfCharges.additionalCharges"),
      currencyAmount: t("intlCurrency", { value: props.summary?.additionalCharge || 0, currency }),
      value: props.summary?.additionalCharge || 0,
      isVisible: props.summary?.additionalCharge ? true : false,
    },
    {
      label: t("summaryOfCharges.postTaxAdjustment"),
      currencyAmount: t("intlCurrency", { value: props.summary?.postAdjustment || 0, currency }),
      value: props.summary?.postAdjustment || 0,
      isVisible: props.summary?.postAdjustment ? true : false,
    },
    {
      label: t("summaryOfCharges.grandTotal"),
      currencyAmount: t("intlCurrency", { value: props.summary?.total || 0, currency }),
      value: props.summary?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: t("summaryOfCharges.amountPaid"),
      currencyAmount: t("intlCurrency", { value: props.summary?.amountPaid || 0, currency }),
      value: props.summary?.amountPaid || 0,
      isVisible: true,
    },
    {
      label: t("summaryOfCharges.balanceDue"),
      currencyAmount: t("intlCurrency", { value: props.summary?.balanceDue || 0, currency }),
      value: props.summary?.balanceDue || 0,
      isVisible: true,
      isRed: props.summary?.balanceDue ? true : false,
    },
    {
      label: t("summaryOfCharges.securityDeposit"),
      currencyAmount: t("intlCurrency", { value: props.summary?.securityDeposit || 0, currency }),
      value: props.summary?.securityDeposit || 0,
      isVisible: props.summary?.securityDeposit ? true : false,
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
        },
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
        { "w-10": minWidth },
      )}
    >
      &nbsp;
    </span>
  );
};

export default RentalChargesSummaryList;
