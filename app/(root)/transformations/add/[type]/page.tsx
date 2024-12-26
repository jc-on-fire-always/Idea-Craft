import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  if (!transformationTypes[type]) {
    redirect("/404");
    return;
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user;
  try {
    user = await getUserById(userId);
  } catch (error) {
    console.error("Error fetching user:", error);
    redirect("/error"); // Redirect to an error page or handle gracefully
    return;
  }

  if (!user) {
    console.error("User not found");
    redirect("/sign-in");
    return;
  }
  const transformation = transformationTypes[type];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <TransformationForm
        action="Add"
        userId={user._id}
        type={transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance}
      />
    </>
  );
};

export default AddTransformationTypePage;
