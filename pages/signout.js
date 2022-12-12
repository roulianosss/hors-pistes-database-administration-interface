import React from "react";
import HeaderNavBar from "../components/HeaderNavBar";
import { useRouter } from "next/router";

export default function signout() {
  const router = useRouter()
  setTimeout(() => router.push("/signin"), 4000)

  return (
    <>
      <HeaderNavBar />
      <div
        style={{
          display: "flex",
          alignItems: 'center',
          justifyContent: "center",
          height: '80vh',
        }}
      >
        <p>Vous avez été déconnecté</p>
      </div>
    </>
  );
}
