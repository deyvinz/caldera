"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckoutStepper } from "@/components/booking/CheckoutStepper";
import { PriceSummary } from "@/components/booking/PriceSummary";
import { bookingSchema, type BookingInput } from "@/lib/validation";
import { Form } from "@/components/forms/Form";
import { Field } from "@/components/forms/Field";
import { post } from "@/lib/api";

export default function CheckoutClient({ packageId }: { packageId: string }) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [values, setValues] = React.useState<BookingInput>({ startDate: "", travelers: 1 });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      setLoading(false);
      setError(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    const res = await post<{ bookingId: string; tx_ref: string; total_usd: number }>("/bookings", {
      packageId,
      ...parsed.data,
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.push(`/dashboard?created=${res.data.bookingId}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <CheckoutStepper step={step} />
      {step === 1 && (
        <Form<BookingInput>
          defaultValues={values}
          validator={(bookingSchema as unknown) as any}
          onSubmit={(vals) => {
            setValues(vals);
            setStep(3);
          }}
        >
          {(api: any) => (
            <div className="space-y-4">
              <Field label="Start Date" field={api.state?.fields?.startDate}>
                <Input
                  type="date"
                  value={api.state?.values?.startDate}
                  onChange={(e) => api.setFieldValue("startDate", e.target.value)}
                />
              </Field>
              <Field label="Travelers" field={api.state?.fields?.travelers}>
                <Input
                  type="number"
                  min={1}
                  value={api.state?.values?.travelers}
                  onChange={(e) => api.setFieldValue("travelers", Number(e.target.value))}
                />
              </Field>
              <div className="flex justify-between">
                <span />
                <Button type="submit">Next</Button>
              </div>
            </div>
          )}
        </Form>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <PriceSummary base={1000} travelers={values.travelers} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={submit} disabled={loading} loading={loading as any}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
}


