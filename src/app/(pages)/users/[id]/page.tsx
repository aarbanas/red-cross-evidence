"use client";
import MainLayout from "~/components/layout/mainLayout";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import UserForm from "~/app/(pages)/users/[id]/_components/UsersForm";

export default function UserDetailPage() {
  const { id } = useParams();

  // Fetch user data by ID
  const { data, isLoading, error } = api.user.findById.useQuery({
    id: id as string,
  });

  return (
    <MainLayout
      headerChildren={
        <div>
          Uređivanje volontera {data?.profile?.firstName}{" "}
          {data?.profile?.lastName}
        </div>
      }
    >
      <div>
        {isLoading && <LoadingSpinner />}
        {error && <div>Greška</div>}
        {data && (
          <UserForm
            id={id as string}
            formData={{
              email: data?.email ?? "",
              active: data?.active ?? false,
              firstname: data?.profile?.firstName ?? "",
              lastname: data?.profile?.lastName ?? "",
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
