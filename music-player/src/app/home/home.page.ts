import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomePage implements OnInit {
  playlist: File[] = [];
  currentIndex: number = 0;

  ngOnInit() {
    this.loadSavedPlaylist();

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const newFiles = Array.from(fileInput.files || []);
        this.playlist = this.playlist.concat(newFiles);
        if (this.playlist.length === newFiles.length) {
          this.loadAndPlay(0); // 第一次加入就播放第一首
        }
        this.displayPlaylist();
        this.savePlaylist();
      });
    }
  }

  get audioPlayer(): HTMLAudioElement {
    return document.getElementById('audioPlayer') as HTMLAudioElement;
  }

  get playlistElement(): HTMLUListElement {
    return document.getElementById('playlist') as HTMLUListElement;
  }

  displayPlaylist() {
    const playlistEl = this.playlistElement;
    if (!playlistEl) return;

    playlistEl.innerHTML = '';
    this.playlist.forEach((file, index) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '5px 10px';

      const span = document.createElement('span');
      span.textContent = file.name;
      span.style.cursor = 'pointer';
      if (index === this.currentIndex) span.style.fontWeight = 'bold';

      span.addEventListener('click', () => {
        this.currentIndex = index;
        this.loadAndPlay(this.currentIndex);
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
        this.removeFromPlaylist(index);
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      playlistEl.appendChild(li);
    });
  }

  loadAndPlay(index: number) {
    const file = this.playlist[index];
    if (!file) return;
    this.audioPlayer.src = URL.createObjectURL(file);
    this.audioPlayer.play();
    const nowPlaying = document.getElementById('nowPlaying');
    if (nowPlaying) nowPlaying.textContent = `Now playing: ${file.name}`;
    this.displayPlaylist();
  }

  playAudio() {
    this.audioPlayer.play();
  }

  pauseAudio() {
    this.audioPlayer.pause();
  }

  playNext() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadAndPlay(this.currentIndex);
  }

  playPrev() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadAndPlay(this.currentIndex);
  }

  savePlaylist() {
    const names = this.playlist.map(file => file.name);
    localStorage.setItem('playlist', JSON.stringify(names));
  }

  loadSavedPlaylist() {
    const names = JSON.parse(localStorage.getItem('playlist') || '[]');
    const playlistEl = this.playlistElement;
    if (!playlistEl) return;

    playlistEl.innerHTML = '';
    names.forEach((name: string) => {

      const li = document.createElement('li');
      li.textContent = `${name} (需重新上傳)`;
      playlistEl.appendChild(li);
    });
  }

  removeFromPlaylist(index: number) {
    this.playlist.splice(index, 1);
    if (this.currentIndex >= index) {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
    }
    this.displayPlaylist();
    this.savePlaylist();
  }
}
