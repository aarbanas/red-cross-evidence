"use client";
import { useState, useEffect } from "react";
import MainLayout from "~/components/layout/mainLayout";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { FindUserReturnDTO } from "../page";

export default function UserDetailPage() {
  const { id } = useParams(); // Get the user ID from the URL

  // Fetch user data by ID
  const { data, isLoading, error } = api.user.findById.useQuery({
    id: id as string,
  });

  // State to manage form inputs
  const [formData, setFormData] = useState<FindUserReturnDTO | null>(null);

  // Initialize formData when data is loaded
  useEffect(() => {
    if (data && data.length > 0 && data[0]) {
      setFormData(data[0]);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error ?? !formData) {
    return (
      <div>Error loading user data. Please check the URL and try again.</div>
    );
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (!prev) return null;

      const updatedProfile = {
        ...prev.profile,
        [name]: type === "checkbox" ? checked : value ?? "",
      };

      return {
        ...prev,
        profile: {
          ...prev.profile,
          firstName: updatedProfile.firstName ?? prev.profile?.firstName ?? "",
          lastName: updatedProfile.lastName ?? prev.profile?.lastName ?? "",
        },
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for form submission goes here
  };

  return (
    <MainLayout
      headerChildren={
        <h1 className="text-xl font-bold">
          Uređivanje volontera {formData.profile?.firstName}{" "}
          {formData.profile?.lastName}
        </h1>
      }
    >
      <div>
        <form
          className="space-y-8 rounded-lg bg-white p-8 shadow-md"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.profile?.firstName ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.profile?.lastName ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active ?? false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="active"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex w-max justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
