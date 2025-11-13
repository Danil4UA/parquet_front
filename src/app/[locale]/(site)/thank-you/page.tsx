"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import PaymentConstants from "@/constants/paymentConstants";
import RouteConstants from "@/constants/RouteConstants";

export default function ThankYouPage() {
  const t = useTranslations("ThankYou");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];

  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("order");
  const totalPrice = searchParams.get("total");

  if (!orderNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6 px-4">
        <h1 className="text-3xl font-bold">{t("orderNotFound")}</h1>
        <p>{t("returnHomeMessage")}</p>
        <Button onClick={() => router.push("/")}>{t("backHome")}</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh] p-4 gap-6">
      <h1 className="text-4xl font-bold text-green-700 text-center">{t("orderPlaced")}</h1>

      <p className="text-lg">
        {t("orderNumber")}: <span className="font-semibold">{orderNumber}</span>
      </p>

      <Card className="max-w-lg w-full bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle>{t("paymentInfoTitle")}</CardTitle>
          <CardDescription>{t("paymentInfo")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <p>
            <strong>{t("bank")}:</strong> {PaymentConstants.BANK_NAME}
          </p>
          <p>
            <strong>{t("branch")}:</strong> {PaymentConstants.BRANCH_NUMBER}
          </p>
          <p>
            <strong>{t("accountNumber")}:</strong> {PaymentConstants.ACCOUNT_NUMBER}
          </p>

          <p>
            <strong>{t("paymentPurpose")}:</strong>{" "}
            <span className="font-semibold">{orderNumber}</span>
          </p>

          {totalPrice && (
            <p className="pt-3 border-t border-gray-300">
              <strong>{t("totalAmount")}:</strong>{" "}
              <span className="text-lg font-semibold">
                {totalPrice} ₪
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-gray-600 max-w-md">{t("waitForCall")}</p>

      <Button variant="default" size="lg" onClick={() => router.push(`/${lng}/${RouteConstants.HOMEPAGE_ROUTE}`)}>
        {t("backHome")}
      </Button>
    </div>
  );
}
