import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

const SUPABASE_URL = 'https://zjarxedwboflculxiqml.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqYXJ4ZWR3Ym9mbGN1bHhpcW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNzY1NzgsImV4cCI6MjA2Njc1MjU3OH0.0qGl9PbLmmfbGIYjdtDp7yOymBzjgDfpD-unYlSlx9o';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// パスワード認証
function checkPassword() {
  const input = document.getElementById('password').value;
  if (input === 'wakakusa') {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    loadThreads();
  } else {
    alert('パスワードが間違っています');
  }
}

// スレッド投稿
async function submitThread(event) {
  event.preventDefault();
  const user = document.getElementById('thread_user').value;
  const content = document.getElementById('thread_content').value;

  const { data, error } = await supabase
    .from('threads')
    .insert([{ user_name: user, content: content }]);

  if (error) {
    alert('投稿エラー');
    console.error(error);
  } else {
    loadThreads();
    document.getElementById('thread_user').value = '';
    document.getElementById('thread_content').value = '';
  }
}

// コメント投稿
async function submitComment(event, threadId) {
  event.preventDefault();
  const user = event.target.username.value;
  const text = event.target.comment.value;

  const { error } = await supabase
    .from('comments')
    .insert([{ thread_id: threadId, user_name: user, comment_text: text }]);

  if (error) {
    alert('コメント送信エラー');
    console.error(error);
  } else {
    loadThreads();
  }
}

// スレッド＋コメントの読み込み
async function loadThreads() {
  const { data: threads } = await supabase
    .from('threads')
    .select('*')
    .order('created_at', { ascending: false });

  const threadsContainer = document.getElementById('threads');
  threadsContainer.innerHTML = '';

  for (const thread of threads) {
    const threadDiv = document.createElement('div');
    threadDiv.className = 'thread';
    threadDiv.innerHTML = `<strong>${thread.user_name}</strong><p>${thread.content}</p>`;

    const { data: comments } = await supabase
      .from('comments')
      .select('*')
      .eq('thread_id', thread.id)
      .order('created_at');

    for (const comment of comments) {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      commentDiv.innerHTML = `<strong>${comment.user_name}</strong>: ${comment.comment_text}`;
      threadDiv.appendChild(commentDiv);
    }

    const commentForm = document.createElement('form');
    commentForm.className = 'comment-form';
    commentForm.onsubmit = (e) => submitComment(e, thread.id);
    commentForm.innerHTML = `
      <input type="text" name="username" placeholder="名前">
      <input type="text" name="comment" placeholder="コメント">
      <button type="submit">コメント</button>
    `;
    threadDiv.appendChild(commentForm);

    threadsContainer.appendChild(threadDiv);
  }
}
