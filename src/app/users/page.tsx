"use client";
import MainLayout from "~/components/layout/mainLayout";
import { api } from "~/trpc/react";

const Users = () => {
  const { data } = api.user.find.useQuery({
    sort: "id",
    dir: "asc",
    page: "0",
    limit: "10",
  });

  if (!data) return <div>Loading...</div>;

  console.log("Data", data?.data);
  console.log("Meta", data?.meta);

  return <MainLayout headerChildren={<div>Users</div>}>Users</MainLayout>;
};

export default Users;
