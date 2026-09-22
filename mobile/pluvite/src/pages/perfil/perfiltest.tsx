import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Perfil from "./Perfil";
import { supabase } from "../lib/supabase";

const mockNavigation = {
  reset: jest.fn(),
  navigate: jest.fn(),
} as any;

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: "user-123", email: "maria@teste.com" } },
      }),
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: "user-123", email: "maria@teste.com" } } },
      }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: {
          nome_completo: "Maria Silva",
          telefone: "(12) 99999-9999",
          cidade: "Taubaté",
          bairro: "Três Marias",
          cep: "12000-000",
        },
        error: null,
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }),
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: "https://exemplo.com/avatar.jpg" },
        }),
      }),
    },
  },
}));

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true }),
  MediaTypeOptions: { Images: "Images" },
}));

jest.mock("expo-file-system/legacy", () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { Base64: "base64" },
}));

jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockIcon = (props: any) => <View {...props} />;
  return {
    User: MockIcon,
    MapPin: MockIcon,
    HeartPulse: MockIcon,
    Bell: MockIcon,
    Shield: MockIcon,
    Accessibility: MockIcon,
    LogOut: MockIcon,
    Pencil: MockIcon,
    X: MockIcon,
    Save: MockIcon,
    Phone: MockIcon,
  };
});

describe("Automação da Tela de Perfil", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve carregar e exibir as informações do perfil vindas do banco", async () => {
    const { getByText } = render(
      <Perfil navigation={mockNavigation} route={{} as any} />
    );

    await waitFor(() => {
      expect(getByText("Maria Silva")).toBeTruthy();
      expect(getByText("maria@teste.com")).toBeTruthy();
      expect(getByText("Taubaté")).toBeTruthy();
    });
  });

  it("deve permitir alternar entre as abas de seção do perfil", async () => {
    const { getByText } = render(
      <Perfil navigation={mockNavigation} route={{} as any} />
    );

    await waitFor(() => expect(getByText("Meus Dados")).toBeTruthy());

    const abaEmergencia = getByText("Emergência");
    fireEvent.press(abaEmergencia);

    expect(abaEmergencia).toBeTruthy();
  });

  it("deve disparar a ação de logout e redirecionar ao clicar em Sair da conta", async () => {
    const { getByText } = render(
      <Perfil navigation={mockNavigation} route={{} as any} />
    );

    await waitFor(() => expect(getByText("Sair da conta")).toBeTruthy());

    const botaoSair = getByText("Sair da conta");
    fireEvent.press(botaoSair);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
  });
});