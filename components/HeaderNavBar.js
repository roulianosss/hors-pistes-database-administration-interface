import Image from "next/image";
import React from "react";
import styles from "../styles/HeaderNavBar.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/user";

export default function HeaderNavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const router = useRouter();
  const signout = () => {
    dispatch(logout());
    router.push("/signout");
  };
  return (
    <div className={styles.globalContainer}>
      <div className={styles.logoContainer}>
        <Image
          src="/assets/logo.png"
          alt="logo"
          width={211 / 3}
          height={111 / 3}
        />
        <p>ADMINISTRATION</p>
      </div>
      <div className={styles.menuBtns}>
        {user.token ? (
          <>
            <p onClick={() => router.push("/structures")}>STRUCTURES</p>
            <p onClick={() => router.push("/volunteers")}>VOLUNTEERS</p>
            <p onClick={() => router.push("/missions")}>MISSIONS</p>
            <p onClick={() => signout()}>LOGOUT</p>{" "}
          </>
        ) : (
          <p onClick={() => router.push("/signin")}>LOGIN</p>
        )}
      </div>
    </div>
  );
}
