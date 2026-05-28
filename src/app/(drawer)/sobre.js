import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Card } from 'react-native-paper';

export default function SobreScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Avatar.Icon size={80} icon="application-brackets" />
          <Text variant="headlineSmall" style={{ marginTop: 16 }}>PetManager App</Text>
          <Text variant="bodyMedium" style={{ color: 'gray' }}>Versão 1.0.0</Text>
        </View>
        <Card.Content>
          <Text variant="bodyLarge" style={{ textAlign: 'center', marginTop: 10 }}>
            Aplicativo desenvolvido com React Native, Expo Router (Drawer) e Expo SQLite para gerenciar cadastros de animais de estimação.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  card: { paddingVertical: 20, borderRadius: 16 },
  header: { alignItems: 'center', marginBottom: 10 }
});
