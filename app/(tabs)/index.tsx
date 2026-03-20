import React, { useMemo, useState } from "react";
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
  // NOVO ESTADO: Pessoas que só pagam gorjeta
  const [pessoasApenasGorjeta, setPessoasApenasGorjeta] = useState("0");

  const res = useMemo(() => {
    const vConta = parseFloat(String(conta).replace(",", ".")) || 0;
    const vTaxa = parseFloat(String(porcentagem)) || 0;
    const nPessoasMesa = Math.max(parseInt(String(totalPessoas)) || 1, 1);
    const nPessoasPagamGorjeta = parseInt(String(pessoasGorjeta)) || 0;
    const nExtrasGorjeta = parseInt(String(pessoasApenasGorjeta)) || 0;

    // 1. Valor base para quem consumiu
    const divisaoBase = vConta / nPessoasMesa;

    // 2. Valor total da gorjeta
    const valorGorjetaTotal = vConta * (vTaxa / 100);

    // 3. Quem divide a gorjeta: (Quem consumiu e aceitou) + (Quem só quer contribuir)
    const totalDivisoresGorjeta = nPessoasPagamGorjeta + nExtrasGorjeta;
    const gorjetaIndividual =
      totalDivisoresGorjeta > 0 ? valorGorjetaTotal / totalDivisoresGorjeta : 0;

    return {
      totalCompleto: (divisaoBase + gorjetaIndividual).toFixed(2), // Consumiu + Gorjeta
      totalSoConsumo: divisaoBase.toFixed(2), // Só Consumiu
      totalSoGorjeta: gorjetaIndividual.toFixed(2), // Só Gorjeta (o extra)
      mostrarSoConsumo: nPessoasMesa > nPessoasPagamGorjeta,
      mostrarSoGorjeta: nExtrasGorjeta > 0,
    };
  }, [conta, porcentagem, totalPessoas, pessoasGorjeta, pessoasApenasGorjeta]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Racha Conta 🍽️</Text>

      <Text style={styles.label}>Valor da Conta (R$)</Text>
      <TextInput
        style={styles.input}
        value={conta}
        onChangeText={setConta}
        keyboardType="numeric"
        placeholder="0.00"
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Gorjeta (%)</Text>
          <TextInput
            style={styles.input}
            value={porcentagem}
            onChangeText={setPorcentagem}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Extras na Gorjeta</Text>
          <TextInput
            style={[styles.input, { borderColor: "#4caf50" }]}
            value={pessoasApenasGorjeta}
            onChangeText={setPessoasApenasGorjeta}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Total Pessoas (Mesa)</Text>
          <TextInput
            style={styles.input}
            value={totalPessoas}
            onChangeText={setTotalPessoas}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Mesa paga Gorjeta?</Text>
          <TextInput
            style={styles.input}
            value={pessoasGorjeta}
            onChangeText={setPessoasGorjeta}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          Quem consome + gorjeta:{" "}
          <Text style={styles.bold}>R$ {res.totalCompleto}</Text>
        </Text>

        {res.mostrarSoConsumo && (
          <Text style={styles.resultText}>
            Quem só consome:{" "}
            <Text style={[styles.bold, { color: "#666" }]}>
              R$ {res.totalSoConsumo}
            </Text>
          </Text>
        )}

        {res.mostrarSoGorjeta && (
          <View style={styles.extraBox}>
            <Text style={styles.extraText}>
              Contribuidor extra paga:{" "}
              <Text style={styles.bold}>R$ {res.totalSoGorjeta}</Text>
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: "#f5f5f5",
    ...Platform.select({
      web: { maxWidth: 500, alignSelf: "center", width: "100%" },
    }),
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 14, marginBottom: 5, color: "#555" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  resultBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#e3f2fd",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2196f3",
  },
  resultText: { fontSize: 16, marginBottom: 8 },
  extraBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#bbdefb",
  },
  extraText: { fontSize: 16, color: "#2e7d32" },
  bold: { fontWeight: "bold", color: "#2196f3" },
});
