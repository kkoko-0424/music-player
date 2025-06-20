let playlist = [];
let currentIndex = 0;
const fileInput = document.getElementById('fileInput');
const playlistElement = document.getElementById('playlist');
const audioPlayer = document.getElementById('audioPlayer');

// 多首歌曲累加加入播放清單
fileInput.addEventListener('change', function () {
  const newFiles = Array.from(fileInput.files);
  playlist = playlist.concat(newFiles);
  if (playlist.length === newFiles.length) {
    // 第一次加入，立刻播放
    loadAndPlay(0);
  }
  displayPlaylist();
  savePlaylist();
});

// 顯示播放清單，每首歌一個刪除按鈕
function displayPlaylist() {
  playlistElement.innerHTML = '';
  playlist.forEach((file, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.padding = '5px 10px';

    // 歌名部分
    const span = document.createElement('span');
    span.textContent = file.name;
    span.style.cursor = 'pointer';
    if (index === currentIndex) span.style.fontWeight = 'bold';

    // 點選歌名 → 播放
    span.addEventListener('click', () => {
      currentIndex = index;
      loadAndPlay(currentIndex);
    });

    // 刪除按鈕
    const delBtn = document.createElement('button');
    delBtn.textContent = '刪除';
    delBtn.style.backgroundColor = '#330020';
    delBtn.style.border = '1px solid #ff4fcb';
    delBtn.style.color = '#ff4fcb';
    delBtn.style.borderRadius = '5px';
    delBtn.style.padding = '2px 6px';
    delBtn.style.cursor = 'pointer';

    delBtn.addEventListener('click', () => {
      removeFromPlaylist(index);
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    playlistElement.appendChild(li);
  });
}

// 播放歌曲
function loadAndPlay(index) {
  const file = playlist[index];
  if (!file) return;
  audioPlayer.src = URL.createObjectURL(file);
  audioPlayer.play();
  document.getElementById('nowPlaying').textContent = `Now playing: ${file.name}`;
  displayPlaylist();
}

function playAudio() {
  audioPlayer.play();
}

function pauseAudio() {
  audioPlayer.pause();
}

function playNext() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadAndPlay(currentIndex);
}

function playPrev() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadAndPlay(currentIndex);
}

function savePlaylist() {
  const names = playlist.map(file => file.name);
  localStorage.setItem('playlist', JSON.stringify(names));
}

function loadSavedPlaylist() {
  const names = JSON.parse(localStorage.getItem('playlist')) || [];
  playlistElement.innerHTML = '';
  names.forEach(name => {
    const li = document.createElement('li');
    li.textContent = `${name} (需重新上傳)`;
    playlistElement.appendChild(li);
  });
}

function removeFromPlaylist(index) {
  playlist.splice(index, 1);
  if (currentIndex >= index) currentIndex = Math.max(0, currentIndex - 1);
  displayPlaylist();
  savePlaylist();
}

window.onload = loadSavedPlaylist;
