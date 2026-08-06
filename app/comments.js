import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getComments, createComment, getCurrentUser} from '../services/api';



export default function CommentsScreen() {
  const { postId, postText, postName } = useLocalSearchParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getCurrentUser();
      setUser(data);
    }
    fetchUser();
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : '??';


  //fetch the raeal comments
  useEffect(() => {
    async function fetchComments(){
      try{
        setLoading(true);
        const data = await getComments(postId);
        setComments(data);
      } catch (err) {
        console.log('Failed to load comments:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  async function handleSubmit() {
    if (!newComment.trim()) return;
    try {
      setSending(true);
      const saved = await createComment(postId, newComment.trim());
      // Add the new comment to the list immediately without re-fetching everything
      setComments(prev => [...prev, saved]);
      setNewComment('');
    } catch (err) {
      console.log('Comment failed:', err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Original post */}
        <View style={styles.originalPost}>
          <Text style={styles.originalPostName}>{postName}</Text>
          <Text style={styles.originalPostText}>{postText}</Text>
        </View>

        <View style={styles.divider} />

        {/* Comments */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        ) : comments.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={40} color={colors.greyLight} />
            <Text style={styles.emptyText}>No comments yet</Text>
            <Text style={styles.emptySub}>Be the first to comment</Text>
          </View>
        ) : (
          <View style={styles.commentsList}>
            {comments.map(comment => (
              <View key={comment.id} style={styles.commentCard}>
                {comment.profile_picture ? (
                  <Image source={{ uri: comment.profile_picture }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: colors.blue }]}>
                    <Text style={styles.avatarText}>
                      {comment.name ? comment.name.substring(0, 2).toUpperCase() : 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentName}>{comment.name}</Text>
                    <Text style={styles.commentTime}>{comment.time || 'Just now'}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Comment input */}
      <View style={styles.inputContainer}>
        {user?.profile_picture ? (
          <Image source={{ uri: user.profile_picture }} style={styles.inputAvatar} />
        ) : (
          <View style={styles.inputAvatar}>
            <Text style={styles.inputAvatarText}>{initials}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor={colors.greyLight}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
          onPress={handleSubmit}
          disabled={!newComment.trim() ||sending}
        >
          <Feather
            name="send"
            size={18}
            color={newComment.trim() ? colors.white : colors.greyLight}
          />
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.black,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },

  originalPost: {
    marginBottom: 16,
  },

  originalPostName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 6,
  },

  originalPostText: {
    fontSize: 15,
    color: colors.grey,
    lineHeight: 22,
    fontWeight: '300',
  },

  divider: {
    height: 0.5,
    backgroundColor: colors.greyBorder,
    marginBottom: 16,
  },

  commentsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey,
  },

  emptySub: {
    fontSize: 13,
    color: colors.greyLight,
    fontWeight: '300',
  },

  commentsList: {
    gap: 16,
  },

  commentCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },

  commentContent: {
    flex: 1,
    backgroundColor: colors.greyCard,
    borderRadius: 16,
    padding: 12,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  commentName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
  },

  commentTime: {
    fontSize: 11,
    color: colors.greyLight,
  },

  commentText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    fontWeight: '300',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.greyBorder,
    backgroundColor: colors.white,
  },

  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  inputAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    maxHeight: 80,
    paddingVertical: 8,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  sendButtonDisabled: {
    backgroundColor: colors.greyCard,
    shadowOpacity: 0,
    elevation: 0,
  },
  centered: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});