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

export async function getPost(postId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(`${BASE_URL}/community/posts/${postId}?token=${token}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get post');
  return data;
}

//creates a new post
export async function createPost(text, tag, challengeId = null, imageUrl = null) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/posts?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tag, challenge_id: challengeId, image_url: imageUrl }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to create post');
  return data;
}

export async function uploadPostImage(imageUri) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'post.jpg',
  });

  const response = await fetch(
    `${BASE_URL}/upload/post-image?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Upload failed');
  return data;
}
export async function togglePostPrivacy(postId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/community/posts/${postId}/toggle-privacy?token=${token}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to update privacy');
  return data;
}

export async function togglePostComments(postId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/community/posts/${postId}/toggle-comments?token=${token}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to update comments setting');
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


// Updates the current user's name, username, and bio
// We only send fields the user actually changed — the backend
// handles partial updates so unchanged fields stay the same
export async function updateProfile({ name, username, bio }) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/auth/update-profile?token=${token}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // JSON.stringify converts the JS object to a JSON string
      // Only send fields that were provided
      body: JSON.stringify({ name, username, bio }),
    }
  );

  const data = await response.json();
  // If the username is taken, the backend returns a 400 error
  // response.ok is false for any status code 400 and above
  if (!response.ok) throw new Error(data.detail || 'Failed to update profile');
  return data;
}


// Searches users by name or username
// q is the search query — e.g. "heni" or "bekele"
// Returns an array of matching users
export async function searchUsers(q) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/users/search?token=${token}&q=${encodeURIComponent(q)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Search failed');
  return data;
}

export async function getYearStats(year) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/year-stats?token=${token}&year=${year}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get year stats');
  return data;
}

// Deletes a post — backend verifies ownership, will reject if you don't own it
export async function deletePost(postId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/posts/${postId}?token=${token}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to delete post');
  return data;
}

// Reports a post for review
export async function reportPost(postId, reason = 'Not specified') {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/posts/${postId}/report?token=${token}&reason=${encodeURIComponent(reason)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to report post');
  return data;
}


// Returns deeper consistency stats
export async function getConsistencyStats() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/workouts/consistency?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get consistency stats');
  return data;
}


// Returns high-level app stats for the admin dashboard
export async function getAdminOverview() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/admin/overview?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get admin overview');
  return data;
}

// Returns all users for the admin user management screen
export async function getAdminUsers() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/admin/users?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get users');
  return data;
}

// Toggles a user's Pro status — admin only
export async function toggleUserPro(userId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/admin/users/${userId}/toggle-pro?token=${token}`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to toggle pro status');
  return data;
}

// Admin-only: creates a new challenge
export async function createChallenge({ name, description, color }) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/admin/challenges?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, color }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to create challenge');
  return data;
}

// Returns all challenges, ranked by popularity (post count)
export async function getChallenges() {
  const response = await fetch(`${BASE_URL}/community/challenges`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get challenges');
  return data;
}

// Returns a single challenge's details plus its posts
export async function getChallengeDetail(challengeId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/community/challenges/${challengeId}?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get challenge');
  return data;
}

// Admin: lists every challenge with post count, for management
export async function getAdminChallenges() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/admin/challenges?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get challenges');
  return data;
}

// Admin: moves a challenge up or down in display order
export async function reorderChallenge(challengeId, direction) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/admin/challenges/${challengeId}/reorder?token=${token}&direction=${direction}`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to reorder');
  return data;
}

// Uploads a profile picture to Cloudinary via our backend.
// imageUri is the local file URI returned by expo-image-picker.
export async function uploadProfilePicture(imageUri) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });

  const response = await fetch(
    `${BASE_URL}/upload/profile-picture?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Upload failed');
  return data;
}

// Admin: deletes a challenge
export async function deleteChallenge(challengeId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');

  const response = await fetch(
    `${BASE_URL}/admin/challenges/${challengeId}?token=${token}`,
    { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to delete challenge');
  return data;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getNotifications() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/notifications?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get notifications');
  return data;
}

export async function getUnreadNotificationCount() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/notifications/unread-count?token=${token}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get unread count');
  return data;
}

export async function markNotificationRead(notificationId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/notifications/${notificationId}/read?token=${token}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to mark notification read');
  return data;
}

export async function markAllNotificationsRead() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/notifications/read-all?token=${token}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to mark all read');
  return data;
}

// ─── Trainers (public) ───────────────────────────────────────────────────────

export async function getTrainers() {
  const response = await fetch(`${BASE_URL}/community/trainers`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get trainers');
  return data;
}

export async function getTrainer(trainerId) {
  const response = await fetch(`${BASE_URL}/community/trainers/${trainerId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get trainer');
  return data;
}

export async function submitTrainerApplication(applicationData) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/community/trainer-applications?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to submit application');
  return data;
}

// ─── Admin — Trainers ────────────────────────────────────────────────────────

export async function getAdminTrainers() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(`${BASE_URL}/admin/trainers?token=${token}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get trainers');
  return data;
}

export async function createAdminTrainer(trainerData) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/trainers?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainerData),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to create trainer');
  return data;
}

export async function deleteAdminTrainer(trainerId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/trainers/${trainerId}?token=${token}`,
    { method: 'DELETE' }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to delete trainer');
  return data;
}

// ─── Admin — Trainer Applications ───────────────────────────────────────────

export async function getTrainerApplications() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(`${BASE_URL}/admin/trainer-applications?token=${token}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get applications');
  return data;
}

export async function approveTrainerApplication(applicationId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/trainer-applications/${applicationId}/approve?token=${token}`,
    { method: 'PUT' }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to approve');
  return data;
}

export async function rejectTrainerApplication(applicationId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/trainer-applications/${applicationId}/reject?token=${token}`,
    { method: 'PUT' }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to reject');
  return data;
}

// ─── Admin — Reported Posts ──────────────────────────────────────────────────

export async function getReportedPosts() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(`${BASE_URL}/admin/reported-posts?token=${token}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get reports');
  return data;
}

export async function adminDeletePost(postId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/posts/${postId}?token=${token}`,
    { method: 'DELETE' }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to delete post');
  return data;
}

// ─── Admin — User Management ─────────────────────────────────────────────────

export async function toggleUserAdmin(userId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/users/${userId}/toggle-admin?token=${token}`,
    { method: 'PUT' }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to toggle admin');
  return data;
}

export async function toggleUserBan(userId) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/users/${userId}/toggle-ban?token=${token}`,
    { method: 'PUT' }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to toggle ban');
  return data;
}

// ─── Admin — Announcements ───────────────────────────────────────────────────

export async function createAnnouncement(title, message) {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(
    `${BASE_URL}/admin/announcements?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to create announcement');
  return data;
}

export async function getAnnouncements() {
  const token = await getToken();
  if (!token) throw new Error('Not logged in');
  const response = await fetch(`${BASE_URL}/admin/announcements?token=${token}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to get announcements');
  return data;
}