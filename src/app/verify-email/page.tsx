"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setStatus("No token provided");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("Verified successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus(data.error || "Verification failed");
        }
      });
  }, [token, router]);

  return <p className="text-center text-lg">{status}</p>;
}

export default function VerifyPage() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Email Verification</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
