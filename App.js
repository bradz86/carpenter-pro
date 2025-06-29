import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import CalculatorsScreen from './src/screens/CalculatorsScreen';
import EstimatorScreen from './src/screens/EstimatorScreen';
import MaterialsScreen from './src/screens/MaterialsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import calculator screens
import BoardFeetCalculator from './src/components/calculators/BoardFeetCalculator';
import ConcreteCalculator from './src/components/calculators/ConcreteCalculator';
import FramingCalculator from './src/components/calculators/FramingCalculator';
import DrywallCalculator from './src/components/calculators/DrywallCalculator';
import RoofingCalculator from './src/components/calculators/RoofingCalculator';
import StairCalculator from './src/components/calculators/StairCalculator';
import DeckCalculator from './src/components/calculators/DeckCalculator';
import InsulationCalculator from './src/components/calculators/InsulationCalculator';

// Import database
import { initDatabase } from './src/utils/database';

// Import theme
import { theme } from './src/styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Calculator Stack Navigator
function CalculatorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2c3e50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CalculatorsList" 
        component={CalculatorsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BoardFeetCalculator" 
        component={BoardFeetCalculator}
        options={{ title: 'Board Feet Calculator' }}
      />
      <Stack.Screen 
        name="ConcreteCalculator" 
        component={ConcreteCalculator}
        options={{ title: 'Concrete Calculator' }}
      />
      <Stack.Screen 
        name="FramingCalculator" 
        component={FramingCalculator}
        options={{ title: 'Framing Calculator' }}
      />
      <Stack.Screen 
        name="DrywallCalculator" 
        component={DrywallCalculator}
        options={{ title: 'Drywall Calculator' }}
      />
      <Stack.Screen 
        name="RoofingCalculator" 
        component={RoofingCalculator}
        options={{ title: 'Roofing Calculator' }}
      />
      <Stack.Screen 
        name="StairCalculator" 
        component={StairCalculator}
        options={{ title: 'Stair Calculator' }}
      />
      <Stack.Screen 
        name="DeckCalculator" 
        component={DeckCalculator}
        options={{ title: 'Deck Calculator' }}
      />
      <Stack.Screen 
        name="InsulationCalculator" 
        component={InsulationCalculator}
        options={{ title: 'Insulation Calculator' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await initDatabase();
      
      // Load any cached data
      const cachedMaterials = await AsyncStorage.getItem('materials');
      if (cachedMaterials) {
        // Materials will be loaded in the MaterialsScreen
      }
      
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null; // Could add a splash screen here
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#3498db',
              tabBarInactiveTintColor: '#7f8c8d',
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#ecf0f1',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
              },
              headerStyle: {
                backgroundColor: '#2c3e50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Tab.Screen 
              name="Calculators" 
              component={CalculatorStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="calculator" size={size} color={color} />
                ),
                headerTitle: '🔨 Carpenter Pro - Calculators',
              }}
            />
            <Tab.Screen 
              name="Estimator" 
              component={EstimatorScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="file-document-outline" size={size} color={color} />
                ),
                headerTitle: '🔨 Carpenter Pro - Estimator',
              }}
            />
            <Tab.Screen 
              name="Materials" 
              component={MaterialsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="package-variant" size={size} color={color} />
                ),
                headerTitle: '🔨 Carpenter Pro - Materials',
              }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="cog" size={size} color={color} />
                ),
                headerTitle: '🔨 Carpenter Pro - Settings',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}