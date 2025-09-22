export function isAllowedMime(mime) {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  return allowed.includes(mime);
}

export function validateReceiptBody(body) {
  const errors = {};
  const {
    bank,
    branch, // optional
    paymentDate,
    amount,
    paymentMethod,
    notes, // optional
    consent,
  } = body;

  if (!bank) errors.bank = "Bank is required";
  if (!paymentDate) errors.paymentDate = "Payment date is required";
  if (amount == null || amount === "") errors.amount = "Amount is required";
  else if (Number(amount) <= 0) errors.amount = "Amount must be > 0";
  if (!paymentMethod) errors.paymentMethod = "Payment method is required";
  if (consent !== "true" && consent !== true)
    errors.consent = "Consent must be confirmed";

  // date sanity (<= today and within last 1 year)
  if (paymentDate) {
    const sel = new Date(paymentDate);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    if (sel > today)
      errors.paymentDate = "Payment date cannot be in the future";
    else if (sel < oneYearAgo)
      errors.paymentDate = "Payment date cannot be more than 1 year ago";
  }

  return errors;
}
