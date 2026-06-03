import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { DataProvider } from "@/components/providers/DataProvider";
import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  return (
    <SettingsProvider>
      <DataProvider>
        <AppShell />
      </DataProvider>
    </SettingsProvider>
  );
}
