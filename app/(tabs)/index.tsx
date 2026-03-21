import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ResultCard } from "../../src/components/ResultCard";

interface HistoricoItem {
  id: string;
  data: string;
  valor: string;
}

export default function HomeScreen() {
  const [conta, setConta] = useState("");
  const [porcentagem, setPorcentagem] = useState("10");
  const [totalPessoas, setTotalPessoas] = useState("1");
  const [pessoasGorjeta, setPessoasGorjeta] = useState("1");
  const [pessoasApenasGorjeta, setPessoasApenasGorjeta] = useState("0");
  const [busca, setBusca] = useState("");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const aplicarMascaraMoeda = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return (Number(apenasNumeros) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const res = useMemo(() => {
    const valorLimpo = conta.replace(/\./g, "").replace(",", ".");
    const vConta = parseFloat(valorLimpo) || 0;
    const vTaxa = parseFloat(porcentagem) || 0;

    const nPessoasConsumo = Math.max(parseInt(totalPessoas) || 1, 1);
    const nPessoasPagamGorjeta = Math.max(parseInt(pessoasGorjeta) || 0, 0);
    const nExtrasGorjeta = Math.max(parseInt(pessoasApenasGorjeta) || 0, 0);

    const valorGorjetaMesa = vConta * (vTaxa / 100);
    const valorTotalMesaComTaxa = vConta + valorGorjetaMesa;

    const divisaoBase = vConta / nPessoasConsumo;
    const totalDivisoresGorjeta = nPessoasPagamGorjeta + nExtrasGorjeta;
    const gorjetaIndividual =
      totalDivisoresGorjeta > 0 ? valorGorjetaMesa / totalDivisoresGorjeta : 0;
    const totalFinalIndividual = divisaoBase + gorjetaIndividual;

    return {
      totalMesaBruto: valorTotalMesaComTaxa.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalCompleto: totalFinalIndividual.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalSoConsumo: divisaoBase.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalSoGorjeta: gorjetaIndividual.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      mostrarSoConsumo: nPessoasConsumo > 0,
      mostrarSoGorjeta: totalDivisoresGorjeta > 0,
    };
  }, [conta, porcentagem, totalPessoas, pessoasGorjeta, pessoasApenasGorjeta]);

  const carregarHistorico = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@historico_contas");
      if (jsonValue) setHistorico(JSON.parse(jsonValue));
    } catch (e) {
      console.error(e);
    }
  };

  const salvarNoHistorico = async () => {
    if (!conta || conta === "0,00") return;
    const novo = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString("pt-BR"),
      valor: res.totalCompleto,
    };
    const lista = [novo, ...historico].slice(0, 10);
    setHistorico(lista);
    await AsyncStorage.setItem("@historico_contas", JSON.stringify(lista));
  };

  const excluirItem = async (id: string) => {
    const lista = historico.filter((i) => i.id !== id);
    setHistorico(lista);
    await AsyncStorage.setItem("@historico_contas", JSON.stringify(lista));
  };

  return (
    <View style={styles.webWrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Racha Conta 🍽️</Text>

          <Text style={styles.label}>Valor Total da Conta (R$)</Text>
          <TextInput
            style={styles.input}
            value={conta}
            onChangeText={(t) => setConta(aplicarMascaraMoeda(t))}
            keyboardType="numeric"
            placeholder="0,00"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Pessoas (Consumo)</Text>
              <TextInput
                style={styles.input}
                value={totalPessoas}
                onChangeText={setTotalPessoas}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Taxa Serviço (%)</Text>
              <TextInput
                style={styles.input}
                value={porcentagem}
                onChangeText={setPorcentagem}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Pagam Gorjeta</Text>
              <TextInput
                style={styles.input}
                value={pessoasGorjeta}
                onChangeText={setPessoasGorjeta}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Extras (Só Gorjeta)</Text>
              <TextInput
                style={[styles.input, { borderColor: "#4caf50" }]}
                value={pessoasApenasGorjeta}
                onChangeText={setPessoasApenasGorjeta}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.resumoMesa}>
            <Text style={styles.resumoLabel}>
              VALOR TOTAL DA MESA (COM TAXA)
            </Text>
            <Text style={styles.resumoValor}>R$ {res.totalMesaBruto}</Text>
          </View>

          <ResultCard {...res} />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: "#2196f3" }]}
              onPress={salvarNoHistorico}
            >
              <Text style={styles.btnText}>💾 Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: "#25D366" }]}
              onPress={() =>
                Share.share({
                  message: `📊 Racha Conta\nIndividual: R$ ${res.totalCompleto}\nTotal Mesa: R$ ${res.totalMesaBruto}`,
                })
              }
            >
              <Text style={styles.btnText}>📤 Enviar</Text>
            </TouchableOpacity>
          </View>

          {historico.length > 0 && (
            <View style={styles.sectionHistorico}>
              <Text style={styles.subTitle}>Últimos Cálculos</Text>
              {historico.map((item) => (
                <View key={item.id} style={styles.itemHistorico}>
                  <View>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      {item.data}
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>R$ {item.valor}</Text>
                  </View>
                  <TouchableOpacity onPress={() => excluirItem(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: "#e9ecef",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: "#f8f9fa",
    width: Platform.OS === "web" ? 420 : "100%",
    alignSelf: "center",
    borderRadius: Platform.OS === "web" ? 20 : 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 13, marginBottom: 5, color: "#555", fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  resumoMesa: {
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
  },
  resumoLabel: {
    fontSize: 10,
    color: "#6c757d",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  resumoValor: { fontSize: 20, fontWeight: "bold", color: "#343a40" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  btnAction: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  sectionHistorico: { marginTop: 30 },
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  itemHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
});
