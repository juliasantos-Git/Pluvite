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

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 1.6;

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        Alert.alert("Erro", "E-mail ou senha incorretos!");
        setSenha("");
        return;
      }

      Alert.alert("Sucesso", "Login efetuado!");
      // Aqui você navega para o Mapa
    } catch (error) {
      Alert.alert("Erro", "Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSocialLogin = (plataforma: string) => {
    Alert.alert("Login Social", `Conectando com o ${plataforma}...`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
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
          {/* Input Email */}
          <TextInput
            style={styles.input}
            placeholder="E-mail institucional ou pessoal"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          {/* Input Senha */}
          <TextInput
            style={styles.input}
            placeholder="Sua senha"
            placeholderTextColor="#94a3b8"
            secureTextEntry={true}
            autoCapitalize="none"
            value={senha}
            onChangeText={setSenha}
          />

          {/* Esqueci minha senha no Canto Esquerdo */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
          </TouchableOpacity>

          {/* Botão de Entrar */}
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonPrimaryText}>Entrar</Text>
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
            onPress={() => handleSocialLogin("Facebook")}
          >
            <Image
              source={{ uri: "https://img.icons8.com/color/48/facebook.png" }}
              style={styles.socialIcon}
            />
            <Text style={styles.textFacebook}>Continuar com o Facebook</Text>
          </TouchableOpacity>

          {/* Botão Google (Branco com borda cinza e ícone colorido) */}
          <TouchableOpacity
            style={[styles.buttonSocialBase, styles.buttonGoogleStructure]}
            onPress={() => handleSocialLogin("Google")}
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

        {/* Opção de Cadastro no Final da Tela */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Em breve", "Tela de cadastro em construção!")
            }
          >
            <Text style={styles.subtitle}>
              Não tem uma conta?{" "}
              <Text style={styles.linkText}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#1447c4",
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
    marginTop: 4,
  },
  form: {
    width: "100%",
    paddingHorizontal: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 5,
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
    marginBottom: 14,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginTop: -4,
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#1447c4",
    fontWeight: "600",
  },
  buttonPrimary: {
    width: "100%",
    height: 54,
    backgroundColor: "#1447c4",
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

  /* --- MUDANÇAS APENAS NOS BOTÕES SOCIAIS ABAIXO --- */
  buttonSocialBase: {
    width: "100%",
    height: 54,
    borderRadius: 12, // Bordas ligeiramente mais suaves para combinar com o padrão das marcas
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonFacebookStructure: {
    backgroundColor: "#1877f2", // Azul oficial do Facebook
  },
  buttonGoogleStructure: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1.5,
    marginBottom: 10,
  },
  socialIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    position: "absolute",
    left: 20, // Mantém os ícones travados perfeitamente no canto esquerdo interno
  },
  textFacebook: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    width: "100%",
    textAlign: "center",
  },
  textGoogle: {
    color: "#5e6d82", // Tom cinza escuro para o texto do Google conforme a imagem
    fontSize: 15,
    fontWeight: "600",
    width: "100%",
    textAlign: "center",
  },
  /* ------------------------------------------------ */

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
