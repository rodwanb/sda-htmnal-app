const primaryBlue = '#1B2A4A';
const offWhite = '#F5F2EE';
const darkBackground = '#121212';

export default {
  light: {
    text: primaryBlue,
    background: offWhite,
    searchBackground: '#FFFFFF',
    searchText: '#666666',
    searchPlaceholder: '#999999',
    tabIconDefault: '#666666',
    tabIconSelected: primaryBlue,
    headerText: primaryBlue,
    headerBackground: offWhite,
  },
  dark: {
    text: '#FFFFFF',
    background: darkBackground,
    searchBackground: '#242424',
    searchText: '#FFFFFF',
    searchPlaceholder: '#888888',
    tabIconDefault: '#888888',
    tabIconSelected: '#FFFFFF',
    headerText: '#FFFFFF',
    headerBackground: darkBackground,
  },
  // Common colors that don't change with theme
  common: {
    primary: primaryBlue,
    deviceFrame: '#000000',
  }
};