import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://itxwvrjbrswgqsdcvbmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHd2cmpicnN3Z3FzZGN2Ym1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTk1ODksImV4cCI6MjA2NjY3NTU4OX0.xC5Xg3bgD8lTjSPodU1LW432A4zTWJXBsJ665mmExQU'
)

let currentUser = null

// ログイン処理
document.getElementById('loginBtn').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim()
  const password = document.getElementById('password').value.trim()

  if (password === 'wakakusa') {
    currentUser = name || '名無し'
    localStorage.setItem('userName', currentUser)
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  } else {
    document.getElementById('login-error').textContent = 'パスワードが間違っています'
  }
})

// 投稿処理
document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const comment = document.getElementById('comment').value.trim()

  if (!comment) return

  const { error } = await supabase.from('posts').insert([
    { user_name: currentUser, comment: comment }
  ])

  if (error) {
    alert('投稿に失敗しました')
    return
  }

  document.getElementById('comment').value = ''
  loadPosts()
})

// 投稿読み込み
async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('取得失敗:', error.message)
    return
  }

  const postsDiv = document.getElementById('posts')
  postsDiv.innerHTML = ''

  data.forEach(post => {
    const div = document.createElement('div')
    div.className = 'post'
    div.innerHTML = `
      <p><strong>${post.user_name}</strong>: ${post.comment}</p>
      <hr />
    `
    postsDiv.appendChild(div)
  })
}

// 自動ログイン処理
window.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem('userName')
  if (name) {
    currentUser = name
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  }
})
