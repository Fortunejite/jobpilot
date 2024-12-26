// import Image from "next/image";
import Footer from "@/components/DarkFooter/page";
import styles from "./page.module.css";

export default async function Home() {
  
  return (
    <div className={styles.page}>
      <main>Home PAge</main>
      <Footer />
    </div>
  );
}
