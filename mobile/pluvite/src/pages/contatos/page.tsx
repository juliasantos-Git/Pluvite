import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Contatos() {
  const contatos = [
    {
      nome: "Defesa Civil",
      numero: "199",
      cor: "#2563eb",
      descricao: "Emergências relacionadas a desastres naturais",
      icone: "🛡️",
    },
    {
      nome: "Bombeiros",
      numero: "193",
      cor: "#ef4444",
      descricao: "Resgates e situações de perigo imediato",
      icone: "🚒",
    },
    {
      nome: "SAMU",
      numero: "192",
      cor: "#10b981",
      descricao: "Emergências médicas e primeiros socorros",
      icone: "🚑",
    },
    {
      nome: "Polícia Militar",
      numero: "190",
      cor: "#0d1b54",
      descricao: "Ocorrências policiais e segurança pública",
      icone: "👮",
    },
  ];

  const ligar = (numero: string) => {
    Linking.openURL(`tel:${numero}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📞</Text>
          <Text style={styles.title}>Contatos de Emergência</Text>
          <Text style={styles.subtitle}>
            Acesso rápido aos principais serviços de emergência
          </Text>
        </View>

        {/* Aviso */}
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>⚠️ Em Perigo Iminente?</Text>
          <Text style={styles.alertText}>
            Ligue diretamente para os números de emergência abaixo.
          </Text>
        </View>

        {/* Cards */}
        {contatos.map((contato, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: contato.cor },
                ]}
              >
                <Text style={styles.icon}>{contato.icone}</Text>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.nome}>{contato.nome}</Text>
                <Text style={styles.descricao}>
                  {contato.descricao}
                </Text>

                <Text style={styles.disponivel}>
                  🕒 24h • Sempre disponível
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.callButton,
                { backgroundColor: contato.cor },
              ]}
              onPress={() => ligar(contato.numero)}
            >
              <Text style={styles.callButtonText}>
                📞 {contato.numero}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
  },

  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  headerIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0d1b54",
  },

  subtitle: {
    marginTop: 5,
    color: "#64748b",
    textAlign: "center",
    fontSize: 14,
  },

  alertBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  alertTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dc2626",
    marginBottom: 5,
  },

  alertText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    marginBottom: 18,
  },

  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 28,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },

  nome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },

  descricao: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  disponivel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 6,
  },

  callButton: {
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  callButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});