import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

document.addEventListener('DOMContentLoaded', () => {
  const mic_btn = document.querySelector('#mic')
  const playback = document.querySelector('.playback')
  const playBtn = document.getElementById('playBtn')

  mic_btn.addEventListener('click', ToggleMic)

  let can_record = false
  let is_recording = false
  let recorder = null
  let chunks = []

  function SetupAudio() {
    console.log('Setup')
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(SetupStream)
        .catch((err) => {
          console.error(err)
        })
    }
  }

  SetupAudio()

  function SetupStream(stream) {
    recorder = new MediaRecorder(stream)

    recorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    recorder.onstop = (e) => {
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
      chunks = []
      const audioURL = window.URL.createObjectURL(blob)
      playback.src = audioURL
      wavesurfer.load(audioURL) // Load the recorded audio into WaveSurfer
    }

    can_record = true
  }

  function ToggleMic() {
    if (!can_record) return

    is_recording = !is_recording

    if (is_recording) {
      recorder.start()
      mic_btn.classList.add('is-recording')
    } else {
      recorder.stop()
      mic_btn.classList.remove('is-recording')
    }
  }

  const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'crimson',
    progressColor: '#383351',
    barWidth: 4,
    responsive: true,
    height: 90,
    barRadius: 4
  })

  

  playBtn.onclick = function() {
    wavesurfer.playPause()
    if (playBtn.src.includes("play_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg")) {
      playBtn.src = "media/pause_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
    } else {
      playBtn.src = "media/play_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
    }
  }

  wavesurfer.on('finish', function() {
    playBtn.src = "media/play_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
    wavesurfer.stop()
  })
})
