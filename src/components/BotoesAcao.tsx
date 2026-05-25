import React from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BotoesAcaoProps {
  onSalvar: () => void;
  onLimpar: () => void;
  totalCompleto: string;
  totalMesaBruto: string;
}

export function BotoesAcao({
  onSalvar,
  onLimpar,
  totalCompleto,
  totalMesaBruto,
}: BotoesAcaoProps) {
  const compartilharConta = () => {
    Share.share({
      message: `💰 Racha Conta\nIndividual: R$ ${totalCompleto}\nTotal Mesa: R$ ${totalMesaBruto}`,
    });
  };

  return (
    <View style={styles.actionRow}>
      <TouchableOpacity
        style={[styles.btnAction, { backgroundColor: "#2196f3" }]}
        onPress={onSalvar}
      >
        <Text style={styles.btnText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btnAction, { backgroundColor: "#ff9800" }]}
        onPress={onLimpar}
      >
        <Text style={styles.btnText}>Limpar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btnAction, { backgroundColor: "#25D366" }]}
        onPress={compartilharConta}
      >
        <Text style={styles.btnText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 25,
  },
  btnAction: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 3,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
