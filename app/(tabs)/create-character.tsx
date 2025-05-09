import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { supabase } from "@/lib/supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const OPTIONS_PER_ROW = 2;

const selectionSteps = [
  {
    label: 'Choose Ethnicity',
    options: [
      {
        label: 'Black',
        image:
          'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/495363443_1370486387491923_3893902468700398482_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=AwUfc5mph_0Q7kNvwGJ8a8Y&_nc_oc=AdkPRzDIt2r65PqAyS3ysSVaW9RWsSNAfvG2buMt1immBpL5j7_PL9mCM1UIsmDGqc0&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=pgjPX5kfjNFSIIZd4MsJhA&oh=00_AfH5Dgcu2rfPB3GpZnBanxnAZ6ipvPLMGTuFj2krBm6w7w&oe=681B6E10',
      },
      { label: 'Asian', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/495363443_1370486387491923_3893902468700398482_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=AwUfc5mph_0Q7kNvwGJ8a8Y&_nc_oc=AdkPRzDIt2r65PqAyS3ysSVaW9RWsSNAfvG2buMt1immBpL5j7_PL9mCM1UIsmDGqc0&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=lQXAg0AHP9B7IdQd6BAeWQ&oh=00_AfFIX5qQFN9M4dJIDDBY5bf-9srMPGTprbLGh7BhQ9LX7A&oe=681B6E10' },
      { label: 'Caucasian', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/495363443_1370486387491923_3893902468700398482_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=AwUfc5mph_0Q7kNvwGJ8a8Y&_nc_oc=AdkPRzDIt2r65PqAyS3ysSVaW9RWsSNAfvG2buMt1immBpL5j7_PL9mCM1UIsmDGqc0&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=lQXAg0AHP9B7IdQd6BAeWQ&oh=00_AfFIX5qQFN9M4dJIDDBY5bf-9srMPGTprbLGh7BhQ9LX7A&oe=681B6E10' },
      { label: 'Latina', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/495363443_1370486387491923_3893902468700398482_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=AwUfc5mph_0Q7kNvwGJ8a8Y&_nc_oc=AdkPRzDIt2r65PqAyS3ysSVaW9RWsSNAfvG2buMt1immBpL5j7_PL9mCM1UIsmDGqc0&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=lQXAg0AHP9B7IdQd6BAeWQ&oh=00_AfFIX5qQFN9M4dJIDDBY5bf-9srMPGTprbLGh7BhQ9LX7A&oe=681B6E10' },
      { label: 'Arab', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/495363443_1370486387491923_3893902468700398482_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=AwUfc5mph_0Q7kNvwGJ8a8Y&_nc_oc=AdkPRzDIt2r65PqAyS3ysSVaW9RWsSNAfvG2buMt1immBpL5j7_PL9mCM1UIsmDGqc0&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=lQXAg0AHP9B7IdQd6BAeWQ&oh=00_AfFIX5qQFN9M4dJIDDBY5bf-9srMPGTprbLGh7BhQ9LX7A&oe=681B6E10' },
    ],
    selected: null,
  },
  {
    label: 'Choose Hair Style',
    options: [
      { label: 'Straight', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Wavy', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Curly', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Long', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Short', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
    ],
    selected: null,
  },
  {
    label: 'Choose Body Type',
    options: [
      { label: 'Slim', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494539511_1369044847636077_7366713261351980106_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=xlOKaRMRf7kQ7kNvwGdQ9GK&_nc_oc=AdkBauKTxIBPbBcI9aJTRLPr9IM-abJQCme99g90_NdTxDIJ001oKpz9qXy1zM7rXKM&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfESz5qw8jaJe1HGz_llMIboR_Oimq60ZI69lK7xQxORxw&oe=681B7FCA' },
      { label: 'Athletic', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Curvy', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Tall', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Petite', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
    ],
    selected: null,
  },
  {
    label: 'Choose Personality',
    options: [
      { label: 'Cheerful', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494539511_1369044847636077_7366713261351980106_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=xlOKaRMRf7kQ7kNvwGdQ9GK&_nc_oc=AdkBauKTxIBPbBcI9aJTRLPr9IM-abJQCme99g90_NdTxDIJ001oKpz9qXy1zM7rXKM&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfESz5qw8jaJe1HGz_llMIboR_Oimq60ZI69lK7xQxORxw&oe=681B7FCA' },
      { label: 'Thoughtful', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Witty', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Creative', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Adventurous', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Calm', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
    ],
    selected: null,
  },
  {
    label: 'Choose Style',
    options: [
      { label: 'Outgoing', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494539511_1369044847636077_7366713261351980106_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=xlOKaRMRf7kQ7kNvwGdQ9GK&_nc_oc=AdkBauKTxIBPbBcI9aJTRLPr9IM-abJQCme99g90_NdTxDIJ001oKpz9qXy1zM7rXKM&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfESz5qw8jaJe1HGz_llMIboR_Oimq60ZI69lK7xQxORxw&oe=681B7FCA' },
      { label: 'Caring', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Intelligent', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Artistic', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Bold', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Calm & Supportive', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
    ],
    selected: null,
  },
  {
    label: 'Choose Category',
    options: [
      { label: 'Romantic', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494539511_1369044847636077_7366713261351980106_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=xlOKaRMRf7kQ7kNvwGdQ9GK&_nc_oc=AdkBauKTxIBPbBcI9aJTRLPr9IM-abJQCme99g90_NdTxDIJ001oKpz9qXy1zM7rXKM&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfESz5qw8jaJe1HGz_llMIboR_Oimq60ZI69lK7xQxORxw&oe=681B7FCA' },
      { label: 'New', image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/494498288_1369044844302744_8290071782940337506_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=sT9qfJnEH50Q7kNvwEqcLXh&_nc_oc=AdnP5U8wxxQvRgtWkBd6fAL2SzZ1szQ1dWSxbQv7K7TR1_twDYe5HXFL-QJGxGkQGJI&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=yiiD7_Btyr4k5DcyLP5dhw&oh=00_AfFKuxm2Erls5UcHiucjvLO3AS-pFindOCujFy1dMD0pxg&oe=681B70E4' },
      { label: 'Cool', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },
      { label: 'Crazy', image: 'https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/495023141_1369044950969400_9057380419579977448_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=6C5Rip-JNYYQ7kNvwH4oVNd&_nc_oc=Adk90WuJa6lBUdiB_21wfdR4BjdjLOuOoAJfjwciDesson4dbZZadZZfLlqYt6aVFz4&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=V55GUshfms9JfYXM0hRijA&oh=00_AfF7nHJTbJ3rJTGwYzMcgTRmeJ57ny9o1FBk-kOPcQoZjw&oe=681B8563' },      
    ],
    selected: null,
  },
];

const ModernCreateAIChatbotScreen = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const scrollViewRef = useRef();
  const [selectionStates, setSelectionStates] = useState(
    selectionSteps.map(step => ({ selected: step.selected }))
  );

  const currentStep = selectionSteps[currentStepIndex];

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      scrollViewRef.current?.scrollTo({ x: (currentStepIndex - 1) * width, animated: true });
    }
  };

  const handleNext = () => {
    if (currentStepIndex < selectionSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      scrollViewRef.current?.scrollTo({ x: (currentStepIndex + 1) * width, animated: true });
    } else {
      console.log('Selections:', selectionStates);
      create_character(selectionStates);
      

      
    }
  };

  const handleOptionSelect = (option) => {
    const updatedSelectionStates = [...selectionStates];
    updatedSelectionStates[currentStepIndex] = { selected: option };
    setSelectionStates(updatedSelectionStates);
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    let newIndex = Math.round(contentOffsetX / width);
    newIndex = Math.max(0, Math.min(newIndex, selectionSteps.length - 1));
    if (newIndex !== currentStepIndex) {
      setCurrentStepIndex(newIndex);
    }
  };

  const renderOptions = (options, selectedOption) => {
    const numRows = Math.ceil(options.length / OPTIONS_PER_ROW);
    const rows = Array.from({ length: numRows }, (_, rowIndex) =>
      options.slice(rowIndex * OPTIONS_PER_ROW, (rowIndex + 1) * OPTIONS_PER_ROW)
    );

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={styles.optionButton}
            onPress={() => handleOptionSelect(option)}
          >
            <View
              style={[
                styles.imageWrapper,
                selectedOption?.label === option.label && styles.selectedOption,
              ]}
            >
              <Image source={{ uri: option.image }} style={styles.optionImage} />
              <View style={styles.overlay}>
                <Text
                  style={[
                    styles.optionText,
                    selectedOption?.label === option.label && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  const renderProgressBar = () => (
    <View style={styles.progressBarContainer}>
      {selectionSteps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressBarSegment,
            index < currentStepIndex && styles.progressBarCompleted,
            index === currentStepIndex && styles.progressBarCurrent,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {currentStepIndex > 0 && (
        <TouchableOpacity style={styles.backButtonContainer} onPress={handleBack}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
      )}

      {renderProgressBar()}

      <Text style={styles.title}>{currentStep.label}</Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ width: selectionSteps.length * width }}
      >
        {selectionSteps.map((step, index) => (
          <ScrollView
            key={index}
            style={styles.stepContent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {renderOptions(step.options, selectionStates[index]?.selected)}
          </ScrollView>
        ))}
      </ScrollView>

      {currentStepIndex === selectionSteps.length - 1 && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backButton: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  progressBarSegment: {
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#3a3a3c',
  },
  progressBarCompleted: {
    backgroundColor: '#e91e63',
    opacity: 0.4,
  },
  progressBarCurrent: {
    backgroundColor: '#e91e63',
    opacity: 1,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepContent: {
    flex: 1,
    width: width,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionButton: {
    width: (width - 50) / 2,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#e91e63',
    borderWidth: 3,
    borderRadius: 10,
  },
  optionImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // Tỉ lệ 1:1 (vuông)
    borderRadius: 8,
    resizeMode: 'cover',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageWrapper: {
    position: 'relative',
    width: (width - 50) / 2,
    height: (width - 50) / 2,
    marginBottom: 8,
    overflow: 'hidden',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 4,
    
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});


async function create_character(attributes) {
  // Lấy 3 thuộc tính đầu tiên để gọi hàm sinh ảnh
  const attr1 = attributes[0];
  const attr2 = attributes[1];
  const attr3 = attributes[2];
  const imageLink = await generateImage(attr1, attr2, attr3);

  // Lấy 3 thuộc tính tiếp theo để gọi hàm tạo bản ghi trong db 
  const attr4 = attributes[3];
  const attr5 = attributes[4];
  const attr6 = attributes[5];
  await createRecordInDatabase(attr4, attr5, attr6, imageLink);

  // Cập nhật giao diện hoặc chuyển sang bước tiếp theo nếu cần
  console.log('Next button clicked, record created!');
}

async function generateImage(attr1, attr2, attr3) {
  // Gọi API sinh ảnh (Giả sử API trả về link ảnh)
  // Ví dụ:
  console.log('Generating image with attributes:', attr1, attr2, attr3);
  return `https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/495343976_3101886483318579_2071644917021755021_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=OEBP95Y1wcsQ7kNvwFiw6LI&_nc_oc=AdkwoGWqC4x-3zp6dYU0xp8jAeebLKA6VvvwrxtHuOaEcROjRFO17NxmuszZNDKTlTU&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&_nc_gid=e2Ic0pRYFZj8wgCMFe2Ezg&oh=00_AfJyWRjd1KhuJ01DKo5mwV7MeC8pTtBHwjvwDhvI_Uk0Zw&oe=681F59B2`;
}

// Hàm tạo bản ghi mới trong Database
async function createRecordInDatabase(attr4, attr5, attr6, imageLink) {

  const personality = attr4.selected.label;
  const style = attr5.selected.label;
  const category = attr6.selected.label;

  const sessionString = await AsyncStorage.getItem('userSession');
  if (sessionString) {
    const session = JSON.parse(sessionString); // chuyển từ chuỗi sang object
    const userId = session.id; // lấy id
    console.log('User ID:', userId);
    const { data, error } = await supabase
    .from('CHARACTERS')
    .insert([
      {
        name: "Maria",
        imageUrl: "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/495343976_3101886483318579_2071644917021755021_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=OEBP95Y1wcsQ7kNvwFiw6LI&_nc_oc=AdkwoGWqC4x-3zp6dYU0xp8jAeebLKA6VvvwrxtHuOaEcROjRFO17NxmuszZNDKTlTU&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&_nc_gid=e2Ic0pRYFZj8wgCMFe2Ezg&oh=00_AfJyWRjd1KhuJ01DKo5mwV7MeC8pTtBHwjvwDhvI_Uk0Zw&oe=681F59B2",
        personality: personality + " & " + style,
        category: category,
        created_by: userId
      },
    ]);

    if (error) {
      console.error('Error inserting record:', error);
      return;
    }
    console.log('Record inserted successfully:', data);
  }
  
}

export default ModernCreateAIChatbotScreen;
