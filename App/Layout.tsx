import { LanguageProvider } from "@/components/LanguageProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta
          name="google-site-verification"
          content="WB9NBVxWdFq1PSzMHqqD6zZroNI-VFYJH1Zu91eYxA0"
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
