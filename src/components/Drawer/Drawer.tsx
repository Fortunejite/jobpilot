'use client'
import React from "react";
import { useDrawer } from "@/context/drawer";
import Link from "next/link";
import styles from "./Drawer.module.css";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

interface LinkType {
  name: string;
  link: string;
  status: "both" | "auth" | "no-auth";
  role: "any" | "worker" | "employer";
}

const links: LinkType[] = [
  { name: "Home", link: "/", status: "both", role: "any" },
  { name: "Find Job", link: "/findJob", status: "no-auth", role: "any" },
  { name: "Find Job", link: "/findJob", status: "auth", role: "worker" },
  { name: "Find Candidates", link: "/findCandidates", status: "auth", role: "employer" },
  { name: "Find Employers", link: "/findEmployers", status: "auth", role: "worker" },
  { name: "Employers", link: "/employers", status: "no-auth", role: "any" },
  { name: "Candidates", link: "/candidates", status: "no-auth", role: "any" },
  { name: "Dashboard", link: "/dashboard", status: "auth", role: "any" },
  { name: "My Jobs", link: "/myJobs", status: "auth", role: "employer" },
  { name: "Applications", link: "/applications", status: "auth", role: "employer" },
  { name: "Job Alerts", link: "/jobAlerts", status: "auth", role: "worker" },
  { name: "Customer Support", link: "/support", status: "both", role: "any" },
];

const MobileDrawer = () => {
  const { isOpen, toggleDrawer, closeDrawer } = useDrawer();
  const pathname = usePathname();

  const session = useSession();
  const user = session.data?.user;

  return (
    <div>
      <div className={`${styles.drawerOverlay} ${isOpen ? styles.showOverlay : ""}`} onClick={closeDrawer}></div>

      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <button className={styles.closeButton} onClick={closeDrawer}>
          <X />
        </button>
        <ul>
          {links.map((link) => {
            if (!user && link.status === "auth") return null;
            if (user && link.status === "no-auth") return null;
            if (link.role !== "any" && user?.role !== link.role) return null;
            return (
              <Link key={link.name} href={link.link} onClick={closeDrawer}>
                <li className={link.link === pathname ? styles.active : ""}>{link.name}</li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MobileDrawer;