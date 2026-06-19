import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 1.6;

type Props = NativeStackScreenProps<RootStackParamList, "Cadastro">;

export default function Cadastro({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) {
        Alert.alert("Erro", error.message);
        return;
      }

      const { error: erroPerfil } = await supabase.from("cidadao").insert({
        auth_id: data.user?.id,
        nome_completo: nome,
        email,
      });

      if (erroPerfil) {
        Alert.alert("Erro", "Erro ao salvar perfil: " + erroPerfil.message);
        return;
      }

      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSocialCadastro = (plataforma: string) => {
    Alert.alert("Login Social", `Conectando com o ${plataforma}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Efeito Meio Círculo Perfeito no Topo */}
        <View style={styles.topWaveContainer}>
          <View style={styles.waveBackground} />
        </View>

        {/* Logo Centralizada na linha do Meio Círculo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/PluviteIcon.jpg")}
            style={styles.logoImage}
            resizeMode="cover"
          />
          <Text style={styles.plataformaText}>PLATAFORMA PLUVITE</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {/* Input Nome */}
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#64748b"
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            value={nome}
            onChangeText={setNome}
          />

          {/* Input Email */}
          <TextInput
            style={styles.input}
            placeholder="E-mail institucional ou pessoal"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          {/* Input Senha */}
          <TextInput
            style={styles.input}
            placeholder="Criar uma senha"
            placeholderTextColor="#64748b"
            secureTextEntry={true}
            autoCapitalize="none"
            value={senha}
            onChangeText={setSenha}
          />
          {/* Input Confirmar Senha */}
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#64748b"
            secureTextEntry={true}
            autoCapitalize="none"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          {/* Botão de Entrar */}
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divisor Moderno */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>CONECTAR-SE COM</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botões Sociais Ajustados para o Modelo Exato da Imagem */}
        <View style={styles.socialVerticalContainer}>
          {/* Botão Facebook (Azul com ícone branco) */}
          <TouchableOpacity
            style={[styles.buttonSocialBase, styles.buttonFacebookStructure]}
            onPress={() => handleSocialCadastro("Facebook")}
          >
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/ffffff/facebook-f.png" }}
              style={styles.socialIcon}
            />
            <Text style={styles.textFacebook}>Continuar com o Facebook</Text>
          </TouchableOpacity>

          {/* Botão Google (Branco com borda cinza e ícone colorido) */}
          <TouchableOpacity
            style={[styles.buttonSocialBase, styles.buttonGoogleStructure]}
            onPress={() => handleSocialCadastro("Google")}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/google-logo.png",
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.textGoogle}>Continuar com o Google</Text>
          </TouchableOpacity>
        </View>

        {/* Opção de Login no Final da Tela */}
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.subtitle}>
              Já possui uma conta? <Text style={styles.linkText}>Entre</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topWaveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: "hidden",
    alignItems: "center",
  },
  waveBackground: {
    backgroundColor: "#0f35a0",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    top: -CIRCLE_SIZE + 180,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 130,
    marginBottom: 40,
  },
  logoImage: {
    width: 95,
    height: 95,
    borderRadius: 24,
    marginBottom: 15,
  },
  plataformaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1e2735",
    letterSpacing: 2.5,
  },
  form: {
    width: "100%",
    paddingHorizontal: 22,
  },
  input: {
    width: "100%",
    height: 54,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0f172a",
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#0f35a0",
    fontWeight: "600",
  },
  buttonPrimary: {
    width: "100%",
    height: 54,
    backgroundColor: "#0d1b54",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    fontSize: 11,
    color: "#94a3b8",
    paddingHorizontal: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  socialVerticalContainer: {
    width: "100%",
    paddingHorizontal: 22,
    gap: 15,
  },
  buttonSocialBase: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonFacebookStructure: {
    backgroundColor: "#0f35a0",
  },
  buttonGoogleStructure: {
    backgroundColor: "#e4e4e7",
    borderColor: "#d5dae0",
    borderWidth: 1.5,
    marginBottom: 10,
  },
  socialIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    position: "absolute",
    left: 20,
  },
  textFacebook: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    width: "100%",
    textAlign: "center",
  },
  textGoogle: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
    width: "100%",
    textAlign: "center",
  },
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
  },
  linkText: {
    color: "#1447c4",
    fontWeight: "700",
  },
});