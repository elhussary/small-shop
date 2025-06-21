import { useTranslations } from "next-intl";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  
  return (
    <div className="p-6">
      <section className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
      </section>
    </div>
  );
}
