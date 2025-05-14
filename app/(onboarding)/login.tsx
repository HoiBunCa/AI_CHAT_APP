import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Mail, Lock, User } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const backgroundImg = require('../../assets/images/bg.jpg');

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('APP_USERS')
        .select('id, email, password')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) {
        Alert.alert('Đăng nhập thất bại', error.message);
        return;
      }

      console.log('Đăng nhập thành công:', data);
      await AsyncStorage.setItem('userSession', JSON.stringify(data));
      router.replace('/(tabs)/characters');
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      Alert.alert('Đăng nhập thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={backgroundImg}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={[styles.formWrapper, shadowStyle]}>
              <Text style={[styles.subtitle, { color: 'white' }]}>
                Đăng nhập để tiếp tục
              </Text>

              <View style={styles.inputContainer}>
                <User color={theme.primary} size={20} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Tài khoản"
                  placeholderTextColor={theme.secondaryText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color={theme.primary} size={20} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Mật khẩu"
                  placeholderTextColor={theme.secondaryText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={{ color: theme.primary, fontSize: 14 }}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Đăng nhập</Text>
              </TouchableOpacity>

              <View style={styles.registerRow}>
                <Text style={{ color: theme.text, fontSize: 14 }}>
                  Chưa có tài khoản?
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.registerText, { color: theme.primary }]}>
                    {' '}
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  android: {
    elevation: 5,
  },
});

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: Platform.select({
      ios: 132,
      android: 80,
    }),
  },
  formWrapper: {
    width: '80%',
    alignSelf: 'center',
    padding: 24,
    borderRadius: 60,    
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1AA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontWeight: '600',
  },
});
