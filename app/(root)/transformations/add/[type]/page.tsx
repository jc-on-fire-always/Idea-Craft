"use client";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { useAuth } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const AddTransformationTypePage = ({ params: { type } }: SearchParamProps) => {
  const { userId } = useAuth(); // Correctly call `useAuth` synchronously
  const [user, setUser] = useState<User | null>(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading
  const transformation = transformationTypes[type];

  let fetchedUser;
  useEffect(() => {
    if (!userId) {
      redirect("/sign-in");
    } else {
      const fetchUserData = async () => {
        try {
          const fetchedUser = await getUserById(userId);
          setUser(fetchedUser);
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchUserData();
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (!user) return <p>User not found</p>; // Handle missing user case

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
