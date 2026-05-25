import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Nossos novos componentes limpos
import Constants from "expo-constants";
import { BotoesAcao } from "../../src/components/BotoesAcao";
import { FormularioConta } from "../../src/components/FormularioConta";
import { ItemHistorico } from "../../src/components/ItemHistorico";
import { ResultCard } from "../../src/components/ResultCard";

interface HistoricoItem {
  id: string;
  data: string;
  valorTotalMesa: string;
  valorIndividual: string;
  valorSoConsumo: string;
  valorSoGorjeta: string;
  detalhes: string;
}

export default function HomeScreen() {
  const [conta, setConta] = useState("");
  const [porcentagem, setPorcentagem] = useState("10");
  const [totalPessoas, setTotalPessoas] = useState("1");
  const [pessoasGorjeta, setPessoasGorjeta] = useState("1");
  const [pessoasApenasGorjeta, setPessoasApenasGorjeta] = useState("0");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  // Referências agrupadas em um objeto limpo
  const refs = {
    inputContaRef: useRef<TextInput>(null),
    inputPorcentagemRef: useRef<TextInput>(null),
    inputTotalPessoasRef: useRef<TextInput>(null),
    inputPessoasGorjetaRef: useRef<TextInput>(null),
    inputExtrasGorjetaRef: useRef<TextInput>(null),
  };

  useEffect(() => {
    carregarHistorico();
    setTimeout(() => refs.inputContaRef.current?.focus(), 100);
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
    refs.inputContaRef.current?.focus();
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

    const textoDescricao = `${totalPessoas}p consumo • Taxa: ${porcentagem}% • ${pessoasGorjeta}p gorjeta • +${pessoasApenasGorjeta} extras`;
    const novo: HistoricoItem = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString("pt-BR"),
      valorTotalMesa: res.totalMesaBruto,
      valorIndividual: res.totalCompleto,
      valorSoConsumo: res.totalSoConsumo,
      valorSoGorjeta: res.totalSoGorjeta,
      detalhes: textoDescricao,
    };

    const listaAtualizada = [novo, ...historico].slice(0, 10);
    setHistorico(listaAtualizada);
    await AsyncStorage.setItem(
      "@historico_contas",
      JSON.stringify(listaAtualizada),
    );
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

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Racha Conta 🍽️</Text>
            <Text style={styles.txtVersaoTop}>
              v{Constants.expoConfig?.version || "1.0.0"}
            </Text>
          </View>

          {/* Chamando os subcomponentes organizados e passando as props */}
          <FormularioConta
            conta={conta}
            setConta={(t) => setConta(aplicarMascaraMoeda(t))}
            totalPessoas={totalPessoas}
            alterarPessoasConsumo={alterarPessoasConsumo}
            porcentagem={porcentagem}
            setPorcentagem={setPorcentagem}
            pessoasGorjeta={pessoasGorjeta}
            setPessoasGorjeta={setPessoasGorjeta}
            pessoasApenasGorjeta={pessoasApenasGorjeta}
            setPessoasApenasGorjeta={setPessoasApenasGorjeta}
            refs={refs}
          />

          <View style={styles.resumoMesa}>
            <Text style={styles.resumoLabel}>
              VALOR TOTAL DA MESA (COM TAXA)
            </Text>
            <Text style={styles.resumoValor}>R$ {res.totalMesaBruto}</Text>
          </View>

          <ResultCard {...res} />

          <BotoesAcao
            onSalvar={salvarNoHistorico}
            onLimpar={limparCampos}
            totalMesaBruto={res.totalMesaBruto}
            totalCompleto={res.totalCompleto}
            totalSoGorjeta={res.totalSoGorjeta} // Passando o valor da gorjeta calculado no useMemo
            totalPessoas={totalPessoas} // Passando o estado de pessoas do consumo
            pessoasApenasGorjeta={pessoasApenasGorjeta} // Passando o estado de pessoas extras
          />

          {historico.length > 0 && (
            <View style={styles.sectionHistorico}>
              <Text style={styles.subTitle}>Últimos Cálculos</Text>
              {historico.map((item) => (
                <ItemHistorico
                  key={item.id}
                  item={item}
                  onExcluir={excluirItem}
                />
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 25, // Dá um espaço confortável antes do formulário
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  txtVersaoTop: {
    fontSize: 13,
    color: "#888888", // Um cinza suave para não brigar com o título
    fontWeight: "600",
    marginTop: 2, // Cola o número logo abaixo do texto
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
});
