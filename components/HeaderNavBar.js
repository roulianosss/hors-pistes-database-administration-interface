import Image from "next/image";
import React from "react";
import styles from "../styles/HeaderNavBar.module.css";
import { useRouter } from "next/router";

export default function HeaderNavBar() {
  const router = useRouter();
  console.log(router.pathname)
  return (
    <div className={styles.globalContainer}>
      <div className={styles.logoContainer}>
      <Image
        src="/assets/logo.png"
        alt="logo"
        width={211 / 2.5}
        height={111 / 2.5}
      />
      <p>HORS PISTES DATABASE ADIMINISTRATION INTERFACE</p>
      </div>
      <div className={styles.menuBtns}>
        <p onClick={() => router.push("/structures")}>STRUCTURES</p>
        <p onClick={() => router.push("/volunteers")}>VOLUNTEERS</p>
        <p onClick={() => router.push("/missions")}>MISSIONS</p>
      </div>
    </div>
  );
}
