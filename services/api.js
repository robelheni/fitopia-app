import AsyncStorage from '@react-native-async-storage/async-storage';

// Your backend URL — localhost for development
const BASE_URL = 'https://web-production-9079c.up.railway.app';

// ─── Auth ────────────────────────────────────────────────────────

export async function signupUser(name, email, password,username = null, referralCode = null) {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        username,
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

  export async function loginUser(emailOrUsername, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrUsername, password }),
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

  export async function getNutrition() {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
  
    const response = await fetch(`${BASE_URL}/plan/nutrition?token=${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get nutrition');
    return data;
  }
  
  export async function getTodaysMeals(isFasting = false) {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
  
    const response = await fetch(
      `${BASE_URL}/plan/meals/today?token=${token}&is_fasting=${isFasting}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get meals');
    return data;
  }
  export async function getSwaps(mealId, swapGroup, targetCalories) {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
  
    const response = await fetch(
      `${BASE_URL}/plan/meals/swaps?token=${token}&meal_id=${mealId}&swap_group=${swapGroup}&target_calories=${targetCalories}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get swaps');
    return data;
  }
  export async function getWeeklyMeals() {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
    const response = await fetch(
      `${BASE_URL}/plan/meals/weekly?token=${token}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get weekly meals');
    return data;
  }

  export async function getMealById(mealId) {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
  
    const response = await fetch(`${BASE_URL}/plan/meals/${mealId}?token=${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get meal');
    return data;
  }

  export async function completeWorkout(workoutName = "Today's workout") {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
    const response = await fetch(
      `${BASE_URL}/workouts/complete?token=${token}&workout_name=${encodeURIComponent(workoutName)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to complete workout');
    return data;
  }
  
  export async function getStreak() {
    const token = await getToken();
    if (!token) throw new Error('Not logged in');
    const response = await fetch(
      `${BASE_URL}/workouts/streak?token=${token}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get streak');
    return data;
  }


// Fetches the full personalised weekly workout plan for the logged in user

export async function getWorkoutPlan() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/plan?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get workout plan');
  return data;
}

// Returns alternative exercises for a given exercise ID

export async function getSwapOptions(exerciseId, sessionExercises = '') {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/swap/${exerciseId}?token=${token}&session_exercises=${sessionExercises}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get swap options');
  return data;
}

// Toggles the like status of an exercise

export async function toggleLikeExercise(exerciseId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/like/${exerciseId}?token=${token}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to toggle like');
  return data;
}

// Returns whether the current user has liked a specific exercise

export async function getLikeStatus(exerciseId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/like/${exerciseId}/status?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get like status');
  return data;
}

// Returns all exercises the user has saved to favourites

export async function getLikedExercises() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/liked?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get liked exercises');
  return data;
}

// Returns full details for a single exercise by ID

export async function getExercise(exerciseId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/exercise/${exerciseId}?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get exercise');
  return data;
}

// Returns exercises from the database with optional filters

export async function getExercises({
  muscleGroup = null,
  equipmentList = null,
  equipment = null,
  difficulty = null,
  movementPattern = null,
} = {}) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

   // Build the URL dynamically — only add params that were provided
   let url = `${BASE_URL}/workouts/exercises?token=${token}`;
   if (muscleGroup) url += `&muscle_group=${muscleGroup}`;
   if (equipmentList) url += `&equipment_list=${equipmentList}`;
   if (equipment) url += `&equipment=${equipment}`;
   if (difficulty) url += `&difficulty=${difficulty}`;
   if (movementPattern) url += `&movement_pattern=${movementPattern}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get exercises');
  return data;
}


// Fetches a curated category workout from the backend
// category is the key like 'chest-gym', 'full-body-home', 'cardio-home'
// fitness level is read from the user's profile on the backend automatically
export async function getCategoryPlan(category) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/category-plan?token=${token}&category=${category}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get category plan');
  return data;
}

export async function getMotivationalQuote(workoutName = 'workout') {
  const token = await getToken();
  if (!token) return null;

  const response = await fetch(
      `${BASE_URL}/workouts/quote?token=${token}&workout_name=${encodeURIComponent(workoutName)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) return null;
  return await response.json();
}

//Fetches alll posts from the community feed, newest first
export async function getCommunityPosts() {
  const token = await getToken();
  if(!token) throw new Error("Not logged in");

  const response = await fetch(`${BASE_URL}/community/posts?token=${token}`,{
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });

  const data = await response.json();
  if(!response.ok) throw new Error(data.detail || 'Failed to get posts');
  return data;
}

//creates a new post
export async function createPost(text, tag) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/posts?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tag }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to create post');
  return data;
}

//Toggles like on a post
export async function togglePostLike(postId) {
  const token = await getToken();
  if(!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/posts/${postId}/like?token=${token}`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }
  );

  const data = await response.json();
  if(!response.ok) throw new Error(data.detail || 'Failed to toggle like');
  return data;
}

//Fetches all comments for a specific post
export async function getComments(postId) {
  const token = await getToken();
  if(!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/posts/${postId}/comments?token=${token}`,
    {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    }
  );

  const data = await response.json();
  if(!response.ok) throw new Error(data.detail || 'Failed to get comments');
  return data;

  
}


//Post a new comment on a post
export async function createComment(postId, text) {
  const token = await getToken();
  if(!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/posts/${postId}/comments?token=${token}&text=${encodeURIComponent(text)}`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }
  );

  const data = await response.json();
  if(!response.ok) throw new Error(data.detail || 'Failed to post comment');
  return data;
}

// Fetches a user's full profile — name, follower count, following count, posts
export async function getUserProfile(userId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/users/${userId}/profile?token=${token}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get profile');
  return data;
}

// Toggles follow/unfollow for a user
// Returns { following: true } or { following: false }
export async function toggleFollow(userId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/users/${userId}/follow?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to toggle follow');
  return data;
}