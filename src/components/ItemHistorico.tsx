import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HistoricoItem {
  id: string;
  data: string;
  valorTotalMesa: string;
  valorIndividual: string;
  valorSoConsumo: string;
  valorSoGorjeta: string;
  detalhes: string;
}

interface ItemHistoricoProps {
  item: HistoricoItem;
  onExcluir: (id: string) => void;
}

export function ItemHistorico({ item, onExcluir }: ItemHistoricoProps) {
  return (
    <View style={styles.itemHistorico}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        {/* CORRIGIDO AQUI: Alterado de <div> para <View> */}
        <View style={styles.rowEspacada}>
          <Text style={styles.txtSecundario}>{item.data}</Text>
          <Text style={styles.txtMesa}>Mesa: R$ {item.valorTotalMesa}</Text>
        </View>

        <Text style={styles.txtIndividual}>
          Cada um: R$ {item.valorIndividual}
        </Text>
        <Text style={styles.txtDetalhes}>{item.detalhes}</Text>

        <View style={styles.containerValores}>
          <Text style={styles.txtConsumo}>
            ↳ Divisão do Consumo: R$ {item.valorSoConsumo || "0,00"} por pessoa
          </Text>
          <Text style={styles.txtGorjeta}>
            ↳ Divisão da Gorjeta: R$ {item.valorSoGorjeta || "0,00"} por pessoa
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onExcluir(item.id)}
        style={{ justifyContent: "center" }}
      >
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  rowEspacada: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  txtSecundario: { fontSize: 11, color: "#888" },
  txtMesa: { fontSize: 11, color: "#444", fontWeight: "500" },
  txtIndividual: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1e88e5",
    marginBottom: 4,
  },
  txtDetalhes: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
  },
  containerValores: {
    borderTopWidth: 1,
    borderTopColor: "#f1f3f5",
    paddingTop: 4,
    marginTop: 2,
  },
  txtConsumo: { fontSize: 11, color: "#2e7d32", fontWeight: "600" },
  txtGorjeta: {
    fontSize: 11,
    color: "#e65100",
    fontWeight: "600",
    marginTop: 1,
  },
});
