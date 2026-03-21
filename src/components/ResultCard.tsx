import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ResultCardProps {
  totalCompleto: string;
  totalSoConsumo: string;
  totalSoGorjeta: string;
  mostrarSoConsumo: boolean;
  mostrarSoGorjeta: boolean;
}

export const ResultCard = ({
  totalCompleto,
  totalSoConsumo,
  totalSoGorjeta,
  mostrarSoConsumo,
  mostrarSoGorjeta,
}: ResultCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>TOTAL POR PESSOA</Text>
      <Text style={styles.mainValue}>R$ {totalCompleto}</Text>
      <View style={styles.divider} />
      <View style={styles.detailsRow}>
        {mostrarSoConsumo && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Consumo</Text>
            <Text style={styles.detailValue}>R$ {totalSoConsumo}</Text>
          </View>
        )}
        {mostrarSoGorjeta && (
          <View style={styles.detailItem}>
            {/* CORREÇÃO AQUI: "Gorjeta por pessoa" */}
            <Text style={[styles.detailLabel, { color: "#4caf50" }]}>
              Gorjeta por pessoa
            </Text>
            <Text style={[styles.detailValue, { color: "#4caf50" }]}>
              R$ {totalSoGorjeta}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 3,
    alignItems: "center",
  },
  label: { fontSize: 12, color: "#888", letterSpacing: 1, fontWeight: "600" },
  mainValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196f3",
    marginVertical: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  detailsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  detailItem: { alignItems: "center" },
  detailLabel: { fontSize: 11, color: "#999" },
  detailValue: { fontSize: 15, fontWeight: "600", color: "#444" },
});
