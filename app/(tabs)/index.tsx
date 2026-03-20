import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const [conta, setConta] = useState("");
  const [porcentagem, setPorcentagem] = useState("10");
  const [totalPessoas, setTotalPessoas] = useState("1");
  const [pessoasGorjeta, setPessoasGorjeta] = useState("1");

  // Lógica de cálculo direta e segura
  const vConta = parseFloat(String(conta).replace(",", ".")) || 0;
  const vTaxa = parseFloat(String(porcentagem)) || 0;
  const nPessoas = Math.max(parseInt(String(totalPessoas)) || 1, 1);
  const nPessoasGorjeta = Math.max(parseInt(String(pessoasGorjeta)) || 0, 0);

  const valorGorjetaTotal = vConta * (vTaxa / 100);
  const divisaoBase = vConta / nPessoas;
  const gorjetaIndividual =
    nPessoasGorjeta > 0 ? valorGorjetaTotal / nPessoasGorjeta : 0;

  const totalComGorjeta = (divisaoBase + gorjetaIndividual).toFixed(2);
  const totalSemGorjeta = divisaoBase.toFixed(2);
  const mostrarSemGorjeta = nPessoas > nPessoasGorjeta && nPessoasGorjeta > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Racha Conta 🍽️</Text>

      <Text style={styles.label}>Valor da Conta (R$)</Text>
      <TextInput
        style={styles.input}
        value={String(conta)} // Força tratamento como String para a Web
        onChangeText={(t) => setConta(t.toString())}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gorjeta (%)</Text>
      <TextInput
        style={styles.input}
        value={String(porcentagem)}
        onChangeText={(t) => setPorcentagem(t.toString())}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Total Pessoas</Text>
          <TextInput
            style={styles.input}
            value={String(totalPessoas)}
            onChangeText={(t) => setTotalPessoas(t.toString())}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Pagando Gorjeta</Text>
          <TextInput
            style={styles.input}
            value={String(pessoasGorjeta)}
            onChangeText={(t) => setPessoasGorjeta(t.toString())}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          Quem paga gorjeta:
          <Text style={styles.bold}> R$ {totalComGorjeta}</Text>
        </Text>

        {mostrarSemGorjeta && (
          <Text style={styles.resultText}>
            Quem NÃO paga:
            <Text style={[styles.bold, { color: "#666" }]}>
              {" "}
              R$ {totalSemGorjeta}
            </Text>
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    backgroundColor: "#f5f5f5",
    ...Platform.select({
      web: { maxWidth: 500, alignSelf: "center", width: "100%" },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: { fontSize: 16, marginBottom: 5, color: "#555" },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  resultBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#e3f2fd",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2196f3",
  },
  resultText: { fontSize: 18, marginBottom: 10 },
  bold: { fontWeight: "bold", color: "#2196f3" },
});
