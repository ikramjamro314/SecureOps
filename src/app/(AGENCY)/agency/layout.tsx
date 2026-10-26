import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Provider from "../../../utils/Provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agency Dashboard",
  description: "Smart security operations management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawSession = await getServerSession(authOptions);
  const session = rawSession || {
    user: {
      name: "Demo Agency Admin",
      email: "agency@secureops.demo",
      image: "/assets/logo.png",
      role: "AGENCY",
      id: "demo-agency-id",
      verified: true,
    },
    expires: "9999-12-31T23:59:59.999Z",
  };
  const smallCase = "agency";
  const data = {
    link: [
      {
        href: `${smallCase}/guards/`,
      },
      {
        href: `${smallCase}/attendance`,
      },
      {
        href: `${smallCase}/alerts`,
      },
      {
        href: `${smallCase}/guards/metrics`,
      },
    ],
    value: [
      {
        value: "Fleet Dashboard",
      },
      {
        value: "Muster Roll",
      },
      {
        value: "Threat Radar",
      },
      {
        value: "Metrics",
      },
    ],
  };
  return (
    <div className="min-h-screen">
      <Provider session={session}>
        <Navbar data={data} />
        {children}
      </Provider>
    </div>
  );
}
