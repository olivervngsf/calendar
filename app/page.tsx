import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { DataProvider } from "@/components/providers/DataProvider";
import { SelectionProvider } from "@/components/providers/SelectionProvider";
import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  return (
    <SettingsProvider>
      <DataProvider>
        <SelectionProvider>
          <AppShell />
        </SelectionProvider>
      </DataProvider>
    </SettingsProvider>
  );
}
