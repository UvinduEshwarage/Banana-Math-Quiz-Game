// app/set-password/page.tsx
import { Suspense } from "react";
import SetPasswordForm from "./SetPasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}