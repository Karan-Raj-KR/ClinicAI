import "./globals.css";

export const metadata = {
  title: "ClinicAI - Smart Clinic Assistant",
  description: "A modern clinic assistant demo with AI capabilities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
