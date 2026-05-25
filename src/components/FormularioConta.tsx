import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface FormularioContaProps {
  conta: string;
  setConta: (t: string) => void;
  totalPessoas: string;
  alterarPessoasConsumo: (t: string) => void;
  porcentagem: string;
  setPorcentagem: (t: string) => void;
  pessoasGorjeta: string;
  setPessoasGorjeta: (t: string) => void;
  pessoasApenasGorjeta: string;
  setPessoasApenasGorjeta: (t: string) => void;
  refs: {
    inputContaRef: React.RefObject<TextInput | null>;
    inputTotalPessoasRef: React.RefObject<TextInput | null>;
    inputPorcentagemRef: React.RefObject<TextInput | null>;
    inputPessoasGorjetaRef: React.RefObject<TextInput | null>;
    inputExtrasGorjetaRef: React.RefObject<TextInput | null>;
  };
}

export function FormularioConta({
  conta,
  setConta,
  totalPessoas,
  alterarPessoasConsumo,
  porcentagem,
  setPorcentagem,
  pessoasGorjeta,
  setPessoasGorjeta,
  pessoasApenasGorjeta,
  setPessoasApenasGorjeta,
  refs,
}: FormularioContaProps) {
  return (
    <View>
      <Text style={styles.label}>Valor Total da Conta (R$)</Text>
      <TextInput
        ref={refs.inputContaRef}
        style={styles.input}
        value={conta}
        onChangeText={setConta}
        keyboardType="numeric"
        placeholder="0,00"
        returnKeyType="next"
        onSubmitEditing={() => refs.inputTotalPessoasRef.current?.focus()}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Pessoas (Consumo)</Text>
          <TextInput
            ref={refs.inputTotalPessoasRef}
            style={styles.input}
            value={totalPessoas}
            onChangeText={alterarPessoasConsumo}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => refs.inputPorcentagemRef.current?.focus()}
            selectTextOnFocus
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Taxa Serviço (%)</Text>
          <TextInput
            ref={refs.inputPorcentagemRef}
            style={styles.input}
            value={porcentagem}
            onChangeText={setPorcentagem}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => refs.inputPessoasGorjetaRef.current?.focus()}
            selectTextOnFocus
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Pagam Gorjeta</Text>
          <TextInput
            ref={refs.inputPessoasGorjetaRef}
            style={styles.input}
            value={pessoasGorjeta}
            onChangeText={setPessoasGorjeta}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => refs.inputExtrasGorjetaRef.current?.focus()}
            selectTextOnFocus
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Extras (Só Gorjeta)</Text>
          <TextInput
            ref={refs.inputExtrasGorjetaRef}
            style={[styles.input, { borderColor: "#4caf50" }]}
            value={pessoasApenasGorjeta}
            onChangeText={setPessoasApenasGorjeta}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => refs.inputContaRef.current?.focus()}
            selectTextOnFocus
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  row: { flexDirection: "row", justifyContent: "space-between" },
});
