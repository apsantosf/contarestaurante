# Racha Conta 🍽️

Uma calculadora inteligente e dinâmica desenvolvida em **React Native** com **Expo Router** para facilitar a divisão de contas de restaurantes, bares e eventos. O aplicativo soluciona um problema real do dia a dia: dividir a conta de forma justa quando nem todas as pessoas consomem ou pagam a taxa de serviço (gorjeta).

---

## 🚀 Diferenciais & Recursos Inteligentes

- **Fluxo de Teclado Fluido (UX)**: O cursor avança automaticamente para o próximo campo ao pressionar `Enter`. No último campo, ele retorna ao início, criando um ciclo contínuo de digitação rápida.
- **Substituição Inteligente no Foco**: Ao clicar ou focar em qualquer campo numérico, o valor padrão anterior é selecionado automaticamente. Se você começar a digitar, o valor antigo some instantaneamente, eliminando a necessidade de apagar caractere por caractere.
- **Divisão Avançada de Gorjetas**: Permite calcular cenários complexos onde:
  - Um grupo de pessoas divide o consumo total.
  - Apenas uma parte desse grupo paga a taxa de serviço.
  - Pessoas extras participam compartilhando _apenas_ o valor da gorjeta.
- **Histórico Detalhado Permanente**: Salva os últimos 10 cálculos realizados utilizando armazenamento local seguro (`AsyncStorage`). O histórico é persistido mesmo se o aplicativo ou a página forem recarregados.
- **Visão Analítica no Histórico**: Cada item salvo mostra a data, o total bruto da mesa, o valor final por pessoa e um detalhamento isolado de quanto foi pago estritamente por consumo e por gorjeta.
- **Remoção de Elementos Nativos**: Interface limpa e customizada, com cabeçalhos nativos ocultados para dar destaque total à experiência do usuário.
- **Sistema de Compartilhamento**: Botão nativo para enviar o resumo do racha diretamente para amigos via WhatsApp ou outras redes.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** & **TypeScript**
- **Expo / Expo Router** (Arquitetura baseada em arquivos)
- **Expo Vector Icons** (Componentes visuais de ícones)
- **AsyncStorage** (Persistência de dados local no dispositivo)

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter o **Node.js** instalado em sua máquina.

### 1. Clonar o repositório

```bash
git clone https://github.com
cd contarestaurante
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Executar o projeto na Web

```

### 3. Executar o projeto na Web

```bash
npx expo start --web
```

---

## 📦 Como Gerar o Instalador Nativo (.apk)

Este projeto está totalmente configurado para compilação em nuvem utilizando o **EAS Build**. Para gerar um novo instalador para Android (formato APK):

1. Instale a CLI do EAS globalmente: `npm install -g eas-cli`
2. Faça login na sua conta Expo: `eas login`
3. Execute o comando de compilação:

   ```bash
   eas build --platform android --profile preview
   ```

Ao final do processo, basta escanear o QR Code gerado pelo terminal ou baixar o artefato pelo painel web do Expo.
