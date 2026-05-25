import React from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BotoesAcaoProps {
  onSalvar: () => void;
  onLimpar: () => void;
  totalMesaBruto: string;
  totalCompleto: string;
  totalSoGorjeta: string;
  totalPessoas: string;
  pessoasApenasGorjeta: string;
}

export function BotoesAcao({
  onSalvar,
  onLimpar,
  totalMesaBruto,
  totalCompleto,
  totalSoGorjeta,
  totalPessoas,
  pessoasApenasGorjeta,
}: BotoesAcaoProps) {
  const compartilharConta = () => {
    // Tratando o texto para plural/singular de forma inteligente
    const textoPessoasConsumo =
      parseInt(totalPessoas) === 1 ? "pessoa" : "pessoas";
    const textoPessoasExtras =
      parseInt(pessoasApenasGorjeta) === 1 ? "pessoa" : "pessoas";

    // Montando a mensagem estruturada com formatação para o WhatsApp
    const mensagem =
      `💰 *Racha Conta — Resumo da Mesa*\n\n` +
      `📊 *Geral:*\n` +
      `• Total da Mesa (com taxa): R$ ${totalMesaBruto}\n\n` +
      `🍽️ *Quem Consumiu:*\n` +
      `• Individual (Consumo + Gorjeta): R$ ${totalCompleto}\n` +
      `• Quantidade: ${totalPessoas} ${textoPessoasConsumo}\n\n` +
      `💸 *Extras (Apenas Gorjeta):*\n` +
      `• Valor da Gorjeta Individual: R$ ${totalSoGorjeta}\n` +
      `• Quantidade: ${pessoasApenasGorjeta} ${textoPessoasExtras}`;

    Share.share({
      message: mensagem,
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
