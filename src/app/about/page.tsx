import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About | เกี่ยวกับเรา",
  description: "เกี่ยวกับเราและสิ่งที่เราทำ มุ่งเน้นคุณภาพ ประสบการณ์ผู้ใช้ และประสิทธิภาพ",
};

export default function AboutPage() {
  return <AboutClient />;
}
