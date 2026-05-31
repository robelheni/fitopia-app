import AsyncStorage from '@react-native-async-storage/async-storage';

// Your backend URL — localhost for development
const BASE_URL = 'http://192.168.0.186:8000';

// ─── Auth ────────────────────────────────────────────────────────

export async function signupUser(name, email, password, referralCode = null) {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        referral_code: referralCode,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.detail || 'Signup failed');
    }
  
    // Automatically log in to get token
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const loginData = await loginResponse.json();
  
    if (!loginResponse.ok) {
      throw new Error('Account created but login failed');
    }
  
    // Save token
    await AsyncStorage.setItem('token', loginData.access_token);
    await AsyncStorage.setItem('token_type', loginData.token_type);
  
    return data;
  }

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed');
  }

  // Save token to device storage
  await AsyncStorage.setItem('token', data.access_token);
  await AsyncStorage.setItem('token_type', data.token_type);

  return data;
}

export async function getToken() {
  return await AsyncStorage.getItem('token');
}

export async function getCurrentUser() {
  const token = await getToken();

  if (!token) return null;

  const response = await fetch(`${BASE_URL}/auth/me?token=${token}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) return null;

  return await response.json();
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('token_type');
}

export async function saveOnboarding(answers, tokenOverride = null) {
    const token = tokenOverride || await getToken();
  
    if (!token) throw new Error('Not logged in');
  
    const response = await fetch(`${BASE_URL}/auth/onboarding?token=${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to save onboarding');
    }
  
    return data;
  }