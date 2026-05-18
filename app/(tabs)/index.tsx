import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

  // Referências para controlar o foco de cada input
  const inputContaRef = useRef<TextInput>(null);
  const inputPorcentagemRef = useRef<TextInput>(null);
  const inputTotalPessoasRef = useRef<TextInput>(null);
  const inputPessoasGorjetaRef = useRef<TextInput>(null);
  const inputExtrasGorjetaRef = useRef<TextInput>(null);

  // Inicia o app focando automaticamente no primeiro campo de texto
  useEffect(() => {
    carregarHistorico();
    setTimeout(() => {
      inputContaRef.current?.focus();
    }, 100);
  }, []);

  const aplicarMascaraMoeda = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return (Number(apenasNumeros) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const alterarPessoasConsumo = (valor: string) => {
    setTotalPessoas(valor);
    setPessoasGorjeta(valor);
  };

  const limparCampos = () => {
    setConta("");
    setPorcentagem("10");
    setTotalPessoas("1");
    setPessoasGorjeta("1");
    setPessoasApenasGorjeta("0");
    inputContaRef.current?.focus();
  };

  const res = useMemo(() => {
    const valorLimpo = conta.replace(/\./g, "").replace(",", ".");
    const vConta = parseFloat(valorLimpo) || 0;
    const vTaxa = parseFloat(porcentagem) || 0;

    const nPessoasConsumo = Math.max(parseInt(totalPessoas, 10) || 1, 1);
    const nPessoasPagamGorjeta = Math.max(parseInt(pessoasGorjeta, 10) || 0, 0);
    const nExtrasGorjeta = Math.max(parseInt(pessoasApenasGorjeta, 10) || 0, 0);

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
    if (!conta || conta === "0,00" || conta === "0") return;

    const novo: HistoricoItem = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString("pt-BR"),
      valor: res.totalCompleto,
    };

    // Atualiza o estado e persiste de forma síncrona no armazenamento local
    const listaAtualizada = [novo, ...historico].slice(0, 10);
    setHistorico(listaAtualizada);
    await AsyncStorage.setItem(
      "@historico_contas",
      JSON.stringify(listaAtualizada),
    );

    setConta("");
    inputContaRef.current?.focus();
  };

  const excluirItem = async (id: string) => {
    const listaAtualizada = historico.filter((i) => i.id !== id);
    setHistorico(listaAtualizada);
    await AsyncStorage.setItem(
      "@historico_contas",
      JSON.stringify(listaAtualizada),
    );
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
            ref={inputContaRef}
            style={styles.input}
            value={conta}
            onChangeText={(t) => setConta(aplicarMascaraMoeda(t))}
            keyboardType="numeric"
            placeholder="0,00"
            returnKeyType="next"
            onSubmitEditing={() => inputTotalPessoasRef.current?.focus()}
            selectTextOnFocus={true}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Pessoas (Consumo)</Text>
              <TextInput
                ref={inputTotalPessoasRef}
                style={styles.input}
                value={totalPessoas}
                onChangeText={alterarPessoasConsumo}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => inputPorcentagemRef.current?.focus()}
                selectTextOnFocus={true}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Taxa Serviço (%)</Text>
              <TextInput
                ref={inputPorcentagemRef}
                style={styles.input}
                value={porcentagem}
                onChangeText={setPorcentagem}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => inputPessoasGorjetaRef.current?.focus()}
                selectTextOnFocus={true}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Pagam Gorjeta</Text>
              <TextInput
                ref={inputPessoasGorjetaRef}
                style={styles.input}
                value={pessoasGorjeta}
                onChangeText={setPessoasGorjeta}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => inputExtrasGorjetaRef.current?.focus()}
                selectTextOnFocus={true}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Extras (Só Gorjeta)</Text>
              <TextInput
                ref={inputExtrasGorjetaRef}
                style={[styles.input, { borderColor: "#4caf50" }]}
                value={pessoasApenasGorjeta}
                onChangeText={setPessoasApenasGorjeta}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => inputContaRef.current?.focus()} // Voltar ao início ao clicar enter
                selectTextOnFocus={true}
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
              style={[styles.btnAction, { backgroundColor: "#ff9800" }]}
              onPress={limparCampos}
            >
              <Text style={styles.btnText}>Base 🧹 Limpar</Text>
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
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumoMesa: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  resumoLabel: {
    fontSize: 11,
    color: "#2e7d32",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  resumoValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
    marginTop: 5,
  },
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
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  sectionHistorico: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    paddingTop: 15,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#495057",
  },
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
});
