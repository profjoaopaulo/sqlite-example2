import { Drawer } from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer screenOptions={{ headerShown: true, drawerActiveTintColor: '#6200ee' }}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Cadastrar Pet',
          title: 'Novo Pet',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="paw" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="lista"
        options={{
          drawerLabel: 'Meus Pets',
          title: 'Lista de Pets',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="format-list-bulleted" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="sobre"
        options={{
          drawerLabel: 'Sobre',
          title: 'Sobre o App',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="information" size={24} color={color} />,
        }}
      />
    </Drawer>
  );
}
