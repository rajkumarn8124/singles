"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Please check your console for the verification link to activate your profile.");
    } else {
      setMessage(data.error || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Join singles.com</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input required type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600 bg-gray-100 p-2 rounded">{message}</p>}
    </div>
  );
}
