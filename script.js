const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_PUBLIC_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

    // コメント一覧
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

    // コメント投稿フォーム
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
