import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router"; // Importação essencial
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Se quiser esconder a barra de baixo totalmente, descomente a linha abaixo:
        // tabBarStyle: { display: 'none' },
      }}
    >
      {/* Mantenha apenas esta Screen e mude o 'name' para o nome do seu arquivo */}
      <Tabs.Screen
        name="index" // Se o arquivo da calculadora for index.tsx, mantenha assim.
        options={{
          title: "Racha Conta",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
