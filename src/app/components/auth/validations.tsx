export type FormMessage = {
  type: "error" | "warning" | "info";
  message: string;
};

export const validateName = (value: string, label?: string): FormMessage | null => {
  const fieldLabel = label || "feltet";
  const trimmed = value.trim();

  if (!trimmed) {
    return { type: "error", message: `Indtast ${fieldLabel}` };
  }
  if (trimmed.length < 2) {
    return { type: "warning", message: `${fieldLabel} er meget kort` };
  }
  return null;
};

export const validateEmail = (value: string): FormMessage | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { type: "error", message: "Udfyld venligst email-feltet" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { type: "error", message: "Indtast en gyldig emailadresse" };
  }

  return null;
};

export const validatePasswordSignup = (value: string): FormMessage | null => {
  if (!value) {
    return { type: "error", message: "Indtast adgangskode" };
  }
  if (value.length < 8) {
    return { type: "error", message: "Adgangskoden skal være mindst 8 tegn" };
  }
  if (!/[A-Z]/.test(value)) {
    return { type: "error", message: "Adgangskoden skal indeholde mindst ét stort bogstav" };
  }
  if (!/[0-9]/.test(value)) {
    return { type: "error", message: "Adgangskoden skal indeholde mindst ét tal" };
  }

  return null;
};

export const validatePasswordLogin = (value: string): FormMessage | null => {
  if (!value) {
    return { type: "error", message: "Indtast adgangskode" };
  }

  return null;
};