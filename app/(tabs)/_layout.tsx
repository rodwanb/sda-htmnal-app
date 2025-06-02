import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { DarkTheme, LightTheme } from '@/constants/theme';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? DarkTheme.colors.tabIconSelected : LightTheme.colors.tabIconSelected,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          borderTopWidth: 1,
          backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : LightTheme.colors.background,
          borderTopColor: colorScheme === 'dark' ? DarkTheme.colors.border : LightTheme.colors.border,
        },
        // tabBarLabelStyle: { fontSize: RFPercentage(1.5) },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hymns',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="library-music" size={28} color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Ionicons name="albums" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
