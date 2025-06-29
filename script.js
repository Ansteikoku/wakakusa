import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...略...ExQU'
const supabase = createClient(supabaseUrl, supabaseKey)

let currentUser = null

// ログイン処理
window.login = () => {
  const name = document.getElementById('name').value
  const password = document.getElementById('password').value

  if (password === 'wakakusa') {  // ←ここを修正
    currentUser = name
    localStorage.setItem('userName', name)
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  } else {
    document.getElementById('login-error').textContent = 'パスワードが違います'
  }
}

// 投稿処理
document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const comment = document.getElementById('comment').value

  await supabase.from('posts').insert([{
    user_name: currentUser,
    comment: comment
  }])

  document.getElementById('comment').value = ''
  loadPosts()
})

// 投稿読み込み
const loadPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

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

// 自動ログイン判定
window.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem('userName')
  if (name) {
    currentUser = name
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  }
})
