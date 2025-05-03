import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Feather';

const ModernCreateAIChatbotScreen = () => {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [tone, setTone] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(0.5);
  const [knowledgeDomains, setKnowledgeDomains] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const personalities = ['Thân thiện', 'Hài hước', 'Nghiêm túc', 'Sáng tạo', 'Tò mò'];
  const tones = ['Trang trọng', 'Thân mật', 'Hóm hỉnh', 'Khuyến khích', 'Đặt câu hỏi'];
  const availableDomains = ['Lịch sử', 'Khoa học', 'Văn học', 'Công nghệ', 'Nghệ thuật'];

  const handleToggleDomain = (domain) => {
    if (knowledgeDomains.includes(domain)) {
      setKnowledgeDomains(knowledgeDomains.filter((d) => d !== domain));
    } else {
      setKnowledgeDomains([...knowledgeDomains, domain]);
    }
  };

  const handleCreateAI = () => {
    setIsCreating(true);
    console.log('Đang tạo AI với các thuộc tính:', {
      name,
      personality,
      tone,
      creativityLevel,
      knowledgeDomains,
    });
    setTimeout(() => {
      setIsCreating(false);
      alert('AI của bạn đã được tạo!');
    }, 2000);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/aaa.png')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Tạo AI Cá Nhân</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên AI (tùy chọn):</Text>
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Nhập tên AI"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tính cách:</Text>
            <View style={styles.pickerContainer}>
              <Icon name="smile" size={20} color="#888" style={styles.pickerIcon} />
              <Picker
                selectedValue={personality}
                onValueChange={(value) => setPersonality(value)}
                style={styles.picker}
                dropdownIconColor="#007bff"
              >
                <Picker.Item label="Chọn tính cách" value="" />
                {personalities.map((p) => (
                  <Picker.Item key={p} label={p} value={p} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Văn phong:</Text>
            <View style={styles.pickerContainer}>
              <Icon name="edit" size={20} color="#888" style={styles.pickerIcon} />
              <Picker
                selectedValue={tone}
                onValueChange={(value) => setTone(value)}
                style={styles.picker}
                dropdownIconColor="#007bff"
              >
                <Picker.Item label="Chọn văn phong" value="" />
                {tones.map((t) => (
                  <Picker.Item key={t} label={t} value={t} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mức độ sáng tạo:</Text>
            <View style={styles.sliderContainer}>
              <Icon name="sliders" size={20} color="#888" style={styles.sliderIcon} />
              <Slider
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                value={creativityLevel}
                onValueChange={setCreativityLevel}
                style={styles.slider}
                thumbTintColor="#007bff"
                minimumTrackTintColor="#007bff"
                maximumTrackTintColor="#ccc"
              />
              <Text style={styles.sliderValue}>
                {Math.round(creativityLevel * 100)}%
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lĩnh vực kiến thức:</Text>
            <View style={styles.domainList}>
              {availableDomains.map((domain) => (
                <TouchableOpacity
                  key={domain}
                  style={[
                    styles.checkboxItem,
                    knowledgeDomains.includes(domain) && styles.checkboxItemSelected,
                  ]}
                  onPress={() => handleToggleDomain(domain)}
                >
                  <Icon
                    name={knowledgeDomains.includes(domain) ? 'check-square' : 'square'}
                    size={20}
                    color={knowledgeDomains.includes(domain) ? '#fff' : '#888'}
                    style={styles.checkboxIcon}
                  />
                  <Text
                    style={[
                      styles.checkboxText,
                      knowledgeDomains.includes(domain) && styles.checkboxTextSelected,
                    ]}
                  >
                    {domain}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.creatingButton]}
            onPress={handleCreateAI}
            disabled={isCreating}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? 'Đang tạo...' : 'Tạo AI'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#333',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderIcon: {
    marginRight: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  domainList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxItemSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkboxIcon: {
    marginRight: 6,
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  checkboxTextSelected: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  creatingButton: {
    backgroundColor: '#6c757d',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ModernCreateAIChatbotScreen;
