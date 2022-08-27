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
  const summary = useRentalSummaryQuery(props);
  const profile = useClientProfileQuery(props);

  const isLoading = summary.isLoading || profile.isLoading;

  const currency = profile.data?.currency || "USD";

  const agreementItems: RowItemProps[] = [
    {
      label: "Total rate charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.baseRate || 0, currency }),
      value: summary.data?.baseRate || 0,
      isVisible: summary.data?.promotionDiscount ? true : false,
    },
    {
      label: "Promotion",
      currencyAmount: t("intlCurrency", { value: summary.data?.promotionDiscount || 0, currency }),
      value: summary.data?.promotionDiscount || 0,
      isVisible: summary.data?.promotionDiscount ? true : false,
    },
    {
      label: "Final base rate",
      currencyAmount: t("intlCurrency", { value: summary.data?.finalBaseRate || 0, currency }),
      value: summary.data?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: "Total misc. charges (taxable)",
      currencyAmount: t("intlCurrency", { value: summary.data?.totalMiscChargesTaxable || 0, currency }),
      value: summary.data?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: "Total misc. charges (non-Taxable)",
      currencyAmount: t("intlCurrency", { value: summary.data?.totalMiscChargesNonTaxable || 0, currency }),
      value: summary.data?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: "Extra miles charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.extraMilesCharge || 0, currency }),
      value: summary.data?.extraMilesCharge || 0,
      isVisible: summary.data?.isExtraMileageChargeTaxable || false,
    },
    {
      label: "Extra duration charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.extraDayCharge || 0, currency }),
      value: summary.data?.extraDayCharge || 0,
      isVisible: summary.data?.isExtraDayChargeTaxable || false,
    },
    {
      label: "Extra fuel charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.extraFuelCharge || 0, currency }),
      value: summary.data?.extraFuelCharge || 0,
      isVisible: summary.data?.isFuelChargeTaxable || false,
    },
    {
      label: "Pre-tax adjustments",
      currencyAmount: t("intlCurrency", { value: summary.data?.preAdjustment || 0, currency }),
      value: summary.data?.preAdjustment || 0,
      isVisible: summary.data?.preAdjustment ? true : false,
    },
    {
      label: "Subtotal before discount",
      currencyAmount: t("intlCurrency", { value: summary.data?.preSubTotal || 0, currency }),
      value: summary.data?.preSubTotal || 0,
      isVisible: summary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: "Promotion on subtotal",
      currencyAmount: t("intlCurrency", { value: summary.data?.promotionDiscountOnSubTotal || 0, currency }),
      value: summary.data?.promotionDiscountOnSubTotal || 0,
      isVisible: summary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: "Subtotal",
      currencyAmount: t("intlCurrency", { value: summary.data?.subTotal || 0, currency }),
      value: summary.data?.subTotal || 0,
      isVisible: true,
    },
    {
      label: "Total tax charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.totalTax || 0, currency }),
      value: summary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: "Extra miles charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.extraDayCharge || 0, currency }),
      value: summary.data?.extraDayCharge || 0,
      isVisible: !summary.data?.isExtraMileageChargeTaxable || false,
    },
    {
      label: "Extra duration charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.extraDayCharge || 0, currency }),
      value: summary.data?.extraDayCharge || 0,
      isVisible: !summary.data?.isExtraDayChargeTaxable || false,
    },
    {
      label: "Fuel charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.extraFuelCharge || 0, currency }),
      value: summary.data?.extraFuelCharge || 0,
      isVisible: !summary.data?.isFuelChargeTaxable || false,
    },
    {
      label: "Additional charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.additionalCharge || 0, currency }),
      value: summary.data?.additionalCharge || 0,
      isVisible: summary.data?.additionalCharge ? true : false,
    },
    {
      label: "Post-tax adjustments",
      currencyAmount: t("intlCurrency", { value: summary.data?.postAdjustment || 0, currency }),
      value: summary.data?.postAdjustment || 0,
      isVisible: summary.data?.postAdjustment ? true : false,
    },
    {
      label: "Grand total",
      currencyAmount: t("intlCurrency", { value: summary.data?.total || 0, currency }),
      value: summary.data?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: "Amount paid",
      currencyAmount: t("intlCurrency", { value: summary.data?.amountPaid || 0, currency }),
      value: summary.data?.amountPaid || 0,
      isVisible: true,
    },
    {
      label: "Balance due",
      currencyAmount: t("intlCurrency", { value: summary.data?.balanceDue || 0, currency }),
      value: summary.data?.balanceDue || 0,
      isVisible: true,
      isRed: summary.data?.balanceDue ? true : false,
    },
    {
      label: "Security deposit",
      currencyAmount: t("intlCurrency", { value: summary.data?.securityDeposit || 0, currency }),
      value: summary.data?.securityDeposit || 0,
      isVisible: summary.data?.securityDeposit ? true : false,
    },
  ];

  const reservationItems: RowItemProps[] = [
    {
      label: "Base Rate",
      currencyAmount: t("intlCurrency", { value: summary.data?.baseRate || 0, currency }) || 0,
      value: summary.data?.baseRate || 0,
      isVisible: true,
    },
    {
      label: "Promotion",
      currencyAmount: t("intlCurrency", { value: summary.data?.promotionDiscount || 0, currency }),
      value: summary.data?.promotionDiscount || 0,
      isVisible: summary.data?.promotionDiscount ? true : false,
    },
    {
      label: "Final base rate",
      currencyAmount: t("intlCurrency", { value: summary.data?.finalBaseRate || 0, currency }),
      value: summary.data?.finalBaseRate || 0,
      isVisible: true,
    },
    {
      label: "Total misc. charges (taxable)",
      currencyAmount: t("intlCurrency", { value: summary.data?.totalMiscChargesTaxable || 0, currency }),
      value: summary.data?.totalMiscChargesTaxable || 0,
      isVisible: true,
    },
    {
      label: "Total misc. charges (non-Taxable)",
      currencyAmount: t("intlCurrency", { value: summary.data?.totalMiscChargesNonTaxable || 0, currency }),
      value: summary.data?.totalMiscChargesNonTaxable || 0,
      isVisible: true,
    },
    {
      label: "Pre-tax adjustments",
      currencyAmount: t("intlCurrency", { value: summary.data?.preAdjustment || 0, currency }),
      value: summary.data?.preAdjustment || 0,
      isVisible: summary.data?.preAdjustment ? true : false,
    },
    {
      label: "Subtotal before discount",
      currencyAmount: t("intlCurrency", { value: summary.data?.preSubTotal || 0, currency }),
      value: summary.data?.preSubTotal || 0,
      isVisible: summary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: "Promotion on subtotal",
      currencyAmount: t("intlCurrency", { value: summary.data?.promotionDiscountOnSubTotal || 0, currency }),
      value: summary.data?.promotionDiscountOnSubTotal || 0,
      isVisible: summary.data?.promotionDiscountOnSubTotal ? true : false,
    },
    {
      label: "Subtotal",
      currencyAmount: t("intlCurrency", { value: summary.data?.subTotal || 0, currency }),
      value: summary.data?.subTotal || 0,
      isVisible: true,
    },

    {
      label: "Total tax charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.totalTax || 0, currency }),
      value: summary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: "Additional charges",
      currencyAmount: t("intlCurrency", { value: summary.data?.additionalCharge || 0, currency }),
      value: summary.data?.additionalCharge || 0,
      isVisible: summary.data?.additionalCharge ? true : false,
    },
    {
      label: "Estimated Total",
      currencyAmount: t("intlCurrency", { value: summary.data?.estimateTotalwithDeposit || 0, currency }),
      value: summary.data?.totalTax || 0,
      isVisible: true,
    },
    {
      label: "Grand total",
      currencyAmount: t("intlCurrency", { value: summary.data?.total || 0, currency }),
      value: summary.data?.total || 0,
      isVisible: true,
      highlight: true,
    },
    {
      label: "Balance due",
      currencyAmount: t("intlCurrency", { value: summary.data?.balanceDue || 0, currency }),
      value: summary.data?.balanceDue || 0,
      isVisible: true,
      isRed: summary.data?.balanceDue ? true : false,
    },
    {
      label: "Amount paid",
      currencyAmount: t("intlCurrency", { value: summary.data?.amountPaid || 0, currency }),
      value: summary.data?.amountPaid || 0,
      isVisible: true,
      isRed: summary.data?.amountPaid ? true : false,
    },
    {
      label: "Security deposit",
      currencyAmount: t("intlCurrency", { value: summary.data?.securityDeposit || 0, currency }),
      value: summary.data?.securityDeposit || 0,
      isVisible: summary.data?.securityDeposit ? true : false,
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
