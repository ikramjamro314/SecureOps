import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Provider from "../../../utils/Provider"
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
  title: "Police Dashboard",
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
      name: "Demo Police Officer",
      email: "policeofficer.secureops@demo.com",
      image: "/assets/logo.png",
      role: "POLICE",
      id: "demo-police-id",
      verified: true,
    },
    expires: "9999-12-31T23:59:59.999Z",
  };
  const smallCase = "police";
  const data = {
    link: [
      {
        href: `${smallCase}/dashboard`,
      },
      {
        href: `${smallCase}/verification`,
      },
      {
        href: `${smallCase}/dashboard/incident`,
      },
    ],
    value: [
      {
        value: "Police's Dashboard",
      },
      {
        value: "Verification",
      },
      {
        value: "Incident",
      },
    ],
  }
  return (
    <div className="min-h-screen">
      <Provider session={session}>
        <Navbar data={data} />
        {children}
      </Provider>
    </div>
  );
}

