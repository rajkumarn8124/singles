"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ age: "", bio: "", personalityTags: "", gender: "Male", interestedIn: "Female", preferredPersonality: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(res => res.json()).then(data => {
      if (data.profile) {
        setForm({
          age: data.profile.age?.toString() || "",
          bio: data.profile.bio || "",
          personalityTags: data.profile.personalityTags || "",
          gender: data.profile.gender || "Male",
          interestedIn: data.profile.interestedIn || "Female",
          preferredPersonality: data.profile.preferredPersonality || ""
        });
        setImageUrl(data.profile.imageUrl || "");
      }
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ ...form, imageUrl }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);
    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to save profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full border-4 border-red-100 overflow-hidden bg-gray-100 flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <label className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
            Upload Photo or Take Selfie
            <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input required type="number" min="18" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Personality Tags (comma separated)</label>
            <input placeholder="Introvert, Foodie, Travel" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={form.personalityTags} onChange={e => setForm({...form, personalityTags: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interested In</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white" value={form.interestedIn} onChange={e => setForm({...form, interestedIn: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="All">All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Personality</label>
            <input placeholder="E.g., Introverts" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={form.preferredPersonality} onChange={e => setForm({...form, preferredPersonality: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}></textarea>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 font-bold">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
