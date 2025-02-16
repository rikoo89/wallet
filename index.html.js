1   <script>
2/   / Initialize Parse
3     Parse.initialize("anJMHDgrtl4tBC3WA2H6zTPzbFvmQItOPV7z1Ujt"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
4     Parse.serverURL = "https://parseapi.back4app.com/";
5   </script>
1   <h1>JS SDK</h1>   
2   <input id="CHATAI" type="text" placeholder="chatAI"/>
3   <input id="ahamiane86@yahoo.com" type="ahamiane86@yahoo.com" placeholder="Email"/>
4   <input id="
sword" type="
" placeholder="
" />
5   <button id="createButton">Create User</button>
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PointsSystem = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const pointsAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const pointsMultiplier = Math.floor(level / 5) + 1;
  const pointsToNextLevel = level * 100;

  const calculateLevel = (totalPoints) => {
    return Math.floor(totalPoints / 100) + 1;
  };

  const earnPoints = (amount) => {
    const newPoints = points + (amount * pointsMultiplier);
    setPoints(newPoints);
    setLevel(calculateLevel(newPoints));
    
    // Animate points indicator
    Animated.sequence([
      Animated.spring(pointsAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(pointsAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
  try {
    // Start loading state
    setIsLoading(true);
    
    // Simulate Telegram authentication flow
    const telegramAuth = {
      id: Math.floor(Math.random() * 1000000),
      first_name: "@aha89_bot",
      username: "@aha89_bot",
      photo_url: "https://api.a0.dev/assets/image?text=telegram%20user%20profile&aspect=1:1",
      auth_date: Math.floor(Date.now() / 1000)
    };

    // Store user data
    setUserData(telegramAuth);
    setIsLoggedIn(true);
    earnPoints(10); // Base points for logging in

    // Add welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: `Welcome ${telegramAuth.first_name}! You've earned 10 points for logging in.`,
      timestamp: new Date().toLocaleTimeString(),
      points: 10,
      isSystem: true
    };
    setMessages([welcomeMessage]);

  } catch (error) {
    toast.error("Failed to connect to Telegram. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

const [userData, setUserData] = useState(null);
const [isLoading, setIsLoading] = useState(false);

const BOT_TOKEN = '7937998928:AAEUHiMpGwCm8htpjdAvHqiPeqvO72S9ULA';

const sendTelegramMessage = async (text) => {
  if (!userData) return;
  
  try {
    // Send message to Telegram
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: userData.id,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      // Add user message to chat
      const newMessage = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleTimeString(),
        points: 5 * pointsMultiplier,
        sender: userData.username
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate bot thinking
      setTimeout(async () => {
        try {
          // Get bot response
          const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
          const botData = await botResponse.json();
          
          if (botData.ok) {
            const aiResponse = {
              id: Date.now() + 1,
              text: "I received your message: " + text,
              timestamp: new Date().toLocaleTimeString(),
              isAI: true
            };
            setMessages(prev => [...prev, aiResponse]);
          }
        } catch (error) {
          console.error('Bot response error:', error);
        }
      }, 1000);

      earnPoints(5);
      setInputText('');
    } else {
      throw new Error('Failed to send message to Telegram');
    }
    
  } catch (error) {
    console.error('Telegram API Error:', error);
    // Add fallback message if API fails
    const fallbackMessage = {
      id: Date.now(),
      text: text,
      timestamp: new Date().toLocaleTimeString(),
      points: 5 * pointsMultiplier,
      sender: userData.username
    };
    setMessages(prev => [...prev, fallbackMessage]);
    earnPoints(5);
    setInputText('');
  }
};

const handleMessage = () => {
  if (inputText.trim()) {
    sendTelegramMessage(inputText);
    earnPoints(5); // Points for sending a message
  }
};

  const PointsIndicator = () => (
    <Animated.View
      style={[
        styles.pointsIndicator,
        {
          transform: [
            {
              scale: pointsAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.pointsGradient}
      >
        <MaterialCommunityIcons name="star" size={24} color="#fff" />
        <Text style={styles.pointsText}>{points}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const LevelProgress = () => {
    const progress = (points % 100) / pointsToNextLevel;
    
    return (
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.multiplierText}>{pointsMultiplier}x Points</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {points % 100}/{pointsToNextLevel} to Level {level + 1}
        </Text>
      </View>
    );
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.walletContainer}
        >
          <Image
            source={{ uri: 'https://api.a0.dev/assets/image?text=telegram%20wallet%20login&aspect=1:1' }}
            style={styles.walletLogo}
          />
          <Text style={styles.welcomeText}>Welcome to Crypto Chat</Text>
          <Text style={styles.subtitleText}>Connect your Telegram Wallet to start earning points</Text>
          
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={['#0088cc', '#0099ff']}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <FontAwesome5 name="telegram-plane" size={24} color="#fff" />
                <Text style={styles.buttonText}>Connect Telegram Wallet</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.securityContainer}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#4CAF50" />
            <Text style={styles.securityText}>Secure Connection</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Crypto Chat</Text>
          <PointsIndicator />
        </View>
      </LinearGradient>

      <LevelProgress />

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {messages.map((message) => (
          <View key={message.id} style={styles.messageBubble}>
            <Text style={styles.messageText}>{message.text}</Text>
            <View style={styles.messageFooter}>
              <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
              <View style={styles.pointsEarned}>
                <MaterialCommunityIcons name="star" size={12} color="#4CAF50" />
                <Text style={styles.pointsEarnedText}>+{message.points}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message to earn points..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleMessage}
        >
          <MaterialCommunityIcons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  newsSectionContainer: {
    marginTop: 8,
    backgroundColor: '#1e3c72',
    borderRadius: 12,
    overflow: 'hidden',
  },
  newsToggle: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newsHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newsContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#1e3c72',
  },
  categoryText: {
    color: '#333',
    fontWeight: '600',
  },
  newsScroll: {
    maxHeight: 400,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  newsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  requirementsContainer: {
    marginBottom: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    marginLeft: 4,
    color: '#FFA000',
    fontWeight: '600',
  },
  endDateText: {
    fontSize: 12,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  walletContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  walletLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.8,
  },
  connectButton: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 14,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsIndicator: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  pointsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
  },
  pointsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  levelContainer: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  multiplierText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  messageBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  pointsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsEarnedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 2,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 100,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0088cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PointsSystem;
