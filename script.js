let playlist = [];
let currentIndex = 0;
const fileInput = document.getElementById('fileInput');
const playlistElement = document.getElementById('playlist');
const audioPlayer = document.getElementById('audioPlayer');

// 初始化：加入 demo 並讀取儲存清單
window.addEventListener('load', () => {
  const demo = {
    name: 'demo.mp3',
    url: 'assets/demo.mp3',
    isDemo: true
  };
  playlist.push(demo);

  const saved = localStorage.getItem('playlist');
  if (saved) {
    const savedTracks = JSON.parse(saved);
    savedTracks.forEach(track => {
      playlist.push({
        name: track.name,
        file: null,
        isDemo: false
      });
    });
  }

  currentIndex = 0;
  loadAndPlay(currentIndex);
  displayPlaylist();
});

// 使用者上傳歌曲後加入清單
fileInput.addEventListener('change', function () {
  const newFiles = Array.from(fileInput.files).map(file => ({
    name: file.name,
    file: file,
    isDemo: false
  }));
  playlist = playlist.concat(newFiles);
  if (playlist.length === newFiles.length + 1) {
    loadAndPlay(1);
  }
  displayPlaylist();
  savePlaylist(); // 儲存清單
});

// 顯示播放清單
function displayPlaylist() {
  playlistElement.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.padding = '5px 10px';

    const span = document.createElement('span');
    span.textContent = track.name + (track.isDemo ? ' (Demo)' : '');
    span.style.cursor = 'pointer';
    if (index === currentIndex) span.style.fontWeight = 'bold';

    span.addEventListener('click', () => {
      currentIndex = index;
      loadAndPlay(currentIndex);
    });

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

// 播放指定曲目
function loadAndPlay(index) {
  const track = playlist[index];
  if (!track) return;
  if (track.isDemo) {
    audioPlayer.src = track.url;
  } else if (track.file) {
    audioPlayer.src = URL.createObjectURL(track.file);
  } else {
    audioPlayer.src = '';
  }
  audioPlayer.play();
  document.getElementById('nowPlaying').textContent = `Now playing: ${track.name}`;
  displayPlaylist();
}

// 播放控制按鈕
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

function removeFromPlaylist(index) {
  playlist.splice(index, 1);
  if (playlist.length === 0) {
    audioPlayer.pause();
    audioPlayer.src = '';
    document.getElementById('nowPlaying').textContent = 'Now playing: -';
    currentIndex = 0;
  } else {
    if (currentIndex >= index) currentIndex = Math.max(0, currentIndex - 1);
    loadAndPlay(currentIndex);
  }
  displayPlaylist();
  savePlaylist(); // 更新儲存
}

// 儲存播放清單到 localStorage（不含 demo 與檔案內容）
function savePlaylist() {
  const savable = playlist.filter(t => !t.isDemo).map(t => ({ name: t.name }));
  localStorage.setItem('playlist', JSON.stringify(savable));
}
