import React, { useState } from 'react';
import { useRouter } from 'expo-router';
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
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Mail, Lock } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const backgroundImg = require('../../assets/images/smart.jpg');

export default function LoginScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      // Kiểm tra thông tin đăng nhập từ Supabase
      const { data, error } = await supabase
      .from('APP_USERS')
      .select('id, email, password')
      .eq('email', email)
      .eq('password', password)
      .single();
      console.log('data', data);

      if (error) {
        Alert.alert('Đăng nhập thất bại', error.message);
        return;
      }

      // Nếu đăng nhập thành công, điều hướng người dùng đến màn hình tiếp theo
      console.log('Đăng nhập thành công:', data);
      router.replace('/(tabs)/characters'); // Hoặc màn hình khác bạn muốn
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      Alert.alert('Đăng nhập thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <ImageBackground
    source={backgroundImg}
    style={styles.backgroundImage}
    resizeMode="cover"
    blurRadius={0}
  >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={[styles.formWrapper, { backgroundColor: isDark ? '#1E1E1ECC' : '#FFFFFFCC' }]}>
          <Text style={[styles.title, { color: theme.text }]}>Chào mừng bạn</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Đăng nhập để tiếp tục</Text>

          <View style={styles.inputContainer}>
            <Mail color={theme.primary} size={20} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
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
            <Text style={{ color: theme.primary, fontSize: 14 }}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={{ color: theme.text, fontSize: 14 }}>Chưa có tài khoản?</Text>
            <TouchableOpacity>
              <Text style={[styles.registerText, { color: theme.primary }]}> Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  formWrapper: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
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
